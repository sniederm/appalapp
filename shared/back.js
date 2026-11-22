// Einheitlicher Zurück-Pfeil für alle Apps: <appalapp-back></appalapp-back>
// Einbinden im <head>: <script src="../../../shared/back.js"></script>
// Hat die App eigene Menüs, definiert sie window.appBack = () => { ...; return true; }.
// Gibt appBack true zurück, hat die App selbst navigiert; sonst geht es zur Gesamtübersicht.
(() => {
  const overview = new URL('../index.html', document.currentScript.src).href;

  class AppalappBack extends HTMLElement {
    connectedCallback() {
      if (this.shadowRoot) return;
      this.attachShadow({ mode: 'open' }).innerHTML = `
        <style>
          :host{display:inline-flex;flex:none}
          button{width:44px;height:44px;margin:0;padding:0;border-radius:50%;cursor:pointer;
            display:grid;place-items:center;background:#fff;border:2px solid #d9dcea;box-shadow:0 3px 0 #d9dcea;
            transition:transform .1s,border-color .1s,box-shadow .1s;-webkit-tap-highlight-color:transparent}
          button:hover{border-color:#2457c5;box-shadow:0 3px 0 #2457c5}
          button:active{transform:translateY(2px);box-shadow:0 1px 0 #2457c5}
          button:focus-visible{outline:3px solid #ffc533;outline-offset:2px}
          svg{width:22px;height:22px}
        </style>
        <button type="button" aria-label="Zurück" title="Zurück">
          <svg viewBox="0 0 24 24" fill="none" stroke="#1d2340" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M19 12H5M11 5l-7 7 7 7"/>
          </svg>
        </button>`;
      this.shadowRoot.querySelector('button').addEventListener('click', () => {
        if (typeof window.appBack === 'function' && window.appBack()) return;
        location.href = overview;
      });
    }
  }
  customElements.define('appalapp-back', AppalappBack);
})();
