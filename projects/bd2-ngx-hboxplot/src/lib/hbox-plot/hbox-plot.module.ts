import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HBoxPlotComponent } from './hbox-plot/hbox-plot.component';

@NgModule({
  declarations: [HBoxPlotComponent],
  imports: [
    CommonModule
  ],
  exports: [HBoxPlotComponent]
})
export class HboxPlotModule { }
