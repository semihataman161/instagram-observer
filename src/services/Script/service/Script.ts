import { getAdapter } from '../adapter';

const Adapter = getAdapter();

class Script {
  private scriptSrc: string;

  constructor(scriptSrc: string) {
    this.scriptSrc = Adapter.getScriptURL(scriptSrc);
  }

  load() {
    const script = document.createElement('script');
    script.src = this.scriptSrc;
    script.onload = () => script.remove();
    (document.head || document.documentElement).appendChild(script);
  }
}

export default Script;
