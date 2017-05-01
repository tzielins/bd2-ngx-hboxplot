import {Component} from '@angular/core';

@Component({
  selector: 'bd2-ngx-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Vertical Box Plot';

  data: number[];

  private ci = 0;


  generateData() {

    let d = [];
    for (let i = 0; i < this.ci; i++) {
      d.push(i);
    }
    this.data = d;
  }

  detection() {
    console.log("Changed detection " + this.ci++);
    return "Change detection";
  }

}
