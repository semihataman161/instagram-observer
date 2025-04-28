import './core/extension/map';

import UrlObserver from './services/UrlObserver';
import { getFirstPathSegment } from './utils/path.utils';
import {
  getFollowersCount,
  clickFollowers,
  clickFollowing,
  changeCountInQueryString,
} from './utils/user.utils';
import XHRInterceptor, { XhrRoute } from './services/XHRInterceptor';
import RequestService from './services/XHRInterceptor/RequestService';
import { hostUrl, userIdNameMap } from './helpers/Constants';

function initializeScript() {
  let urlObserver: UrlObserver;
  let xhrInterceptor: XHRInterceptor;

  const handleClickFollowers = async (userName: string) => {
    const userId = userIdNameMap.getKeyByValue(userName);
    const followersCount = await getFollowersCount();
    const users = [];
    let nextMaxId = null;

    const initialUrl = `friendships/${userId}/followers`;

    const route: XhrRoute = {
      url: initialUrl,
      method: 'GET',
      beforeExecute: async (url, request) => {
        const count = 25;
        let updatedUrl = changeCountInQueryString(url, count);
        return updatedUrl;
      },
      afterExecute: async (url, response) => {
        const jsonResponse = await response.json();
        console.log('After Execute:', jsonResponse);
        nextMaxId = jsonResponse.next_max_id;
      },
    };

    xhrInterceptor.addRoute(route);

    const requestService = new RequestService(xhrInterceptor);

    // Send a request using the intercepted headers
    requestService
      .makeRequest('/api/data')
      .then((response) => response.json())
      .then((data) => console.log('Response Data:', data))
      .catch((error) => console.error('Error:', error));

    clickFollowers(userName);
  };

  const handleClickFollowing = (userName: string) => {
    clickFollowing(userName);
  };

  const onPageRefresh = (path: string) => {
    const firstSegment = getFirstPathSegment(path);
    const shouldObserve = userIdNameMap.hasValue(firstSegment);

    if (!shouldObserve) {
      return;
    }

    handleClickFollowers(firstSegment);
    // handleClickFollowing(firstSegment);
  };

  const onPathChange = (path: string) => {
    console.log('ChangedPath: ', path);
  };

  const startScript = () => {
    xhrInterceptor = new XHRInterceptor();
    xhrInterceptor.start();

    urlObserver = new UrlObserver(hostUrl, (path) => onPathChange(path));
    onPageRefresh(urlObserver.path);
  };

  startScript();
}

initializeScript();
