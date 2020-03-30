import { element, by, ElementFinder } from 'protractor';

export class HeroDetail {
  constructor(private el: ElementFinder = element(by.css('my-hero-detail'))) {}

  isDisplayed() {
    return this.el.isDisplayed();
  }

  getDetailHeader() {
    return this.el.element(by.css('div h2')).getText();
  }

  getHeroId() {
    return this.getIdLabel()
      .element(by.xpath('..'))
      .getText()
      .then(async (value: string) => {
        const val: string = value.replace(await this.getIdLabel().getText(), '');
        return val.trim();
      });
  }

  getHeroName() {
    return this.getHeroNameInput().getAttribute('value');
  }

  clearHeroName() {
    return this.getHeroNameInput().clear();
  }
  enterHeroName(heroName) {
    return this.getHeroNameInput().sendKeys(heroName);
  }

  save() {
    return this.getSaveButton().click();
  }

  private getHeroNameInput() {
    return this.el.element(by.css('div div input[placeholder="name"]'));
  }

  private getIdLabel() {
    return this.el.element(by.cssContainingText('div div label', 'id:'));
  }

  private getSaveButton() {
    return this.el.element(by.buttonText('Save'));
  }
}
