import { BrowserService } from '../../Browser';

import * as ChromeScriptAdapter from './chrome-script';
import * as FirefoxScriptAdapter from './firefox-script';
import * as EdgeScriptAdapter from './edge-script';
import * as OperaScriptAdapter from './opera-script';

const Adapters = {
  Chrome: ChromeScriptAdapter,
  Firefox: FirefoxScriptAdapter,
  Edge: EdgeScriptAdapter,
  Opera: OperaScriptAdapter,
};

export const getAdapter = () => {
  const browser = BrowserService.getBrowser();
  return Adapters[browser] || Adapters.Chrome;
};
