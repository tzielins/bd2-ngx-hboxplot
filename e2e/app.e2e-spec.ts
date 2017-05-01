import { Bd2NgxHboxplotPage } from './app.po';

describe('bd2-ngx-hboxplot App', () => {
  let page: Bd2NgxHboxplotPage;

  beforeEach(() => {
    page = new Bd2NgxHboxplotPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('bd2-ngx works!');
  });
});
