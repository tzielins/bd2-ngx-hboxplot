import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {HboxPlotModule} from "bd2-ngx-hboxplot";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HboxPlotModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
