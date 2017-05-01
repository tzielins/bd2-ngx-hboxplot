import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VBoxPlotComponent } from './vbox-plot/vbox-plot.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [VBoxPlotComponent],
  exports: [VBoxPlotComponent]
})
export class VBoxPlotModule { }
