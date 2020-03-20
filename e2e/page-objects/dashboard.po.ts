import { element, by, ElementFinder } from 'protractor';

export class Dashboard {
  constructor(private el: ElementFinder = element(by.css('my-dashboard'))) {}

  clickHero(heroName) {
    return this.getHeroNameInput(heroName).click();
  }

  private getHeroNameInput(heroName) {
    return this.el.element(by.cssContainingText('div.hero h4', `${heroName}`));
  }
}
