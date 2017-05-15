import {Component} from '@angular/core';

@Component({
  selector: 'bd2-ngx-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Vertical Box Plot';

  data: number[][] = [];

  testData: number[][];

  labels: string[];

  private ci = 0;

  constructor() {
    this.testData = [
      [20, 21, 23, 24, 25],
      [18, 18.5, 25.5, 25, 26, 22.8, 25.8, 26, 25.1, 26.8],
      [30],
      [20, 20.5, 20.6],
      [28, 29.7, 28.5],
      [21.5, 29.7, 30.4, 24, 24.1, 25.9, 30, 24.7, 23.7, 24.3, 23.4, 24.5, 22.5, 23.7, 23.9, 23.5]
    ];

    let nr = Math.random() * 15 + 1;
    let row = [];
    for (let i = 0; i < nr; i++) {
      row.push(Math.random() * 10 + 20);
    }
    this.testData.push(row);

    //this.generateData();
    this.generateData();
  }

  generateData() {
    this.ci++;
    //
    let nr = 1 + Math.random() * 15;
    //console.log("TD: " + this.testData.length);

    let d = [];
    for (let i = 0; i < nr; i++) {
      //let ix = i % this.testData.length;
      let ix = Math.round(Math.random() * (this.testData.length - 1));
      //console.log("I " + ix);
      let row = this.testData[ix];
      let base = -3 + Math.random() * 8;

      row = row.map(v => v + base);
      /*if (ix === 1) {
       if (Math.random() < 0.5) {
       row[0] = row[row.length - 1];
       }
       }*/
      d.push(row);

    }

    let LET = "ABCDEFGHIJKLMN ";
    let labels = d.map((v, ix) => {

      let s = Math.random() * 12 + 1;
      let label = (ix + 1) + '. ';
      for (let i = 0; i < s; i++) {
        label += LET[Math.round(Math.random() * (LET.length - 1))];
      }

      return label;
    });

    this.data = d;
    this.labels = labels;
  }


  detection() {
    console.log("Changed detection " + this.ci);
    return "Change detection";
  }

}
