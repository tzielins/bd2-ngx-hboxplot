import {Component} from '@angular/core';

@Component({
  selector: 'bd2-ngx-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Vertical Box Plot';

  data: number[][] = [];

  testData: number[][] = [
    [20, 21, 23, 24, 25],
    [18, 18.5, 25.5, 25, 26, 25, 25.8, 26, 25.1, 26.3],
    [30]
  ];

  private ci = 0;


  generateData() {
    this.ci++;
    //

    let d = [];
    for (let i = 0; i < this.ci; i++) {
      let base = -3 + Math.random() * 8;
      d.push(this.testData[i % this.testData.length].map(v => v + base));
    }
    this.data = d;
  }

  detection() {
    console.log("Changed detection " + this.ci);
    return "Change detection";
  }

}
