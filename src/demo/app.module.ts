import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {AppComponent} from './app.component';
import {VBoxPlotModule} from "../lib/vbox-plot/vbox-plot.module";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    VBoxPlotModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
