import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {BD2NgxHBoxplotModule} from 'bd2-ngx-hboxplot';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BD2NgxHBoxplotModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
