import { BlankPage } from '../page-objects/app.po';
import { takeScreenshot } from '../helpers/screenshot';

describe('blank App', () => {
  let page: BlankPage;

  beforeEach(async () => {
    page = new BlankPage();
  });

  it('should display message saying app works', async () => {
    await page.navigateTo();
    expect(await page.getParagraphText()).toEqual('Tour of Heroes');

    await takeScreenshot('display_message');
  });
});
