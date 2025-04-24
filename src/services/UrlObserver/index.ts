class UrlObserver {
  #observer: MutationObserver;

  #host = location.host;
  #path = location.pathname;

  get host() {
    return this.#host;
  }

  get path() {
    return this.#path;
  }

  get url() {
    return this.#host + this.#path;
  }

  get observer() {
    return this.#observer;
  }

  constructor(host: string, callback: (path: string) => void) {
    this.#host = host;
    this.#observer = new MutationObserver(() => {
      const path = location.pathname;
      const url = this.host + path;
      const urlChanged = this.url !== url;

      if (urlChanged) {
        this.#path = path;
        callback(path);
      }
    });
  }
}

export default UrlObserver;
