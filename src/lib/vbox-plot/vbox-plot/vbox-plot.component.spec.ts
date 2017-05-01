import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VBoxPlotComponent } from './vbox-plot.component';

describe('VBoxPlotComponent', () => {
  let component: VBoxPlotComponent;
  let fixture: ComponentFixture<VBoxPlotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VBoxPlotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VBoxPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
