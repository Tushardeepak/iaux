import { css } from 'lit-element';

export default css`
  :host {
    --topOffset: -70vh;
  }
  nav {
    position: absolute;
    top: var(--topOffset);
    right: 0;
    z-index: -1;
    font-size: 1.6rem;
    background-color: var(--grey20);
  }
  nav.tx-slide {
    overflow: hidden;
    transition-property: top;
    transition-duration: 0.5s;
    transition-timing-function: ease;
  }
  nav.tx-slide.initial,
  nav.tx-slide.closed {
    top: var(--topOffset);
  }
  nav.tx-slide.closed {
    transition-duration: 0.1s;
  }
  nav.tx-slide.open {
    top: 100%;
    max-height: 100vh;
    max-width: 100vw;
  }
  h3 {
    padding: 0.6rem 2rem;
    margin: 0;
    font-size: inherit;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  ul {
    padding: 0.4rem 0 0.7rem 0;
    margin: 0;
  }
  a {
    display: block;
    color: var(--primary-text-color);
    text-decoration: none;
    padding: 1rem 2rem;
  }
  @media (min-width: 890px) {
    nav.tx-slide.open {
      top: 8rem;
    }
  }
`;
