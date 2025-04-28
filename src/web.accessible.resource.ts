import './core/extension/map';

import UrlObserver from './services/UrlObserver';
import { getFirstPathSegment } from './utils/path.utils';
import {
  getFollowersCount,
  clickFollowers,
  clickFollowing,
  changeCountInQueryString,
} from './utils/user.utils';
import XhrInterceptor, { XhrRoute } from './services/XhrInterceptor';
import { hostUrl, userIdNameMap } from './helpers/Constants';

function initializeScript() {
  let urlObserver: UrlObserver;
  let xhrInterceptor: XhrInterceptor;

  const handleClickFollowers = async (userName: string) => {
    const userId = userIdNameMap.getKeyByValue(userName);
    const followersCount = await getFollowersCount();
    const users = [];

    const route: XhrRoute = {
      url: `friendships/${userId}/followers`,
      method: 'GET',
      beforeExecute: async (url, request) => {
      const count = 25;
      const updatedUrl = changeCountInQueryString(url, count);
      return updatedUrl;
    },
    afterExecute: async (url, response) => {
      const jsonResponse = await response.json();
      console.log('After Execute:', jsonResponse);

      while (!jsonResponse.next_max_id) {
        const newRoute = { ...route, url: jsonResponse.nextPageUrl };
        xhrInterceptor.addRoute(newRoute);
      }
    },
    };

    xhrInterceptor.addRoute(route);

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
    xhrInterceptor = new XhrInterceptor();
    xhrInterceptor.start();

    urlObserver = new UrlObserver(hostUrl, (path) => onPathChange(path));
    onPageRefresh(urlObserver.path);
  };

  startScript();
}

initializeScript();
