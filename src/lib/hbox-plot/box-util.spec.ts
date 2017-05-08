import {BoxUtil} from "./box-util";

describe('BoxUtil', () => {

  let util: BoxUtil;

  beforeEach(() => {
    util = new BoxUtil();
  });

  it('setups works', () => {
    expect(util).toBeTruthy();
  });

  describe('dataToBoxes', () => {

    it('handles empty data', () => {

      let data = null;
      let boxes = util.dataToBoxes(data);

      expect(boxes).toEqual([]);

      data = [];
      boxes = util.dataToBoxes(data);

      expect(boxes).toEqual([]);
    });

    it('converts data', () => {
      let data = [[5], [8.1, -0.1, 5, 3, 4]];
      let boxes = util.dataToBoxes(data);

      expect(boxes).toBeTruthy();
      expect(boxes.length).toBe(2);
      expect(boxes[0].median).toBe(5);
      expect(boxes[0].ix).toBe(0);

      expect(boxes[1].median).toBe(4);
      expect(boxes[1].ix).toBe(1);
    });
  });

  describe('datumtobox', () => {

    it('handles empty data', () => {
      let data = [];
      let box = util.datumToBox(data);

      expect(box).toBeTruthy();
      expect(box.median).toBeUndefined();

      data = null;
      box = util.datumToBox(data);

      expect(box).toBeTruthy();
      expect(box.median).toBeUndefined();

    });

    it('handles singulars', () => {

      let data = [5];
      let box = util.datumToBox(data);

      expect(box).toBeTruthy();
      expect(box.mean).toBe(5);
      expect(box.median).toBe(5);
      expect(box.thrdQnt).toBe(5);
      expect(box.fstQnt).toBe(5);
      expect(box.lowWskr).toBe(5);
      expect(box.highWskr).toBe(5);
      expect(box.outliers).toEqual([]);

    });

    it('handles unsorted data', () => {

      let data = [6, 5, 2, 3, 4];
      let box = util.datumToBox(data);

      expect(box).toBeTruthy();
      expect(box.mean).toBe((5 + 6 + 2 + 3 + 4) / 5);
      expect(box.median).toBe(4);
      expect(box.fstQnt).toBe(3);
      expect(box.thrdQnt).toBe(5);
      expect(box.outliers).toEqual([]);

    });


    it('calculates outliers', () => {
      let data = [8.1, -0.1, 5, 3, 4];
      let box = util.datumToBox(data);

      expect(box).toBeTruthy();
      expect(box.outliers).toEqual([-0.1, 8.1]);
    });

  });

})
