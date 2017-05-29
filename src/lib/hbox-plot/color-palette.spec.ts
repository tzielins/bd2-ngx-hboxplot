import {BD2ColorPalette} from "./color-palette";
describe('BD2ColorPalette', () => {

  it('gives different pallet for small and large sizes', () => {
    let ps = BD2ColorPalette.indexPalette(9);
    let pm = BD2ColorPalette.indexPalette(12);

    expect(ps(8)).not.toEqual(pm(8));
  });

  it('gives pallet array', () => {
    let p = BD2ColorPalette.palette(3);
    expect(p.length).toBe(3);
    expect(p[2]).toBeDefined();

    p = BD2ColorPalette.palette(30);
    expect(p.length).toBe(30);
    expect(p[29]).toBeDefined();
  });

  it('extends empty palette to black', () => {
    let p: string[] = [];
    expect(BD2ColorPalette.extendPalette(p, 2)).toEqual(['black', 'black']);

    p = null;
    expect(BD2ColorPalette.extendPalette(p, 2)).toEqual(['black', 'black']);
  });

  it('extends given palette', () => {
    let p: string[] = ['red', 'blue'];

    let ans = BD2ColorPalette.extendPalette(p, 2);
    expect(ans).toEqual(['red', 'blue']);

    ans = BD2ColorPalette.extendPalette(p, 3);
    expect(ans).toEqual(['red', 'blue', 'red']);

    ans = BD2ColorPalette.extendPalette(p, 4);
    expect(ans).toEqual(['red', 'blue', 'red', 'blue']);
  });

  it('palettes can handle big sizes', () => {

    let p = BD2ColorPalette.indexPalette(100);
    expect(p(97)).toBeTruthy();
  });

  it('data and index paletes gives same anserws', () => {

    let dp = BD2ColorPalette.dataPalette(100);
    let ip = BD2ColorPalette.indexPalette(100);

    expect(dp(0, 44)).toBeTruthy();
    expect(ip(44)).toBeTruthy();

    expect(dp(0, 44)).toBe(ip(44));

  });

  it('data palete responsd only to second == index argument', () => {

    let dp = BD2ColorPalette.dataPalette(67);
    expect(dp(0, 23)).toBeTruthy();
    expect(dp(0, 23)).toBe(dp(7, 23));

    dp = BD2ColorPalette.dataPalette(6);
    expect(dp(0, 5)).toBeTruthy();
    expect(dp(0, 5)).toBe(dp(7, 5));

  });
});
