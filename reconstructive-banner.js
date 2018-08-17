/**
 * [ReconstructiveBanner](https://oduwsdl.github.io/Reconstructive/reconstructive-banner.js) implements `<reconstructive-banner>` [Custom Element](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements).
 * It is an unobtrusive archival replay banner to make [mementos](http://mementoweb.org/about/) interactive and surface on-demand metadata about the archived resource.
 * The banner houses a customizable branding logo that links to the replay home.
 * It provides a pre-populated text input to navigate the replay to a different URI-R.
 * A brief phrase describes the age of the current memento.
 * Navigational links to the first, last, previous, and next mementos are also provided when present.
 * In its default floating action bar (FAB) mode it auto-hides after a set duration of inactivity if the banner is not in focus and reappears on any user activity on the page such as scroll, mousemove, or keypress.
 * It provides controls to expand, collapse, or completely close the banner.
 * The expanded mode has much more real estate available to house detailed archival metadata and visualizations.
 * Use it in an HTML page as illustrated below:
 *
 * ```html
 * <script src="reconstructive-banner.js"></script>
 * <reconstructive-banner logo-src=""
 *                        home-href="/"
 *                        urir="https://example.com/"
 *                        memento-datetime="Mon, 06 Feb 2017 00:23:37 GMT"
 *                        first-urim="https://archive.host/memento/20170206002337/https://example.com/"
 *                        first-datetime="Mon, 06 Feb 2017 00:23:37 GMT"
 *                        last-urim="https://archive.host/memento/20170206002337/https://example.com/"
 *                        last-datetime="Mon, 06 Feb 2017 00:23:37 GMT"
 *                        prev-urim=""
 *                        prev-datetime=""
 *                        next-urim=""
 *                        next-datetime="">
 * </reconstructive-banner>
 * ```
 *
 * @overview  ReconstructiveBanner implements <reconstructive-banner> Custom Element for archival replay banners.
 * @author    Sawood Alam <ibnesayeed@gmail.com>
 * @license   MIT
 * @copyright ODU Web Science / Digital Libraries Research Group 2017
 */
class ReconstructiveBanner extends HTMLElement {
  /**
   * Create a new ReconstructiveBanner instance and attach a Shadow DOM.
   */
  constructor() {
    super();

    /**
     * ShadoRoot for the isolated Shadow DOM of the banner.
     *
     * @type {ShadowRoot}
     */
    this.shadow = this.attachShadow({mode: 'closed'});
  }

