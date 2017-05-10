import {
  Component, OnInit, Input, AfterViewInit, OnChanges, OnDestroy, NgZone, ChangeDetectorRef,
  ElementRef, SimpleChanges, ChangeDetectionStrategy
} from '@angular/core';
import {D3, d3, Selection, ScaleLinear} from "../../d3service";
import {Axis} from "d3-axis";
import {ScaleBand} from "d3-scale";
import {BoxUtil} from "../box-util";
import {BD2ColorPalette} from "../color-palette";
import {BoxDefinition} from "../box-dom";
import {SmartRounder} from "../smart-rounding";


export interface LookAndFeel {
  vMargin: number;
  hMarginL: number;
  hMarginR: number;
  rowWidth: number;

  boxStrokeWidth: string;
  boxFillOpacity: number;
  meanStrokeWidth: string;

  outliersStrokeWidth: string;
  outliersCircleRadius: number;
  outliersFillOpacity: number;
}

export let defualtLookAndFeel: () => LookAndFeel = function () {
  let look: LookAndFeel = {
    vMargin: 25,
    hMarginL: 20,
    hMarginR: 15,
    rowWidth: 30,

    boxStrokeWidth: '2px',
    boxFillOpacity: 0.35,
    meanStrokeWidth: '4px',

    outliersStrokeWidth: '1px',
    outliersCircleRadius: 3,
    outliersFillOpacity: 0.35,

  };
  return look;
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
  //yRightAxis: Selection<SVGGElement, any, null, undefined>;

  pallete: string[];
  //dataPallete: (d, i) => string;

  dataWrapper: Selection<SVGGElement, any, null, undefined>;

  tooltipWrapper: Selection<SVGGElement, any, null, undefined>;
  tooltipText: Selection<SVGGElement, any, null, undefined>;
  tooltipBox: Selection<SVGGElement, any, null, undefined>;
  //showTooltip: (v: number, x: any, y: any) => void;
  //hideTooltip: () => void;

  labelsWrapper: Selection<SVGGElement, any, null, undefined>;
}


