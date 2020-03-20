import { BlankPage } from '../page-objects/app.po';
import { HeroDetail } from '../page-objects/hero-detail.po';
import { Dashboard } from '../page-objects/dashboard.po';

describe('hero detail', () => {
  const app = new BlankPage();
  const dashboard = new Dashboard();
  const heroDetail = new HeroDetail();

  beforeAll(async () => {
    await app.navigateTo();
  });

  beforeEach(async () => {
    await app.navigateTo();
  });

  it('should display the hero id and the hero name', async () => {
    await app.navigateTo();
    await dashboard.clickHero('Narco');

    expect(await heroDetail.getDetailHeader()).toEqual('Narco details!');
    expect(await heroDetail.isDisplayed()).toBe(true);
    expect(await heroDetail.getHeroId()).toBe('12');
    expect(await heroDetail.getHeroName()).toBe('Narco');
  });
});
