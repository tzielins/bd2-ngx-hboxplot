import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {HBoxPlotComponent, defualtLookAndFeel, LookAndFeel, GraphicContext} from './hbox-plot.component';
import {D3, d3, Selection} from "../../d3service";
import {BD2ColorPalette} from "../color-palette";
import {BoxDefinition} from "../box-dom";
import {BoxUtil} from "../box-util";

describe('HBoxPlotComponent', () => {
  let component: HBoxPlotComponent;
  let fixture: ComponentFixture<HBoxPlotComponent>;
  let lookAndFeel: LookAndFeel;
  let graphicContext: GraphicContext;
  let boxUtil = new BoxUtil();

  let getMains = (f: ComponentFixture<HBoxPlotComponent>) => {

    let svgN = fixture.nativeElement.querySelector('.hbox-plot svg');
    expect(svgN).toBeTruthy();

    if (svgN) {
      let svg = d3.select(svgN);
      let mainPane = svg.select("g.mainPane");
      return [svg, mainPane];
    }

    return null;
  };

  beforeEach(async(() => {
    lookAndFeel = defualtLookAndFeel();
    graphicContext = new GraphicContext();
    TestBed.configureTestingModule({
      declarations: [HBoxPlotComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HBoxPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  describe("coloring", () => {

    it('colorBoxes adds colors from the pallete', () => {

      graphicContext.pallete = BD2ColorPalette.pallete(5);
      let boxes: BoxDefinition[] = [];
      boxes.push(new BoxDefinition());
      boxes.push(new BoxDefinition());
      boxes[0].ix = 0;
      boxes[1].ix = 3;

      component.colorBoxes(boxes, graphicContext.pallete);
      expect(boxes[0].color).toBe(graphicContext.pallete[0]);
      expect(boxes[1].color).toBe(graphicContext.pallete[3]);

    });

    it('updatePallete uses provided colro pallete', () => {
      let pallete = ['red', 'green', 'blue'];
      let data = [[1], [2], [3], [4]];

      let ans = component.updatePallete(data, pallete, graphicContext);
      expect(ans.pallete).toEqual(['red', 'green', 'blue', 'red']);
    });

    it('updatePallete can create default pallete', () => {
      let pallete = [];
      let data = [[1], [2]];

      let ans = component.updatePallete(data, pallete, graphicContext);
      expect(ans.pallete.length).toEqual(2);
      expect(ans.pallete[1]).toBeTruthy();
      expect(ans.pallete[1]).not.toEqual(ans.pallete[0]);

      pallete = null;
      ans = component.updatePallete(data, pallete, graphicContext);
      expect(ans.pallete.length).toEqual(2);
      expect(ans.pallete[1]).toBeTruthy();
      expect(ans.pallete[1]).not.toEqual(ans.pallete[0]);
    });

    it('updatePallete emits colors used', fakeAsync(() => {

      let pallete = [];
      let data = [[1], [2]];

      let colors;
      component.colors.subscribe(a => colors = a, (e) => fail(e));

      let ans = component.updatePallete(data, pallete, graphicContext);
      tick();

      expect(colors).toBeTruthy();
      expect(colors).toEqual(ans.pallete);
    }));

  });

  describe("Initialization", () => {

    it("calculates workspace height as multiple of data size", () => {

      let data: number[] = [];
      expect(component.calculateWorkspaceHeight(data, lookAndFeel)).toBe(0);

      data.push(1);
      data.push(2);
      expect(component.calculateWorkspaceHeight(data, lookAndFeel)).toBe(2 * lookAndFeel.rowWidth);

    });

    it("appends svg and mainPane element", () => {

      let data = [1];

      let svg = fixture.nativeElement.querySelector('.hbox-plot svg');
      expect(svg).toBeFalsy();

      component.preparePane(data, lookAndFeel, graphicContext);

      let mains = getMains(fixture);
      expect(mains[0]).toBeTruthy();

      let mainPane = mains[1];
      expect(mainPane.size()).toBe(1);
    });

    it("changes height depending on data", () => {

      let data = [1];
      component.preparePane(data, lookAndFeel, graphicContext);

      let svg = getMains(fixture)[0];
      let viewbox = svg.attr('viewBox');
      expect(viewbox).toBeTruthy();
      data = [1, 2];
      component.preparePane(data, lookAndFeel, graphicContext);

      let viewbox2 = svg.attr('viewBox');
      expect(viewbox2).toBeTruthy();
      expect(viewbox2).not.toEqual(viewbox);

    });

    it("updates lookAndFeel with workspace dimensions", () => {

      expect(graphicContext.workspaceHeight).toBeUndefined();
      expect(graphicContext.workspaceWidth).toBeUndefined();

      let data = [1];

      graphicContext = component.preparePane(data, lookAndFeel, graphicContext);

      expect(graphicContext.workspaceHeight).toBeGreaterThan(10);
      expect(graphicContext.workspaceWidth).toBe(500 - lookAndFeel.hMarginL - lookAndFeel.hMarginR);

    });

    it("initAxisWrapper creates only one wrapper", () => {

      let data = [1];

      graphicContext = component.preparePane(data, lookAndFeel, graphicContext);
      let mainPane = getMains(fixture)[1];

      let wrapper = component.initAxisWrapper(mainPane);
      let node1 = wrapper.node();

      wrapper = component.initAxisWrapper(mainPane);
      let node2 = wrapper.node();

      expect(node1).toBe(node2);
    });

    it("initAxisWrapper creates xAxis groups", () => {

      let data = [1];

      graphicContext = component.preparePane(data, lookAndFeel, graphicContext);
      let mainPane = getMains(fixture)[1];

      let wrapper = component.initAxisWrapper(mainPane);
      expect(wrapper.selectAll("g.xTopAxis").size()).toBe(1);
      expect(wrapper.selectAll("g.xBottomAxis").size()).toBe(1);
      expect(wrapper.selectAll("g.yLeftAxis").size()).toBe(1);
      expect(wrapper.selectAll("g.yRightAxis").size()).toBe(1);
    });


  });

  describe('axis', () => {

    let mainPane: Selection<SVGGElement, any, null, undefined>;
    let data: BoxDefinition[];

    beforeEach(() => {

      let d = [[1]];

      data = boxUtil.dataToBoxes(d);
      graphicContext = component.preparePane(data, lookAndFeel, graphicContext);
      mainPane = getMains(fixture)[1];
      graphicContext.axisWrapper = component.initAxisWrapper(mainPane);

    });

    it("plotHorizontalScales places x axis in correct positions", () => {

      graphicContext = component.plotHorizontalScales([12, 24], lookAndFeel, graphicContext);

      expect(graphicContext.xScale).toBeTruthy();
      expect(graphicContext.xScale.domain()).toEqual([12, 24]);

      expect(graphicContext.xTopAxis).toBeTruthy();
      let tx = graphicContext.axisWrapper.select("g.xTopAxis");
      expect(tx.attr("transform")).toBeNull();
      expect(tx.selectAll("path").size()).toBe(1);
      expect(tx.selectAll(".tick text").size()).toBeGreaterThan(2);
      //let currentx = d3.transform(g.attr("transform")).translate[0];

      expect(graphicContext.workspaceHeight).toBeGreaterThan(0);
      expect(graphicContext.xBottomAxis).toBeTruthy();
      let bx = graphicContext.axisWrapper.select("g.xBottomAxis");
      expect(bx.selectAll("path").size()).toBe(1);
      expect(bx.selectAll(".tick text").size()).toBeGreaterThan(2);
      expect(bx.attr("transform")).toEqual('translate(0,' + graphicContext.workspaceHeight + ')');

    });

    it("plotVerticalScales places y axis in correct positions", () => {

      graphicContext = component.plotVerticalScales(data, lookAndFeel, graphicContext);

      expect(graphicContext.yScale).toBeTruthy();
      expect(graphicContext.yScale.domain()).toEqual(["1."]);

      expect(graphicContext.yLeftAxis).toBeTruthy();
      let ly = graphicContext.axisWrapper.select("g.yLeftAxis");
      expect(ly.attr("transform")).toBeNull();
      expect(ly.selectAll("path").size()).toBe(1);
      expect(ly.selectAll(".tick text").size()).toBe(1);

      expect(graphicContext.workspaceWidth).toBeGreaterThan(0);
      expect(graphicContext.yLeftAxis).toBeTruthy();
      let ry = graphicContext.axisWrapper.select("g.yRightAxis");
      expect(ry.selectAll("path").size()).toBe(1);
      expect(ry.selectAll(".tick text").size()).toBe(0);
      expect(ry.attr("transform")).toEqual("translate(" + graphicContext.workspaceWidth + ",0)");


    });


  });
});
