import {BoxDefinition} from "./box-dom";
import {d3} from "../d3service";

export class BoxUtil {

  dataToBoxes(data: number[][]): BoxDefinition[] {
    if (!data) {
      return [];
    }

    let LET = "ABCDEFGHIJKLMN ";

    return data.map((v, ix) => {
      let b = this.datumToBox(v);
      b.ix = ix;
      b.key = (ix + 1) + '.';
      let s = Math.random() * 12 + 1;

      b.label = b.key;
      for (let i = 0; i < s; i++) {
        b.label += LET[Math.round(Math.random() * (LET.length - 1))];
      }
      return b;
    });
  }

  datumToBox(data: number[]): BoxDefinition {

    let box = new BoxDefinition();
    if (!data) {
      return box;
    }

    data = data.sort(d3.ascending);
    box.mean = d3.mean(data);
    box.median = d3.median(data);
    box.fstQnt = d3.quantile(data, 0.25);
    box.thrdQnt = d3.quantile(data, 0.75);

    let iqr = 1.5 * (box.thrdQnt - box.fstQnt);
    box.lowWskr = box.fstQnt - iqr;
    box.highWskr = box.thrdQnt + iqr;

    box.outliers = data.filter(v => (v < box.lowWskr || v > box.highWskr));
    return box;
  }
}
