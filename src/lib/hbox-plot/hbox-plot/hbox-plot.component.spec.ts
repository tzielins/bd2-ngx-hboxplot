import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {HBoxPlotComponent, defualtLookAndFeel, LookAndFeel} from './hbox-plot.component';
import {D3, d3, Selection} from "../../d3service";

fdescribe('HBoxPlotComponent', () => {
  let component: HBoxPlotComponent;
  let fixture: ComponentFixture<HBoxPlotComponent>;
  let lookAndFeel: LookAndFeel;

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

      component.preparePane(data, lookAndFeel);

      let mains = getMains(fixture);
      expect(mains[0]).toBeTruthy();

      let mainPane = mains[1];
      expect(mainPane.size()).toBe(1);
    });

    it("changes height depending on data", () => {

      let data = [1];
      component.preparePane(data, lookAndFeel);

      let svg = getMains(fixture)[0];
      let viewbox = svg.attr('viewBox');
      expect(viewbox).toBeTruthy();
      data = [1, 2];
      component.preparePane(data, lookAndFeel);

      let viewbox2 = svg.attr('viewBox');
      expect(viewbox2).toBeTruthy();
      expect(viewbox2).not.toEqual(viewbox);

    });

    it("updates lookAndFeel with workspace dimensions", () => {

      expect(lookAndFeel.workspaceHeight).toBeUndefined();
      expect(lookAndFeel.workspaceWidth).toBeUndefined();

      let data = [1];

      component.preparePane(data, lookAndFeel);

      expect(lookAndFeel.workspaceHeight).toBeGreaterThan(10);
      expect(lookAndFeel.workspaceWidth).toBe(500 - 2 * lookAndFeel.mainMargin);

    });

    it("initAxisWrapper creates only one wrapper", () => {

      let data = [1];

      component.preparePane(data, lookAndFeel);
      let mainPane = getMains(fixture)[1];

      let wrapper = component.initAxisWrapper(mainPane);
      let node1 = wrapper.node();

      wrapper = component.initAxisWrapper(mainPane);
      let node2 = wrapper.node();

      expect(node1).toBe(node2);
    });

  });
});
