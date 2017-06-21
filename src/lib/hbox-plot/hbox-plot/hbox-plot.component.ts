import {
  Component, OnInit, Input, AfterViewInit, OnChanges, OnDestroy, NgZone, ChangeDetectorRef,
  ElementRef, SimpleChanges, ChangeDetectionStrategy, EventEmitter, Output
} from '@angular/core';
import {D3, d3, Selection, ScaleLinear} from "../../d3service";
import {Axis} from "d3-axis";
import {ScaleBand} from "d3-scale";
import {BoxUtil} from "../box-util";
import {BD2ColorPalette} from "../color-palette";
import {BoxDefinition} from "../box-dom";
import {SmartRounder} from "../smart-rounding";


export class LookAndFeel {

  vMargin = 25;
  hMarginL = 20;
  hMarginR = 15;
  rowWidth = 30;
  rowGap = 0.2;

  boxStrokeWidth = '2px';
  boxFillOpacity = 0.35;
  meanStrokeWidth = '4px';

  labelFont = '12px';
  labelFillOpacity = 0.35;
  backLabelOpacity = 0.30;

  backdropColor = 'white';
  backdropOpacity = 1;

  whiskerStrokeWidth = '1px';

  outliersStrokeWidth = '1px';
  outliersCircleRadius = 3;
  outliersFillOpacity = 0.4;
}


export let defualtLookAndFeel: () => LookAndFeel = function () {
  return new LookAndFeel();
};

export class GraphicContext {
  workspaceWidth: number;
  workspaceHeight: number;

  axisWrapper: Selection<SVGGElement, any, null, undefined>;
  xScale: ScaleLinear<number, number>;
  xTopAxis: Axis<number | { valueOf(): number }>;
  xBottomAxis: Axis<number | { valueOf(): number }>;

  yScale: ScaleBand<string>;
  yLeftAxis: Axis<string>;
  yRightAxis: Axis<string>;

  palette: string[];

  dataWrapper: Selection<SVGGElement, any, null, undefined>;

  tooltipWrapper: Selection<SVGGElement, any, null, undefined>;
  tooltipText: Selection<SVGGElement, any, null, undefined>;
  tooltipBox: Selection<SVGGElement, any, null, undefined>;

  labelsWrapper: Selection<SVGGElement, any, null, undefined>;
  backLabelsWrapper: Selection<SVGGElement, any, null, undefined>;
}

function offsetScaleValue(x: number, pixOffset: number, scale: ScaleLinear<number, number>) {
  let r = scale.range();
  let pos = scale(x) + pixOffset;
  if (pos < r[0]) {
    return r[0];
  } else if (pos > r[1]) {
    return r[1];
  }
  return pos;
}


