import {d3} from "../d3service";

export class BD2ColorPalette {

  private static smallDataPalette = (d, i) => d3.schemeCategory10[i];
  private static smallIndexPalette = (i) => d3.schemeCategory10[i];
  private static mediumDataPalette = (d, i) => d3.schemeCategory20[i % d3.schemeCategory20.length];
  private static mediumIndexPalette = (i) => d3.schemeCategory20[i % d3.schemeCategory20.length];

  static pallete(size: number): string[] {
    let p = [];
    let f = BD2ColorPalette.indexPalette(size);
    for (let i=0;i<size;i++) {
      p.push(f(i));
    }
    return p;
  }

  static dataPalette(size: number): (any, number) => string {

    if (size <= d3.schemeCategory10.length) {
      return BD2ColorPalette.smallDataPalette;
    } else {
      return BD2ColorPalette.mediumDataPalette;
    }

  };

  static indexPalette(size: number): (number) => string {

    if (size <= d3.schemeCategory10.length) {
      return BD2ColorPalette.smallIndexPalette;
    } else {
      return BD2ColorPalette.mediumIndexPalette;
    }

  };
}
