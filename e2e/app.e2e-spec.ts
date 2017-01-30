import { MuuboxPage } from './app.po';

describe('muubox App', function() {
  let page: MuuboxPage;

  beforeEach(() => {
    page = new MuuboxPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
