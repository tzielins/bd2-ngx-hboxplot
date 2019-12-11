import * as d3lib from 'd3';

export type D3 = typeof d3lib;
export const d3 = d3lib;

/**
 D3 integration was originally based on the code for npm library: d3-ng2-service
 by Tom Wanzek, https://github.com/tomwanzek/d3-ng2-service.

 That package was used during developement and then converted into inline service
 to reduce the dependencies and boundle size.

 At some point, I moved to to simpler dependency on d3:
 npm install --save d3
 npm install --save-dev @types/d3

 and removed the parts from d3-modules.ts as they were causing errors
 (not sure how to fix them and also one dependency is easier to maintain).
 */
