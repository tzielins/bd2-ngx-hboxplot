import {d3} from "../d3service";


export class BD2ColorPalette {

  private static smallDataPalette = (d, i) => d3.schemeCategory10[i];
  private static smallIndexPalette = (i) => d3.schemeCategory10[i];
  private static mediumDataPalette = (d, i) => d3.schemeCategory20[i % d3.schemeCategory20.length];
  private static mediumIndexPalette = (i) => d3.schemeCategory20[i % d3.schemeCategory20.length];

  static extendPallete(pallete: string[], size: number): string[] {

    if (!pallete || pallete.length === 0) {
      pallete = ['black'];
    }

    let out = [];
    for (let i = 0; i < size; i++) {
      out.push(pallete[i % pallete.length]);
    }
    return out;

  }

  static pallete(size: number): string[] {

    if (size <= d3.schemeCategory10.length) {
      return BD2ColorPalette.extendPallete(d3.schemeCategory10, size);
    } else {
      return BD2ColorPalette.extendPallete(d3.schemeCategory20, size);
    }

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