  /**
   * Read various attributes of the element and initialize the rendition and behavious of the banner when this custom element is added to the DOM.
   */
  connectedCallback() {
    /**
     * A base64-encoded data URI of the SVG Reconstructive Logo.
     * Used as the default banner logo if a custom logoSrc is not specified.
     *
     * @type {string}
     */
    this.LOGO = 'data:image/svg+xml;charset=utf-8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAxNiI+PHBhdGggZD0iTTAgMyBhMyAzIDAgMCAxIDMtMyBoMiBsMyAzIGgtMyBhMiAyIDAgMCAwLTIgMiB2NiBhMiAyIDAgMCAwIDIgMiBoMSBsMyAzIGgtNiBhMyAzIDAgMCAxLTMtMyBaIiBmaWxsPSIjMUI0ODY5IiAvPjxwYXRoIGQ9Ik0xNiAxNiBoLTQgbC05LTkgaDYgYTIgMiAwIDAgMCAwLTQgaC0xIGwtMy0zIGg2IGEzIDMgMCAwIDEgMyAzIHY0IGEzIDMgMCAwIDEtMyAzIGgtMSBaIiBmaWxsPSIjRjI0NzM4IiAvPjwvc3ZnPg==';

    /**
     * Source (URL or path) of the banner logo.
     * Defaults to the inline Reconstructive Logo.
     *
     * @type {string}
     */
    this.logoSrc = this.getAttribute('logo-src') || this.LOGO;

    /**
     * Hyperlink (URL or path) of the homepage to be linked from the banner logo.
     * Read from the home-href attribute.
     * Defaults to the domain root "/".
     *
     * @type {string}
     */
    this.homeHref = this.getAttribute('home-href') || '/';

    /**
     * Original resource URI (URI-R).
     * Read from the urir attribute.
     *
     * @type {string}
     */
    this.urir = this.getAttribute('urir') || '';

    /**
     * Datetime (in the RFC2822 format) when the current memento was captured.
     * Read from the memento-datetime attribute.
     *
     * @type {string}
     */
    this.mementoDatetime = this.getAttribute('memento-datetime') || '';

    /**
     * URI of the first memento.
     * Read from the first-urim attribute.
     *
     * @type {string}
     */
    this.firstUrim = this.getAttribute('first-urim') || '';

    /**
     * Datetime (in the RFC2822 format) when the first memento was captured.
     * Read from the first-datetime attribute.
     *
     * @type {string}
     */
    this.firstDatetime = this.getAttribute('first-datetime') || '';

    /**
     * URI of the last memento.
     * Read from the last-urim attribute.
     *
     * @type {string}
     */
    this.lastUrim = this.getAttribute('last-urim') || '';

    /**
     * Datetime (in the RFC2822 format) when the last memento was captured.
     * Read from the last-datetime attribute.
     *
     * @type {string}
     */
    this.lastDatetime = this.getAttribute('last-datetime') || '';

    /**
     * URI of the previous memento.
     * Read from the prev-urim attribute.
     *
     * @type {string}
     */
    this.prevUrim = this.getAttribute('prev-urim') || '';

    /**
     * Datetime (in the RFC2822 format) when the previous memento was captured.
     * Read from the prev-datetime attribute.
     *
     * @type {string}
     */
    this.prevDatetime = this.getAttribute('prev-datetime') || '';

    /**
     * URI of the next memento.
     * Read from the next-urim attribute.
     *
     * @type {string}
     */
    this.nextUrim = this.getAttribute('next-urim') || '';

    /**
     * Datetime (in the RFC2822 format) when the next memento was captured.
     * Read from the next-datetime attribute.
     *
     * @type {string}
     */
    this.nextDatetime = this.getAttribute('next-datetime') || '';

    /**
     * Determine whether the banner in the FAB mode should auto-hide after a set duration of inactivity.
     * Prevent from hiding the FAB when the banner is focused (such as the cursor is placed on it).
     *
     * @type {boolean}
     */
    this.focused = false;

    /**
     * Duration of inactivity after which the banner in FAB mode should auto-hide if not in focus.
     * The default value is set to 2000 milliseconds (2 seconds).
     *
     * @type {number}
     */
    this.autoHideDelay = 2000;

    /**
     * A function to provide human readable dispaly datetime strings for the current memento in both relative and absolute terms.
     * Relative datetime is a non-precise natural language phrase (e.g., "Captured one day and 3 hours ago").
     * Absolute datetime is a precise natural language phrase in user's locace (e.g., "Captured on 8/13/2018 at 7:23:37 PM").
     *
     * @type {function(): object}
     */
    this.displayDatetime = (() => {
      let datetime = {relative: this.mementoDatetime, absolute: this.mementoDatetime};
      const mementoDatetimeObj = new Date(this.mementoDatetime);
      const diff = Date.now() - mementoDatetimeObj;
      if (isNaN(diff)) {
        return datetime;
      }
      let [mementoDate, mementoTime] = mementoDatetimeObj.toISOString().split(/[T\.]/);
      datetime.absolute = `Captured on ${mementoDate} at ${mementoTime} UTC`;
      if (diff < 0) {
        datetime.relative = 'Capture from the future!';
        return datetime;
      }
      const datetimeUnits = ['year', 'month', 'day', 'hour', 'minute', 'second', 'millisecond'];
      let datetimeParts = new Date(diff).toISOString().split(/\D/).map(x => parseInt(x));
      datetimeParts[0] -= 1970;
      datetimeParts[1] -= 1;
      datetimeParts[2] -= 1;
      let primaryUnit, secondaryUnit, primaryQuotient, secondaryQuotient;
      for (let i = 0; i < datetimeUnits.length - 1; i++) {
        if (datetimeParts[i] == 0) {
          continue;
        }
        [primaryUnit, secondaryUnit] = datetimeUnits.slice(i, i + 2);
        [primaryQuotient, secondaryQuotient] = datetimeParts.slice(i, i + 2);
        break;
      }
      let diffStr = `${primaryQuotient} ${primaryUnit}${primaryQuotient != 1 ? 's' : ''}`;
      if (secondaryQuotient > 0) {
        diffStr += ` and ${secondaryQuotient} ${secondaryUnit}${secondaryQuotient != 1 ? 's' : ''}`;
      }
      datetime.relative = `Captured ${diffStr} ago`;
      return datetime;
    })();

    const template = `
      <style>
        a[href=''] {
          pointer-events: none;
          opacity: 0.4;
        }
        #wrapper {
          z-index: 99999999;
          padding: 10px;
          box-sizing: border-box;
        }
        #wrapper.fab {
          position: fixed;
          bottom: 10px;
          right: 10px;
          transition: all 0.5s ease-in;
        }
        #wrapper.expanded {
          position: fixed;
          top: 0;
          left: 0;
          margin: 0;
          width: 100%;
          height: 100%;
          background: rgba(100, 100, 100, 0.6);
          transition: all 0.5s ease-out;
        }
        #wrapper.hidden {
          opacity: 0;
          transition: opacity 0.5s ease-in;
        }
        #wrapper.closed {
          display: none;
        }
        #container {
          border: 2px solid #451212;
          background-color: #F2FFE3;
          border-radius: 10px;
          color: #1B4869;
          max-width: 600px;
          margin: auto;
          padding: 5px;
          box-shadow: 0 0 20px;
          display: grid;
          grid-template-columns: fit-content(300px) 20px 20px 1fr 20px 20px 20px;
          grid-template-rows: 20px 20px 1fr;
          grid-gap: 2px 10px;
          box-sizing: border-box;
          min-height: 50px;
          transition: all 0.5s ease-in;
        }
        .expanded #container {
          height: calc(100vh - 20px);
          box-shadow: none;
          transition: all 0.5s ease-out;
        }
        .fab #collapse, .fab #meta, .expanded #expand {
          display: none;
        }
        form {
          display: contents;
        }
        input {
          padding: 0 5px;
          box-sizing: border-box;
        }
        .branding {
          height: 42px;
          max-width: 300px;
        }
        .icon {
          width: 20px;
        }
        #logo {
          grid-column: 1;
          grid-row: 1 / 3;
        }
        #urir {
          grid-column: 2 / 7;
          grid-row: 1;
        }
        #first {
          grid-column: 2;
          grid-row: 2;
        }
        #prev {
          grid-column: 3;
          grid-row: 2;
        }
        #current {
          grid-column: 4;
          grid-row: 2;
          margin: 0 5px;
          font-size: 16px;
          line-height: 22px;
          color: #323B40;
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          cursor: default;
          user-select: none;
        }
        .relative {
          cursor: help;
        }
        .precision .relative, .absolute {
          display: none;
        }
        .precision .absolute {
          display: initial;
        }
        #next {
          grid-column: 5;
          grid-row: 2;
        }
        #last {
          grid-column: 6;
          grid-row: 2;
        }
        #close {
          grid-column: 7;
          grid-row: 1;
        }
        #expand {
          grid-column: 7;
          grid-row: 2;
        }
        #collapse {
          grid-column: 7;
          grid-row: 2;
        }
        #meta {
          grid-column: 1 / 8;
          grid-row: 3;
          overflow: auto;
          padding: 10px;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          grid-template-rows: auto auto auto 130px 1fr;
        }
      </style>
      <div id="wrapper" class="fab">
        <div id="container">
          <a id="home" title="Go to home" href="${this.homeHref}" rel="noreferrer">
            <img id="logo" class="branding" src="${this.logoSrc}" alt="Reconstructive Banner Logo">
          </a>
          <form id="lookup">
            <input id="urir" class="url" value="${this.urir}">
          <form>
          <a id="first" class="icon" title="${this.firstDatetime}" href="${this.firstUrim}">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M4 28v-24h4v11l10-10v10l10-10v22l-10-10v10l-10-10v11z"></path></svg>
          </a>
          <a id="prev" class="icon" title="${this.prevDatetime}" href="${this.prevUrim}">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M8 28v-24h4v11l10-10v22l-10-10v11z"></path></svg>
          </a>
          <p id="current" class="datetime" title="${this.mementoDatetime}">
            <span class="relative">${this.displayDatetime.relative}</span>
            <span class="absolute">${this.displayDatetime.absolute}</span>
          </p>
          <a id="next" class="icon" title="${this.nextDatetime}" href="${this.nextUrim}">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M24 4v24h-4v-11l-10 10v-22l10 10v-11z"></path></svg>
          </a>
          <a id="last" class="icon" title="${this.lastDatetime}" href="${this.lastUrim}">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M28 4v24h-4v-11l-10 10v-10l-10 10v-22l10 10v-10l10 10v-11z"></path></svg>
          </a>
          <a id="close" class="icon" href="#">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M31.708 25.708c-0-0-0-0-0-0l-9.708-9.708 9.708-9.708c0-0 0-0 0-0 0.105-0.105 0.18-0.227 0.229-0.357 0.133-0.356 0.057-0.771-0.229-1.057l-4.586-4.586c-0.286-0.286-0.702-0.361-1.057-0.229-0.13 0.048-0.252 0.124-0.357 0.228 0 0-0 0-0 0l-9.708 9.708-9.708-9.708c-0-0-0-0-0-0-0.105-0.104-0.227-0.18-0.357-0.228-0.356-0.133-0.771-0.057-1.057 0.229l-4.586 4.586c-0.286 0.286-0.361 0.702-0.229 1.057 0.049 0.13 0.124 0.252 0.229 0.357 0 0 0 0 0 0l9.708 9.708-9.708 9.708c-0 0-0 0-0 0-0.104 0.105-0.18 0.227-0.229 0.357-0.133 0.355-0.057 0.771 0.229 1.057l4.586 4.586c0.286 0.286 0.702 0.361 1.057 0.229 0.13-0.049 0.252-0.124 0.357-0.229 0-0 0-0 0-0l9.708-9.708 9.708 9.708c0 0 0 0 0 0 0.105 0.105 0.227 0.18 0.357 0.229 0.356 0.133 0.771 0.057 1.057-0.229l4.586-4.586c0.286-0.286 0.362-0.702 0.229-1.057-0.049-0.13-0.124-0.252-0.229-0.357z"></path></svg>
          </a>
          <a id="expand" class="icon" href="#">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M32 0h-13l5 5-6 6 3 3 6-6 5 5z"></path><path d="M32 32v-13l-5 5-6-6-3 3 6 6-5 5z"></path><path d="M0 32h13l-5-5 6-6-3-3-6 6-5-5z"></path><path d="M0 0v13l5-5 6 6 3-3-6-6 5-5z"></path></svg>
          </a>
          <a id="collapse" class="icon" href="#">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M18 14h13l-5-5 6-6-3-3-6 6-5-5z"></path><path d="M18 18v13l5-5 6 6 3-3-6-6 5-5z"></path><path d="M14 18h-13l5 5-6 6 3 3 6-6 5 5z"></path><path d="M14 14v-13l-5 5-6-6-3 3 6 6-5 5z"></path></svg>
          </a>
          <div id="meta">
            <!-- TODO: Add provenance infomration, metadata, and interactive visualizations here... -->
          </div>
        </div>
      </div>
    `;
    this.shadow.innerHTML = template;

    const container = this.shadow.getElementById('container');
    const wrapper = this.shadow.getElementById('wrapper');

    container.onmouseover = () => this.focused = true;
    container.onmouseout = () => this.focused = false;
    let focusTimer;
    const resetTimer = () => {
      wrapper.classList.remove('hidden');
      clearTimeout(focusTimer);
      focusTimer = setTimeout(() => !this.focused && wrapper.classList.contains('fab') && wrapper.classList.add('hidden'), this.autoHideDelay);
    }
    window.addEventListener('load', resetTimer);
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('mousedown', resetTimer);
    window.addEventListener('click', resetTimer);
    window.addEventListener('scroll', resetTimer);
    window.addEventListener('keypress', resetTimer);

    this.shadow.getElementById('close').onclick = e => {
      e.preventDefault();
      wrapper.classList.remove('fab', 'expanded');
      wrapper.classList.add('closed');
    };
    this.shadow.getElementById('collapse').onclick = e => {
      e.preventDefault();
      wrapper.classList.replace('expanded', 'fab');
    };
    this.shadow.getElementById('expand').onclick = e => {
      e.preventDefault();
      wrapper.classList.replace('fab', 'expanded');
    };
    wrapper.onclick = e => {
      if (e.target == wrapper) {
        wrapper.classList.replace('expanded', 'fab');
      }
    };

    const datetimeDisplay = this.shadow.getElementById('current');
    datetimeDisplay.onclick = e => {
      datetimeDisplay.classList.toggle('precision');
    };

    this.shadow.getElementById('lookup').onsubmit = e => {
      e.preventDefault();
      const urir = this.shadow.getElementById('urir').value;
      if (urir) {
        window.location = window.location.href.replace(this.urir, urir);
      }
    };
  }
}

customElements.define('reconstructive-banner', ReconstructiveBanner);