@Component({
  selector: 'bd2-ngx-hbox-plot',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="hbox-plot" [hidden]="hidden"></div>
  `,
  styles: [
      `
      :host /deep/ .axisWrapper path {
        stroke: gray;
      }

      :host /deep/ .axisWrapper line {
        stroke: gray;
      }

      :host /deep/ .axisWrapper text {
        fill: gray;
      }
    `
  ]
})
export class HBoxPlotComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {

  /**
   * Necessary to control hiding of the element, otherwise the BBoxes are not defined and labels
   * were not rendered in correct places.
   * @type {boolean}
   */
  @Input()
  hidden = false;


  @Input()
  data: number[][];

  @Input()
  domain: number[] = [17, 36];

  @Input()
  palette: string[] = [];

  @Input()
  labels: string[] = [];

  @Input()
  labelsOn = 'always'; //trigger //null

  @Input()
  lookAndFeel = defualtLookAndFeel();

  @Output()
  colors = new EventEmitter<string[]>();

  private d3: D3;
  private parentNativeElement: any;
  private d3Svg: Selection<SVGSVGElement, any, null, undefined>;
  private removed: Selection<SVGSVGElement, any, null, undefined>;

  private mainPane: Selection<SVGGElement, any, null, undefined>;

  private graphicContext = new GraphicContext();
  private boxUtil = new BoxUtil();

  constructor(private ngZone: NgZone, private changeDetectorRef: ChangeDetectorRef, element: ElementRef) {
    this.d3 = d3;
    this.parentNativeElement = element.nativeElement;

  }

  /**
   * It is detached from angular to prevent unnecessary change detection
   */
  ngAfterViewInit() {
    this.changeDetectorRef.detach();
    //console.log("AFI");
  }

  /**
   * Explicit triggers re-drawing as need to have all the parameters set (so will not redrawn if data came frist and domain later)
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {

    //console.log("Changes", changes);

    //otherwise the hidden on inner div was not updated
    this.changeDetectorRef.detectChanges();


    this.initSVG();

    //this.handleHiding();

    if (!this.data) {
      return;
    }

    if (!this.hidden) {
      this.updatePlot();
    }
  }

  isDataUpdate(changes: any): boolean {

    return (changes.data || changes.domain || changes.palette || changes.labels );
  }

  initSVG() {
    if (!this.d3Svg) {
      let d3ParentElement = this.d3.select(this.parentNativeElement);
      this.d3Svg = d3ParentElement.select('.hbox-plot').append<SVGSVGElement>('svg');
      this.d3Svg.attr('width', '0');
    }
  }

  ngOnInit() {

    if (this.parentNativeElement !== null) {


    } else {
      console.error('Missing parrent element for the component');
    }
  }

  ngOnDestroy() {
    if (this.d3Svg && this.d3Svg.empty && !this.d3Svg.empty()) {
      this.d3Svg.selectAll('*').remove();
    }
  }

  /**
   * Only for testing
   * @param context
   */
  testGraphicContext(context: GraphicContext) {
    this.graphicContext = context;
  }

  /* Not needed any more, the hidding is achieved by simple div hidden attribute
   // and the problem with labels background rendering is solved using delayed rendering with a timer.
   handleHiding() {
   if (this.hidden) {
   this.removed = this.d3Svg.remove();
   } else {
   if (this.removed) {
   this.d3.select(this.parentNativeElement)
   .select('.hbox-plot')
   .append(() => this.d3Svg.node());
   this.removed = undefined;
   }
   }

   }*/

  updatePlot() {


    this.graphicContext = this.updatePalette(this.data, this.palette, this.graphicContext);
    let boxes = this.prepareDataModel(this.data, this.labels, this.graphicContext.palette, this.domain);


    this.graphicContext = this.preparePane(this.data, this.lookAndFeel, this.graphicContext);

    this.graphicContext = this.prepareScales(boxes, this.domain, this.lookAndFeel, this.graphicContext);

    this.graphicContext = this.plotAxisBox(boxes, this.domain, this.lookAndFeel, this.mainPane, this.graphicContext);


    this.graphicContext = this.plotDataBoxes(boxes, this.lookAndFeel, this.mainPane, this.graphicContext);

    this.graphicContext = this.prepareTooltip(this.mainPane, this.graphicContext);

    this.graphicContext = this.prepareLabels(boxes, this.mainPane, this.lookAndFeel, this.graphicContext, this.labelsOn);

  }

  prepareDataModel(data: number[][], labels: string[], palette: string[], domain: number[]): BoxDefinition[] {

    let boxes = this.boxUtil.dataToBoxes(data);

    this.boxUtil.mockEmptyValues(boxes, domain[1]);
    this.labelBoxes(boxes, labels);

    this.colorBoxes(boxes, palette);

    return boxes;

  }


  updatePalette(data: any[], palette: string[], graphicContext: GraphicContext): GraphicContext {

    if (!palette || palette.length === 0) {
      graphicContext.palette = BD2ColorPalette.palette(data.length);
    } else {
      graphicContext.palette = BD2ColorPalette.extendPalette(palette, data.length);

    }
    this.colors.next(graphicContext.palette.slice());

    return graphicContext;
  }

  colorBoxes(boxes: BoxDefinition[], palette: string[]) {
    boxes.forEach(b => b.color = palette[b.ix]);
  }


  preparePane(data: any[], lookAndFeel: LookAndFeel, graphicContext: GraphicContext): GraphicContext {

    //console.log("PP",data);

    if (!this.mainPane) {
      //let d3ParentElement = this.d3.select(this.parentNativeElement);
      //this.d3Svg = d3ParentElement.select('.hbox-plot').append<SVGSVGElement>('svg');
      this.d3Svg.attr('width', '100%');

      this.mainPane = this.d3Svg.append<SVGGElement>('g');
      this.mainPane.classed("mainPane", true);

    }

    let pWidth = 500;
    let pHeight = this.calculateWorkspaceHeight(data, lookAndFeel) + 2 * lookAndFeel.vMargin;

    this.d3Svg.attr('viewBox', '0 0 ' + pWidth + ' ' + pHeight);
    this.mainPane.attr('transform', 'translate(' + lookAndFeel.hMarginL + ',' + lookAndFeel.vMargin + ')');
    //.attr('transform', 'translate(' + (pWidth / 2) + ',' + (pHeight / 2) + ')'); //moves 0,0 of the pain to the middle of the graphics

    graphicContext.workspaceWidth = pWidth - lookAndFeel.hMarginL - lookAndFeel.hMarginR;
    graphicContext.workspaceHeight = pHeight - 2 * lookAndFeel.vMargin;

    return graphicContext;

  }

  calculateWorkspaceHeight(data: any[], lookAndFeel: LookAndFeel) {
    return lookAndFeel.rowWidth * data.length;

  }


  labelBoxes(boxes: BoxDefinition[], labels: string[]) {
    if (!labels) {
      labels = [];
    }
    ;

    boxes.forEach((b, ix) => {
      b.label = labels[ix] ? labels[ix] : "" + (ix + 1);
    });
  }

  prepareLabels(boxes: BoxDefinition[], mainPane: Selection<SVGGElement, any, null, undefined>, lookAndFeel: LookAndFeel,
                graphicContext: GraphicContext, labelsOn: string): GraphicContext {

    if (!graphicContext.labelsWrapper) {
      graphicContext.labelsWrapper = mainPane.append<SVGGElement>('g')
        .classed("labelsWrapper", true);
    }

    if (!graphicContext.backLabelsWrapper) {
      graphicContext.backLabelsWrapper = mainPane.insert<SVGGElement>('g', 'g.dataWrapper')
        .classed("backLabelsWrapper", true);
    }

    let backLabelsOn = labelsOn === 'always';
    let mainLabelsOn = labelsOn === 'always' || labelsOn === 'trigger';


    let labels = graphicContext.labelsWrapper.selectAll("g.yLabel")
      .data(mainLabelsOn ? boxes : []);

    labels.exit().remove();

    let newLabels = labels.enter()
      .append<SVGGElement>('g')
      .classed("yLabel", true);

    this.ngZone.runOutsideAngular(() => {
      newLabels.on('mouseover', function (d, i) {
        d3.select(this)
          .selectAll(".yLabel")
          .style("visibility", "visible");
      }).on('mouseout', function () {
        d3.select(this)
          .selectAll(".yLabel")
          .style("visibility", "hidden");
      });
    });

    newLabels.append<SVGGElement>("rect")
      .attr("class", "yTrigger")
      .style("fill-opacity", 1)
    ;

    newLabels.append<SVGGElement>("rect")
      .attr("class", "yLabel")
      .style("fill-opacity", 0.35)
      .style("visibility", "hidden");

    newLabels.append<SVGGElement>('text')
      .attr("class", "yLabel")
      .attr("text-anchor", "left")
      .attr("dominant-baseline", "central")
      .style("font-size", lookAndFeel.labelFont)
      .style("opacity", 1)
      .attr('x', 5)
      .style("visibility", "hidden");

    let backLabels = graphicContext.backLabelsWrapper.selectAll("g.yLabel")
      .data(backLabelsOn ? boxes : []);

    backLabels.exit().remove();

    let newBackLabels = backLabels.enter()
      .append<SVGGElement>('g')
      .classed("yLabel", true);

    /*
     newBackLabels.append<SVGGElement>("rect")
     .attr("class", "yLabel")
     .style("fill-opacity", 0.05);
     */

    newBackLabels.append<SVGGElement>('text')
      .attr("class", "yLabel")
      .attr("text-anchor", "left")
      .attr("dominant-baseline", "central")
      .style("font-size", lookAndFeel.labelFont)
      .style("opacity", lookAndFeel.backLabelOpacity)
      .attr('x', 5);
    //.style("visibility", "hidden");


    let enterUpdate: Selection<SVGSVGElement, BoxDefinition, null, undefined> =
      <Selection<SVGSVGElement, BoxDefinition, null, undefined>> newLabels.merge(<any>labels);

    let backEnterUpdate: Selection<SVGSVGElement, BoxDefinition, null, undefined> =
      <Selection<SVGSVGElement, BoxDefinition, null, undefined>> newBackLabels.merge(<any>backLabels);

    //called with delay to allow, parent divs to component sets their visibility, otherwise the bboxes cannot be calculated
    //and the labels backgrounds and trigers are not rendered correctly
    //it is a hack, but don't know how to do it correctly
    setTimeout(() => {


      let bboxes: SVGRect[] = [];

      enterUpdate.select<SVGSVGElement>("text")
        .attr('y', d => graphicContext.yScale(d.key) + graphicContext.yScale.bandwidth() / 2)
        .text(d => d.label)
        .each(function (d) {
          bboxes.push(this.getBBox());
          //console.log("D: " + d.label, this.getBBox());
        });

      backEnterUpdate.select<SVGSVGElement>("text")
        .attr('y', d => graphicContext.yScale(d.key) + graphicContext.yScale.bandwidth() / 2)
        .text(d => d.label)
        //.style("fill", d => d.color)
        .each(function (d) {
          bboxes.push(this.getBBox());
          //console.log("D: " + d.label, this.getBBox());
        });

      let trigers = enterUpdate.select<SVGSVGElement>(".yTrigger")
        .style("fill", d => d.color)
        .style("stroke", d => d.color);


      trigers.data(bboxes)
        .attr("x", -7)
        .attr("y", b => b.y - 3)
        .attr("width", b => 7)
        .attr("height", b => b.height + 6);

      let frames = enterUpdate.select<SVGSVGElement>("rect.yLabel")
        .style("fill", d => d.color)
        .style("fill-opacity", lookAndFeel.labelFillOpacity);

      frames.data(bboxes)
        .attr("x", 0)
        .attr("y", b => b.y - 3)
        .attr("width", b => b.width + 10)
        .attr("height", b => b.height + 7);


      /*
       let backFrames = backEnterUpdate.select<SVGSVGElement>("rect.yLabel")
       .style("fill", d => d.color);

       backFrames.data(bboxes)
       .attr("x", 0)
       .attr("y", b => b.y - 3)
       .attr("width", b => b.width + 10)
       .attr("height", b => b.height + 7);
       */

    }, 10);

    return graphicContext;
  }


  prepareTooltip(mainPane: Selection<SVGGElement, any, null, undefined>, graphicContext: GraphicContext): GraphicContext {

    if (graphicContext.tooltipWrapper) {
      return graphicContext;
    }

    graphicContext.tooltipWrapper = mainPane.append<SVGGElement>('g')
      .classed("tooltipWrapper", true);

    graphicContext.tooltipBox = graphicContext.tooltipWrapper.append<SVGGElement>("rect")
      .style("fill", "white")
      .style("fill-opacity", 0.8)
      .style("stroke", "grey")
    //.style("visibility", "hidden");
    ;

    graphicContext.tooltipText = graphicContext.tooltipWrapper.append<SVGGElement>("text")
      .attr("class", "tooltip")
      //.attr("text-anchor", "left")
      .attr("text-anchor", "middle")
      //.attr("alignment-baseline", "middle")
      //.attr("alignment-baseline", "baseline")
      //.attr("dy", "-10px")
      .style("opacity", 1)
    //.attr("dx", "0.35em")
    //.style("font-size", this.lookAndFeel.tooltipFontSize) //"11px")
    //.style("opacity", 0)
    ;

    graphicContext.tooltipWrapper
      .style("visibility", "hidden");

    return graphicContext;
  }

  showTooltip(v: number, x: any, y: any) {
    //console.log("Show: " + v + ";" + this.constructor.name);

    if (!this.graphicContext.tooltipText) {
      return;
    }

    this.graphicContext.tooltipText
      .attr('x', this.graphicContext.xScale(x))
      .attr('y', this.graphicContext.yScale(y))
      .text(SmartRounder.round(v))
    //.transition().duration(this.lookAndFeel.baseTransitionsTime / 2)
    //.style('opacity', 1);
    ;

    let bbox = this.graphicContext.tooltipText.node().getBBox();

    this.graphicContext.tooltipBox
      .attr("x", bbox.x - 3)
      .attr("y", bbox.y - 2)
      .attr("width", bbox.width + 6)
      .attr("height", bbox.height + 4);

    this.graphicContext.tooltipWrapper
      .style("visibility", "visible")
    ;

  };

  hideTooltip() {
    //console.log("Hide: ");
    if (!this.graphicContext.tooltipText) {
      return;
    }
    ;

    this.graphicContext.tooltipWrapper
      .style("visibility", "hidden")
    ;

    //this.graphicContext.tooltipText
    //.transition().duration(this.lookAndFeel.baseTransitionsTime / 2)
    //.style("opacity", 0);
  }

  prepareScales(data: BoxDefinition[], domain: number[], lookAndFeel: LookAndFeel,
                graphicContext: GraphicContext): GraphicContext {

    if (!graphicContext.xScale) {
      graphicContext.xScale = d3.scaleLinear()
        .clamp(true);
    }

    graphicContext.xScale
      .domain(domain)
      .range([0, graphicContext.workspaceWidth]);

    if (!graphicContext.yScale) {
      graphicContext.yScale = d3.scaleBand()
        .padding(lookAndFeel.rowGap)
      ;
    }

    let domainY = data.map((d) => d.key);

    graphicContext.yScale
      .domain(domainY)
      .range([0, graphicContext.workspaceHeight]);


    return graphicContext;
  }

  plotAxisBox(data: BoxDefinition[], domain: number[], lookAndFeel: LookAndFeel, mainPane: Selection<SVGGElement, any, null, undefined>,
              graphicContext: GraphicContext): GraphicContext {

    if (!graphicContext.axisWrapper) {
      graphicContext.axisWrapper = this.initAxisWrapper(mainPane);
    }

    graphicContext = this.plotHorizontalScales(domain, lookAndFeel, graphicContext);
    graphicContext = this.plotVerticalScales(data, lookAndFeel, graphicContext);

    return graphicContext;

  }

  initAxisWrapper(mainPane: Selection<SVGGElement, any, null, undefined>): Selection<SVGGElement, any, null, undefined> {

    let wrapper = mainPane.select<SVGGElement>(".axisWrapper");
    if (wrapper.size() === 0) {
      wrapper = mainPane.append<SVGGElement>("g").attr("class", "axisWrapper");

      wrapper.append("g").attr("class", "xTopAxis");
      wrapper.append("g").attr("class", "xBottomAxis");
      wrapper.append("g").attr("class", "yLeftAxis");
      wrapper.append("g").attr("class", "yRightAxis");

    }
    return wrapper;
  }

  plotHorizontalScales(domain: number[], lookAndFeel: LookAndFeel, graphicContext: GraphicContext): GraphicContext {


    if (!graphicContext.xTopAxis) {
      graphicContext.xTopAxis = d3.axisTop(graphicContext.xScale);
    }

    if (!graphicContext.xBottomAxis) {
      graphicContext.xBottomAxis = d3.axisBottom(graphicContext.xScale);
    }


    graphicContext.axisWrapper
      .select("g.xTopAxis")
      .call(graphicContext.xTopAxis);

    graphicContext.axisWrapper
      .select("g.xBottomAxis")
      .attr("transform", "translate(0," + graphicContext.workspaceHeight + ")")
      .call(graphicContext.xBottomAxis);

    return graphicContext;

  }

  plotVerticalScales(data: BoxDefinition[], lookAndFeel: LookAndFeel, graphicContext: GraphicContext): GraphicContext {


    if (!graphicContext.yLeftAxis) {
      graphicContext.yLeftAxis = d3.axisLeft(graphicContext.yScale)
        .tickFormat(() => "")
      ;
    }

    if (!graphicContext.yRightAxis) {
      graphicContext.yRightAxis = d3.axisRight(graphicContext.yScale)
        .tickValues([])
      ;
    }

    graphicContext.axisWrapper
      .select("g.yLeftAxis")
      .call(graphicContext.yLeftAxis);


    graphicContext.axisWrapper
      .select("g.yRightAxis")
      .attr("transform", "translate(" + graphicContext.workspaceWidth + ",0)")
      .call(graphicContext.yRightAxis);

    return graphicContext;

  }


  plotDataBoxes(boxes: BoxDefinition[], lookAndFeel: LookAndFeel, mainPane: Selection<SVGGElement, any, null, undefined>,
                graphicContext: GraphicContext): GraphicContext {

    if (!graphicContext.dataWrapper) {
      graphicContext.dataWrapper = mainPane.append<SVGGElement>("g").attr("class", "dataWrapper");
    }
    ;

    let boxWidgets = <Selection<SVGGElement, BoxDefinition, null, undefined>> graphicContext.dataWrapper.selectAll(".boxWidget")
      .data(boxes);


    this.updateBoxWidgets(boxWidgets, lookAndFeel, graphicContext);

    let newBoxWidgets = boxWidgets.enter()
      .append<SVGGElement>("g").attr("class", "boxWidget");


    this.createBoxWidgets(newBoxWidgets, lookAndFeel, graphicContext);

    boxWidgets.exit().remove();


    return graphicContext;
  }

  updateBoxWidgets(boxWidgets: Selection<SVGGElement, BoxDefinition, null, undefined>,
                   lookAndFeel: LookAndFeel, graphicContext: GraphicContext) {

    boxWidgets.select("rect.backdrop")
      .call(this.positionBackdrop, graphicContext);

    this.updateWhiskers(<any> boxWidgets.select("g.whiskers"), graphicContext);

    boxWidgets.select("g.box rect")
      .call(this.positionBoxRectangle, graphicContext);

    boxWidgets.select("g.box line.medianline")
      .call(this.positionMedianLine, graphicContext);

    boxWidgets.select("g.box line.meanline")
      .call(this.positionMeanLine, graphicContext);

    let out = boxWidgets.select("g.outliers").selectAll(".outlier")
      .data(d => d.outliers.map(x => [x, d.key, d.color]));

    out.enter()
      .call(this.createOutlier, lookAndFeel, graphicContext, this.positionOutlier);

    out.call(this.positionOutlier, graphicContext);

    out.exit().remove();

  }


  positionBackdrop(elm: Selection<SVGGElement, BoxDefinition, null, undefined>, graphicContext: GraphicContext) {

    elm.attr("x", (d) => offsetScaleValue(d.lowWskr, -5, graphicContext.xScale))
      .attr("y", (d) => {
        return graphicContext.yScale(d.key);
      })
      .attr("width", (d) => {
        let x1 = offsetScaleValue(d.lowWskr, -5, graphicContext.xScale);
        let x2 = offsetScaleValue(d.highWskr, +5, graphicContext.xScale);
        return x2 - x1;
      })
      .attr("height", (d) => {
        return graphicContext.yScale.bandwidth();
      })
    //.style("stroke", d => d.color)
    //.style("fill", d => d.color)
    ;

  }

  positionBoxRectangle(elm: Selection<SVGGElement, BoxDefinition, null, undefined>, graphicContext: GraphicContext) {

    elm.attr("x", (d) => graphicContext.xScale(d.fstQnt))
      .attr("y", (d) => {
        return graphicContext.yScale(d.key);
      })
      .attr("width", (d) => (graphicContext.xScale(d.thrdQnt) - graphicContext.xScale(d.fstQnt)))
      .attr("height", (d) => {
        return graphicContext.yScale.bandwidth();
      })
      .style("stroke", d => d.color)
      .style("fill", d => d.color);

  }

  positionMedianLine(elm: Selection<SVGGElement, BoxDefinition, null, undefined>, graphicContext: GraphicContext) {

    elm.attr("x1", (d, i) => graphicContext.xScale(d.median))
      .attr("y1", (d, i) => graphicContext.yScale(d.key))
      .attr("x2", (d, i) => graphicContext.xScale(d.median))
      .attr("y2", (d, i) => graphicContext.yScale(d.key) + graphicContext.yScale.bandwidth())
      .style("stroke", d => d.color)
      .style("visibility", d => d.mean === d.median ? "hidden" : "visible");

    ;

  }

  positionMeanLine(elm: Selection<SVGGElement, BoxDefinition, null, undefined>, graphicContext: GraphicContext) {

    elm.attr("x1", (d, i) => graphicContext.xScale(d.mean))
      .attr("y1", (d, i) => graphicContext.yScale(d.key))
      .attr("x2", (d, i) => graphicContext.xScale(d.mean))
      .attr("y2", (d, i) => graphicContext.yScale(d.key) + graphicContext.yScale.bandwidth())
      .style("stroke", d => d.color);
  }

  positionOutlier(elm: Selection<SVGGElement, any, null, undefined>, graphicContext: GraphicContext) {

    elm.attr("cx", d => graphicContext.xScale(d[0]))
      .attr("cy", d => graphicContext.yScale(d[1]) + graphicContext.yScale.bandwidth() / 2)
      .style("stroke", d => d[2])
      .style("fill", d => d[2]);

  }


  createOutlier(elm: Selection<SVGGElement, any, null, undefined>, lookAndFeel: LookAndFeel, graphicContext: GraphicContext,
                positionOutlierFunction: (elm: Selection<SVGGElement, any, null, undefined>, graphicContext: GraphicContext) => {}) {


    elm
      .append<SVGGElement>("circle")
      .attr("class", "outlier")
      .attr("r", lookAndFeel.outliersCircleRadius)
      .style("stroke-width", lookAndFeel.outliersStrokeWidth)
      .style("fill-opacity", lookAndFeel.outliersFillOpacity)
      .call(positionOutlierFunction, graphicContext)
    ;

  }

  positionWhiskerLine(elm: Selection<SVGGElement, BoxDefinition, null, undefined>, left: boolean, graphicContext: GraphicContext) {

    elm.attr("x1", (d, i) => left ? graphicContext.xScale(d.lowWskr) : graphicContext.xScale(d.thrdQnt))
      .attr("y1", (d, i) => graphicContext.yScale(d.key) + graphicContext.yScale.bandwidth() / 2)
      .attr("x2", (d, i) => left ? graphicContext.xScale(d.fstQnt) : graphicContext.xScale(d.highWskr))
      .attr("y2", (d, i) => graphicContext.yScale(d.key) + graphicContext.yScale.bandwidth() / 2)
      .style("stroke", d => d.color)
      .style("visibility", d => (left && (d.lowWskr === d.fstQnt)) || (!left && (d.highWskr === d.thrdQnt)) ? "hidden" : "visible");

    ;

  }

  positionWhiskerTip(elm: Selection<SVGGElement, BoxDefinition, null, undefined>, left: boolean, graphicContext: GraphicContext) {

    elm.attr("x1", (d, i) => left ? graphicContext.xScale(d.lowWskr) : graphicContext.xScale(d.highWskr))
      .attr("y1", (d, i) => graphicContext.yScale(d.key))
      .attr("x2", (d, i) => left ? graphicContext.xScale(d.lowWskr) : graphicContext.xScale(d.highWskr))
      .attr("y2", (d, i) => graphicContext.yScale(d.key) + graphicContext.yScale.bandwidth())
      .style("stroke", d => d.color)
      .style("visibility", d => (left && (d.lowWskr === d.fstQnt)) || (!left && (d.highWskr === d.thrdQnt)) ? "hidden" : "visible");

    ;

  }

  updateWhiskers(whiskers: Selection<SVGGElement, BoxDefinition, null, undefined>,
                 graphicContext: GraphicContext) {

    whiskers.select("line.whiskerlineL")
      .call(this.positionWhiskerLine, true, graphicContext);

    whiskers.select("line.whiskerlineR")
      .call(this.positionWhiskerLine, false, graphicContext);

    whiskers.select("line.whiskertipL")
      .call(this.positionWhiskerTip, true, graphicContext);

    whiskers.select("line.whiskertipR")
      .call(this.positionWhiskerTip, false, graphicContext);

  }

  createWhiskers(whiskers: Selection<SVGGElement, BoxDefinition, null, undefined>,
                 lookAndFeel: LookAndFeel, graphicContext: GraphicContext) {


    let lwhiskr = whiskers.append("line")
      .attr("class", "whiskerlineL")
      .style("stroke-width", lookAndFeel.whiskerStrokeWidth)
      .style("stroke-dasharray", "4 3")
      .call(this.positionWhiskerLine, true, graphicContext)
    ;
    let rwhiskr = whiskers.append("line")
      .attr("class", "whiskerlineR")
      .style("stroke-width", lookAndFeel.whiskerStrokeWidth)
      .style("stroke-dasharray", "4 3")
      .call(this.positionWhiskerLine, false, graphicContext)
    ;

    let lTip = whiskers.append("line")
      .attr("class", "whiskertipL")
      .style("stroke-width", lookAndFeel.whiskerStrokeWidth)
      .call(this.positionWhiskerTip, true, graphicContext)
    ;

    let rTip = whiskers.append("line")
      .attr("class", "whiskertipR")
      .style("stroke-width", lookAndFeel.whiskerStrokeWidth)
      .call(this.positionWhiskerTip, false, graphicContext)
    ;


  }

  createBoxes(widgets: Selection<SVGGElement, BoxDefinition, null, undefined>,
              lookAndFeel: LookAndFeel, graphicContext: GraphicContext) {

    let rect = widgets.append("rect")
      .attr("class", "box")
      .style("stroke-width", lookAndFeel.boxStrokeWidth)
      .style("fill-opacity", lookAndFeel.boxFillOpacity)
      .call(this.positionBoxRectangle, graphicContext);


    let median = widgets.append("line")
      .attr("class", "medianline")
      .style("stroke-width", lookAndFeel.boxStrokeWidth)
      .call(this.positionMedianLine, graphicContext);

    let instance = this;

    this.ngZone.runOutsideAngular(() => {
      rect.on('mouseover', function (d, i) {
        instance.showTooltip(d.median, d.median, d.key);
      })
        .on('mouseout', function () {
          instance.hideTooltip();
        });

      median.on('mouseover', function (d, i) {
        instance.showTooltip(d.median, d.median, d.key);
      })
        .on('mouseout', function () {
          instance.hideTooltip();
        });

    });

    let mean = widgets
      .append("line")
      .attr("class", "meanline")
      .style("stroke-width", lookAndFeel.meanStrokeWidth)
      .style("stroke-dasharray", "4 2")
      .call(this.positionMeanLine, graphicContext)
    ;

    this.ngZone.runOutsideAngular(() => {
      mean
        .on('mouseover', function (d, i) {
          instance.showTooltip(d.mean, d.mean, d.key);
        })
        .on('mouseout', function () {
          instance.hideTooltip();
        });


    });

  }

  createBoxWidgets(newBoxWidgets: Selection<SVGGElement, BoxDefinition, null, undefined>,
                   lookAndFeel: LookAndFeel, graphicContext: GraphicContext) {

    let instance = this;

    let backdrops = newBoxWidgets.append<SVGGElement>("rect").attr("class", "backdrop")
    //.style("stroke-width", lookAndFeel.boxStrokeWidth)
      .style("fill-opacity", lookAndFeel.backdropOpacity)
      .style("fill", lookAndFeel.backdropColor)
      .call(this.positionBackdrop, graphicContext);
    ;

    let whiskers = newBoxWidgets.append<SVGGElement>("g").attr("class", "whiskers");

    this.createWhiskers(whiskers, lookAndFeel, graphicContext);

    let boxes = newBoxWidgets.append<SVGGElement>("g").attr("class", "box");
    this.createBoxes(boxes, lookAndFeel, graphicContext);


    let outliers = newBoxWidgets.append<SVGGElement>("g").attr("class", "outliers");


    outliers.selectAll(".outlier")
      .data(d => d.outliers.map(x => [x, d.key, d.color]))
      .enter()
      .call(this.createOutlier, lookAndFeel, graphicContext, this.positionOutlier)
    ;

  }

}
