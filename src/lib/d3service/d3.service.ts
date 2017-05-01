import * as d3lib from './d3-modules';

/**
D3 integration is based on the code for npm library: d3-ng2-service
by Tom Wanzek, https://github.com/tomwanzek/d3-ng2-service.

That package was used during developement and then converted into inline service
to reduce the dependencies and boundle size.

*/
export type D3 = typeof d3lib;
export const d3 = d3lib;


/*
@Injectable()
export class D3Service {

  constructor() { }

  public getD3(): D3 {
    return d3;
  }

}*/
