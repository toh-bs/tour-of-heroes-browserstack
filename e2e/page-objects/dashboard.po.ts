import { element, by, ElementFinder } from 'protractor';

export class Dashboard {
  constructor(private el: ElementFinder = element(by.css('my-dashboard'))) {}

  isDisplayed() {
    return this.el.isDisplayed();
  }
  clickHero(heroName) {
    return this.getHeroNameInputByName(heroName).click();
  }

  getHeroName(position) {
    return this.getHeroNameInputByPosition(position).getText();
  }

  private getHeroNameInputByName(heroName) {
    return this.el.element(by.cssContainingText('div.hero h4', `${heroName}`));
  }

  private getHeroNameInputByPosition(position) {
    return this.el.element(by.css(`div div:nth-of-type(${position}) div.hero h4`));
  }
}
