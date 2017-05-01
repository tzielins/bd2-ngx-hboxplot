import {
  Component, OnInit, Input, AfterViewInit, OnChanges, OnDestroy, NgZone, ChangeDetectorRef,
  ElementRef, SimpleChanges, ChangeDetectionStrategy
} from '@angular/core';
import {D3, d3, Selection, ScaleLinear} from "../../d3service";


export interface LookAndFeel {
  mainMargin: number;
  rowWidth: number;

  workspaceWidth?: number;
  workspaceHeight?: number;

  xScale?: ScaleLinear<number, number>;
}

export let defualtLookAndFeel: () => LookAndFeel = function () {
  let look: LookAndFeel = {
    mainMargin: 10,
    rowWidth: 30,
  };
  return look;
};

@Component({
  selector: 'bd2-ngx-hbox-plot',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="hbox-plot" style="border: 1px solid red;"></div>
  `,
  styles: [
      ``
  ]
})
export class HBoxPlotComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {

  @Input()
  data: number[];

  @Input()
  domain: number[] = [17, 36];

  private d3: D3;
  private parentNativeElement: any;
  private d3Svg: Selection<SVGSVGElement, any, null, undefined>;
  private mainPane: Selection<SVGGElement, any, null, undefined>;

  private lookAndFeel = defualtLookAndFeel();

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

    this.preparePane(this.data, this.lookAndFeel);

    this.plotAxisBox(this.data, this.domain, this.lookAndFeel, this.mainPane);
  }

  preparePane(data: number[], lookAndFeel: LookAndFeel) {

    //console.log("PP",data);

    if (!this.d3Svg) {
      let d3ParentElement = this.d3.select(this.parentNativeElement);
      this.d3Svg = d3ParentElement.select('.hbox-plot').append<SVGSVGElement>('svg');
      this.d3Svg.attr('width', '100%');

      this.mainPane = this.d3Svg.append<SVGGElement>('g');
      this.mainPane.classed("mainPane", true);

    }

    let pWidth = 500;
    let pHeight = this.calculateWorkspaceHeight(data, lookAndFeel) + 2 * lookAndFeel.mainMargin;

    this.d3Svg.attr('viewBox', '0 0 ' + pWidth + ' ' + pHeight);
    this.mainPane.attr('transform', 'translate(' + lookAndFeel.mainMargin + ',' + lookAndFeel.mainMargin + ')');
    //.attr('transform', 'translate(' + (pWidth / 2) + ',' + (pHeight / 2) + ')'); //moves 0,0 of the pain to the middle of the graphics

    lookAndFeel.workspaceWidth = pWidth - 2 * lookAndFeel.mainMargin;
    lookAndFeel.workspaceHeight = pHeight - 2 * lookAndFeel.mainMargin;

  }

  calculateWorkspaceHeight(data: any[], lookAndFeel: LookAndFeel) {
    return lookAndFeel.rowWidth * data.length;

  }

  plotAxisBox(data: number[], domain: number[], lookAndFeel: LookAndFeel, mainPane: Selection<SVGGElement, any, null, undefined>) {

    let axisWrapper = this.initAxisWrapper(mainPane);

    this.plotHorizontalScales(domain, lookAndFeel, axisWrapper);

  }

  initAxisWrapper(mainPane: Selection<SVGGElement, any, null, undefined>): Selection<SVGGElement, any, null, undefined> {

    let wrapper = mainPane.select<SVGGElement>(".axisWrapper");
    if (wrapper.size() === 0) {
      wrapper = mainPane.append<SVGGElement>("g").attr("class", "axisWrapper");

      wrapper.append("g").attr("class", "xTopAxis");
      wrapper.append("g").attr("class", "xBottomAxis");
    }
    return wrapper;
  }

  private xTopAxis: any;

  plotHorizontalScales(domain: number[], lookAndFeel: LookAndFeel, axisWrapper: Selection<SVGGElement, any, null, undefined>) {

    if (!lookAndFeel.xScale) {
      lookAndFeel.xScale = d3.scaleLinear()
        .clamp(true);
    }

    domain[1] += Math.random() * 2;
    lookAndFeel.xScale
      .domain(domain)
      .range([0, lookAndFeel.workspaceWidth]);

    if (!this.xTopAxis) {
      this.xTopAxis = d3.axisBottom(lookAndFeel.xScale);


    }
    
    axisWrapper.select("g.xTopAxis")
    //.append("g")
    //.attr("transform", "translate(0,30)")
      .call(this.xTopAxis);


  }

}
