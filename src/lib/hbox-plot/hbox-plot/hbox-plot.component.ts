import {
  Component, OnInit, Input, AfterViewInit, OnChanges, OnDestroy, NgZone, ChangeDetectorRef,
  ElementRef, SimpleChanges, ChangeDetectionStrategy
} from '@angular/core';
import {D3, d3, Selection, ScaleLinear} from "../../d3service";
import {Axis} from "d3-axis";
import {ScaleBand} from "d3-scale";
import {BoxUtil} from "../box-util";
import {BD2ColorPalette} from "../color-palette";


export interface LookAndFeel {
  vMargin: number;
  hMargin: number;
  rowWidth: number;

  boxStrokeWidth: string;
  boxFillOpacity: number;

  outliersStrokeWidth: string;
  outliersCircleRadius: number;
  outliersFillOpacity: number;
}

export let defualtLookAndFeel: () => LookAndFeel = function () {
  let look: LookAndFeel = {
    vMargin: 25,
    hMargin: 20,
    rowWidth: 30,

    boxStrokeWidth: '2px',
    boxFillOpacity: 0.35,

    outliersStrokeWidth: '1px',
    outliersCircleRadius: 2,
    outliersFillOpacity: 0.25,

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
  dataPallete: (d, i) => string;

  dataWrapper: Selection<SVGGElement, any, null, undefined>;
}


@Component({
  selector: 'bd2-ngx-hbox-plot',
  //changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="hbox-plot" style="border: 1px solid red;"></div>
  `,
  styles: [
      ``
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
    //this.changeDetectorRef.detach();
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

    this.graphicContext = this.plotAxisBox(this.data, this.domain, this.lookAndFeel, this.mainPane, this.graphicContext);

    this.graphicContext = this.updatePallete(this.data, this.graphicContext);

    this.graphicContext = this.plotDataBoxes(this.data, this.lookAndFeel, this.mainPane, this.graphicContext);
  }

  updatePallete(data: any[], graphicContext: GraphicContext): GraphicContext {

    graphicContext.pallete = BD2ColorPalette.pallete(data.length);
    graphicContext.dataPallete = (d, i) => graphicContext.pallete[i % graphicContext.pallete.length];

    return graphicContext;
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
    this.mainPane.attr('transform', 'translate(' + lookAndFeel.hMargin + ',' + lookAndFeel.vMargin + ')');
    //.attr('transform', 'translate(' + (pWidth / 2) + ',' + (pHeight / 2) + ')'); //moves 0,0 of the pain to the middle of the graphics

    graphicContext.workspaceWidth = pWidth - 2 * lookAndFeel.hMargin;
    graphicContext.workspaceHeight = pHeight - 2 * lookAndFeel.vMargin;

    return graphicContext;

  }

  calculateWorkspaceHeight(data: any[], lookAndFeel: LookAndFeel) {
    return lookAndFeel.rowWidth * data.length;

  }

  plotAxisBox(data: any[], domain: number[], lookAndFeel: LookAndFeel, mainPane: Selection<SVGGElement, any, null, undefined>,
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

  plotVerticalScales(data: any[], lookAndFeel: LookAndFeel, graphicContext: GraphicContext): GraphicContext {

    if (!graphicContext.yScale) {
      graphicContext.yScale = d3.scaleBand()
        .padding(0.2)
      ;
    }

    let domain = data.map((d, i) => '' + (i + 1));

    graphicContext.yScale
      .domain(domain)
      .range([0, graphicContext.workspaceHeight]);

    if (!graphicContext.yLeftAxis) {
      graphicContext.yLeftAxis = d3.axisLeft(graphicContext.yScale)
      //.tickFormat( () => "")
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

  plotDataBoxes(data: number[][], lookAndFeel: LookAndFeel, mainPane: Selection<SVGGElement, any, null, undefined>,
                graphicContext: GraphicContext): GraphicContext {

    if (!graphicContext.dataWrapper) {
      graphicContext.dataWrapper = mainPane.append<SVGGElement>("g").attr("class", "dataWrapper");
    }
    ;

    let boxes = this.boxUtil.dataToBoxes(data);

    let boxWidgets = graphicContext.dataWrapper.selectAll(".boxWidget")
      .data(boxes);

    let newBoxWidgets = boxWidgets.enter()
      .append<SVGGElement>("g").attr("class", "boxWidget");

    this.createBoxWidgets(newBoxWidgets, graphicContext);

    boxWidgets.exit().remove();


    return graphicContext;
  }

  createBoxWidgets(newBoxWidgets: Selection<SVGGElement, any, null, undefined>, graphicContext: GraphicContext) {

    newBoxWidgets.append("rect")
      .attr("class", "box")
      .attr("x", (d, i) => graphicContext.xScale(d.fstQnt))
      .attr("y", (d, i) => {
        return graphicContext.yScale('' + (i + 1));
      })
      .attr("width", (d, i) => (graphicContext.xScale(d.thrdQnt) - graphicContext.xScale(d.fstQnt)))
      .attr("height", (d, i) => {
        return graphicContext.yScale.bandwidth();
      })
      .style("stroke-width", this.lookAndFeel.boxStrokeWidth)
      .style("stroke", this.graphicContext.dataPallete)
      .style("fill", this.graphicContext.dataPallete)
      .style("fill-opacity", this.lookAndFeel.boxFillOpacity)
    ;

    newBoxWidgets.append("line")
      .attr("class", "medianline")
      .attr("x1", (d, i) => graphicContext.xScale(d.median))
      .attr("y1", (d, i) => graphicContext.yScale('' + (i + 1)))
      .attr("x2", (d, i) => graphicContext.xScale(d.median))
      .attr("y2", (d, i) => graphicContext.yScale('' + (i + 1)) + graphicContext.yScale.bandwidth())
      .style("stroke-width", this.lookAndFeel.boxStrokeWidth)
      .style("stroke", this.graphicContext.dataPallete);
    //.style("stroke-dasharray", "5 5")

    newBoxWidgets
      .append("line")
      .attr("class", "meanline")
      .attr("x1", (d, i) => graphicContext.xScale(d.mean))
      .attr("y1", (d, i) => graphicContext.yScale('' + (i + 1)))
      .attr("x2", (d, i) => graphicContext.xScale(d.mean))
      .attr("y2", (d, i) => graphicContext.yScale('' + (i + 1)) + graphicContext.yScale.bandwidth())
      .style("stroke-width", this.lookAndFeel.boxStrokeWidth)
      .style("stroke", this.graphicContext.dataPallete)
      .style("stroke-dasharray", "3 3")
      .filter(d => d.mean === d.median)
      .style("visibility", "hidden");

    ;

    let outliers = newBoxWidgets.append<SVGGElement>("g").attr("class", "outliers");


    let colorsFun = (d: number[]) => this.graphicContext.pallete[d[1]];

    outliers.selectAll(".outlier")
      .data(d => d.outliers.map(x => [x, d.ix]))
      .enter()
      .append("circle")
      .attr("class", "outlier")
      .attr("cx", d => graphicContext.xScale(d[0]))
      .attr("cy", d => graphicContext.yScale('' + (d[1] + 1)) + graphicContext.yScale.bandwidth() / 2)
      .attr("r", this.lookAndFeel.outliersCircleRadius)
      .style("stroke-width", this.lookAndFeel.outliersStrokeWidth)
      .style("stroke", colorsFun)
      .style("fill", colorsFun)
      .style("fill-opacity", this.lookAndFeel.outliersFillOpacity);

  }

}
