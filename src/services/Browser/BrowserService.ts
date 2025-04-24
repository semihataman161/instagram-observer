import { Browser } from './type';

class BrowserService {
  getBrowser(): Browser {
    if (this.isChrome()) {
      return 'Chrome';
    }

    if (this.isEdge()) {
      return 'Edge';
    }

    if (this.isFirefox()) {
      return 'Firefox';
    }

    if (this.isOpera()) {
      return 'Opera';
    }

    if (this.isSafari()) {
      return 'Safari';
    }

    return 'Unknown';
  }

  isChrome() {
    return navigator.userAgent.indexOf('Chrome') !== -1;
  }

  isEdge() {
    return (
      navigator.userAgent.indexOf('Edge') > -1 &&
      navigator?.appVersion.indexOf('Edge') > -1
    );
  }

  isFirefox() {
    return navigator.userAgent.indexOf('Firefox') !== -1;
  }

  isOpera() {
    return (
      navigator.userAgent.indexOf('Opera') !== -1 ||
      navigator.userAgent.indexOf('OPR') !== -1
    );
  }

  isSafari() {
    return navigator.userAgent.indexOf('Safari') !== -1;
  }
}

export default new BrowserService();
