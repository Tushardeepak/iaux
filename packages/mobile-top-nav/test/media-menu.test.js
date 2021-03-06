import { html, fixture, expect } from '@open-wc/testing';

import '../src/media-menu';

const component = html`<media-menu></media-menu>`;

const verifyClosed = (instance) => {
  expect(instance.mediaSliderAnimate).to.be.true;
  expect(instance.mediaSliderOpen).to.be.false;
  expect(instance.selectedMenuOption).to.equal('');
};

const verifyOpened = (instance, mediatype) => {
  expect(instance.mediaSliderOpen).to.be.true;
  expect(instance.mediaSliderAnimate).to.be.true;
  expect(instance.selectedMenuOption).to.equal(mediatype);
};

describe('<media-menu>', () => {
  it('sets default properties', async () => {
    const mediaMenu = await fixture(component);

    expect(mediaMenu.mediaSliderOpen).to.be.false;
    expect(mediaMenu.mediaSliderAnimate).to.be.false;
    expect(mediaMenu.selectedMenuOption).to.equal('');
  });

  it('sets media slider to closed', async () => {
    const mediaMenu = await fixture(component);

    mediaMenu.mediaSliderOpen = true;
    mediaMenu.selectedMenuOption = 'foo';
    mediaMenu.closeMediaSlider();

    verifyClosed(mediaMenu);
  });

  it('toggles media slider visibility and starts animation', async () => {
    const mediaMenu = await fixture(component);
    const mediatype = 'foo';

    mediaMenu.selectedMenuOption = mediatype;
    mediaMenu.toggleMediaSlider();

    verifyOpened(mediaMenu, mediatype);
  });

  it('closes media slider if selected menu type is the open menu type', async () => {
    const mediaMenu = await fixture(component);
    const mediatype = 'foo';

    mediaMenu.selectedMenuOption = mediatype;
    mediaMenu.select({
      detail: {
        mediatype
      }
    });

    verifyClosed(mediaMenu);
  });

  it('opens media slider menu and starts animation', async () => {
    const mediaMenu = await fixture(component);
    const mediatype = 'foo';

    mediaMenu.select({
      detail: {
        mediatype
      }
    });

    verifyOpened(mediaMenu, mediatype);
  });

  it('closes slider when menu closed', async () => {
    const mediaMenu = await fixture(component);

    mediaMenu.selectedMenuOption = 'foo';
    mediaMenu.mediaMenuOpen = true;
    await mediaMenu.updateComplete;
    mediaMenu.mediaSliderOpen = true;
    await mediaMenu.updateComplete;
    mediaMenu.mediaMenuOpen = false;
    await mediaMenu.updateComplete;

    expect(mediaMenu.selectedMenuOption).to.equal('');
  });

  it('renders menu icon as selected when selectedMenuOption matches', async () => {
    const mediaMenu = await fixture(component);
    const mediaType = 'texts';

    mediaMenu.selectedMenuOption = mediaType;
    await mediaMenu.updateComplete;

    const textsButton = mediaMenu
      .shadowRoot
      .querySelector(`[mediatype=${mediaType}`)
      .shadowRoot
      .querySelector('.selected');

    expect(textsButton).to.not.be.null;
  });

  it('renders with closed class if done animating', async () => {
    const mediaMenu = await fixture(component);

    mediaMenu.mediaMenuAnimate = true;
    await mediaMenu.updateComplete;

    expect(mediaMenu.shadowRoot.querySelector('nav').classList.contains('closed')).to.be.true;
  });
});
