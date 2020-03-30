import { Dashboard } from '../page-objects/dashboard.po';
import { BlankPage } from '../page-objects/app.po';

describe('dashboard', () => {
  let page: BlankPage;
  let dashboard: Dashboard;

  beforeEach(async () => {
    page = new BlankPage();
    dashboard = new Dashboard();
  });

  it('should display the correct hero names in the hero dashboard', async () => {
    await page.navigateTo();
    expect(await dashboard.getHeroName(1)).toEqual('Narco');
    expect(await dashboard.getHeroName(2)).toEqual('Bombasto');
    expect(await dashboard.getHeroName(3)).toEqual('Celeritas');
    expect(await dashboard.getHeroName(4)).toEqual('Magneta');
  });
});