@Component({
  selector: 'bd2-ngx-hbox-plot',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="hbox-plot" style="border: 1px solid red;"></div>
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

  @Input()
  data: number[][];

  @Input()
  domain: number[] = [17, 36];

  private d3: D3;
  private parentNativeElement: any;
  private d3Svg: Selection<SVGSVGElement, any, null, undefined>;
  private mainPane: Selection<SVGGElement, any, null, undefined>;

  private lookAndFeel = defualtLookAndFeel();
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
  }

  /**
   * Explicit triggers re-drawing as need to have all the parameters set (so will not redrawn if data came frist and domain later)
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {

    if (!this.data) {
      return;
    }


    //console.log("Changes", changes);

    this.updatePlot();
  }


  ngOnInit() {

    if (this.parentNativeElement !== null) {

      //this.graphicContext.showTooltip = this.showTooltip;
      //this.graphicContext.hideTooltip = this.hideTooltip;
    } else {
      console.error('Missing parrent element for the component');
    }
  }

  ngOnDestroy() {
    if (this.d3Svg && this.d3Svg.empty && !this.d3Svg.empty()) {
      this.d3Svg.selectAll('*').remove();
    }
  }


  updatePlot() {

    this.graphicContext = this.preparePane(this.data, this.lookAndFeel, this.graphicContext);

    let boxes = this.boxUtil.dataToBoxes(this.data);


    this.graphicContext = this.plotAxisBox(boxes, this.domain, this.lookAndFeel, this.mainPane, this.graphicContext);

    this.graphicContext = this.updatePallete(this.data, this.graphicContext);
    this.colorBoxes(boxes, this.graphicContext);

    this.graphicContext = this.plotDataBoxes(boxes, this.lookAndFeel, this.mainPane, this.graphicContext);

    this.graphicContext = this.prepareTooltip(this.mainPane, this.graphicContext);

    this.graphicContext = this.prepareLabels(boxes, this.mainPane, this.graphicContext);
  }

  prepareLabels(boxes: BoxDefinition[], mainPane: Selection<SVGGElement, any, null, undefined>, graphicContext: GraphicContext): GraphicContext {

    if (!graphicContext.labelsWrapper) {
      graphicContext.labelsWrapper = mainPane.append<SVGGElement>('g')
        .classed("labelsWrapper", true);
    }

    let labels = graphicContext.labelsWrapper.selectAll("g.yLabel")
      .data(boxes);

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
      .style("font-size", "10px")
      .style("opacity", 1)
      .attr('x', 5)
      .style("visibility", "hidden");


    let enterUpdate: Selection<SVGSVGElement, BoxDefinition, null, undefined> =
      <Selection<SVGSVGElement, BoxDefinition, null, undefined>> newLabels.merge(<any>labels);


    let bboxes: SVGRect[] = [];

    enterUpdate.select<SVGSVGElement>("text")
      .attr('y', d => this.graphicContext.yScale(d.key) + this.graphicContext.yScale.bandwidth() / 2)
      .text(d => d.label)
      .each(function (d) {
        bboxes.push(this.getBBox());
      });

    let trigers = enterUpdate.select<SVGSVGElement>(".yTrigger")
      .style("fill", d => d.color)
      .style("stroke", d => d.color);


    trigers.data(bboxes)
      .attr("x", -7)
      .attr("y", b => b.y - 2)
      .attr("width", b => 7)
      .attr("height", b => b.height + 4);

    let frames = enterUpdate.select<SVGSVGElement>("rect.yLabel")
      .style("fill", d => d.color)
      .style("fill-opacity", 0.35);

    frames.data(bboxes)
      .attr("x", 0)
      .attr("y", b => b.y - 2)
      .attr("width", b => b.width + 10)
      .attr("height", b => b.height + 4);

    return graphicContext;
  }

  updatePallete(data: any[], graphicContext: GraphicContext): GraphicContext {

    graphicContext.pallete = BD2ColorPalette.pallete(data.length);
    //graphicContext.dataPallete = (d, i) => graphicContext.pallete[i % graphicContext.pallete.length];

    return graphicContext;
  }

  colorBoxes(boxes: BoxDefinition[], graphicContext: GraphicContext) {
    boxes.forEach(b => b.color = graphicContext.pallete[b.ix]);
  }


  preparePane(data: any[], lookAndFeel: LookAndFeel, graphicContext: GraphicContext): GraphicContext {

    //console.log("PP",data);

    if (!this.d3Svg) {
      let d3ParentElement = this.d3.select(this.parentNativeElement);
      this.d3Svg = d3ParentElement.select('.hbox-plot').append<SVGSVGElement>('svg');
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

  prepareTooltip(mainPane: Selection<SVGGElement, any, null, undefined>, graphicContext: GraphicContext): GraphicContext {

    if (graphicContext.tooltipWrapper) {
      return graphicContext;
    }

    graphicContext.tooltipWrapper = mainPane.append<SVGGElement>('g')
      .classed("tooltipWrapper", true);

    graphicContext.tooltipBox = graphicContext.tooltipWrapper.append<SVGGElement>("rect")
      .style("fill", "white")
      .style("fill-opacity", 0.6)
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

    if (!graphicContext.xScale) {
      graphicContext.xScale = d3.scaleLinear()
        .clamp(true);
    }

    //domain[1] += Math.random() * 2;
    graphicContext.xScale
      .domain(domain)
      .range([0, graphicContext.workspaceWidth]);

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

    if (!graphicContext.yScale) {
      graphicContext.yScale = d3.scaleBand()
        .padding(0.2)
      ;
    }

    let domain = data.map((d) => d.key);

    graphicContext.yScale
      .domain(domain)
      .range([0, graphicContext.workspaceHeight]);

    if (!graphicContext.yLeftAxis) {
      graphicContext.yLeftAxis = d3.axisLeft(graphicContext.yScale)
        .tickFormat( () => "")
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

    boxWidgets.select("rect")
      .call(this.positionBoxRectangle, graphicContext);

    boxWidgets.select("line.medianline")
      .call(this.positionMedianLine, graphicContext);

    boxWidgets.select("line.meanline")
      .call(this.positionMeanLine, graphicContext);

    let out = boxWidgets.selectAll(".outlier")
      .data(d => d.outliers.map(x => [x, d.key, d.color]));

    out.enter()
      .call(this.createOutlier, lookAndFeel, graphicContext, this.positionOutlier);

    out.call(this.positionOutlier, graphicContext);

    out.exit().remove();

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
      .style("stroke", d => d.color)
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


  createBoxWidgets(newBoxWidgets: Selection<SVGGElement, BoxDefinition, null, undefined>,
                   lookAndFeel: LookAndFeel, graphicContext: GraphicContext) {

    let instance = this;
    let rect = newBoxWidgets.append("rect")
      .attr("class", "box")
      .style("stroke-width", lookAndFeel.boxStrokeWidth)
      .style("fill-opacity", lookAndFeel.boxFillOpacity)
      .call(this.positionBoxRectangle, graphicContext);


    let median = newBoxWidgets.append("line")
      .attr("class", "medianline")
      .style("stroke-width", lookAndFeel.boxStrokeWidth)
      .call(this.positionMedianLine, this.graphicContext);

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

    let mean = newBoxWidgets
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

    let outliers = newBoxWidgets.append<SVGGElement>("g").attr("class", "outliers");


    outliers.selectAll(".outlier")
      .data(d => d.outliers.map(x => [x, d.key, d.color]))
      .enter()
      .call(this.createOutlier, lookAndFeel, graphicContext, this.positionOutlier)
    ;

  }

}
