import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HBoxPlotComponent } from './hbox-plot/hbox-plot.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [HBoxPlotComponent],
  exports: [HBoxPlotComponent]
})
export class HBoxPlotModule { }
