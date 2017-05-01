import { browser, element, by } from 'protractor';

export class Bd2NgxHboxplotPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('bd2-ngx-root h1')).getText();
  }
}
