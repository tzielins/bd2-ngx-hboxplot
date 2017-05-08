import {BD2ColorPalette} from "./color-palette";
describe('BD2ColorPalette', () => {

  it('gives different pallet for small and large sizes', () => {
    let ps = BD2ColorPalette.indexPalette(9);
    let pm = BD2ColorPalette.indexPalette(12);

    expect(ps(8)).not.toEqual(pm(8));
  });

  it('gives pallet array',()=> {
    let p = BD2ColorPalette.pallete(3);
    expect(p.length).toBe(3);
    expect(p[2]).toBeDefined();
  })

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

  });
});
