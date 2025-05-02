import './core/extension/map';

import UrlObserver from './services/UrlObserver';
import { getFirstPathSegment } from './utils/path.utils';
import {
  clickFollowers,
  clickFollowing,
  getScrollCount,
  getScrollDiv,
  scrollElement,
} from './utils/user.utils';
import { delay } from './utils/async.utils';
import XhrInterceptor, { XhrRoute } from './services/XhrInterceptor';
import { apiV1, hostUrl, userIdNameMap } from './helpers/Constants';
import { FollowersResponse } from './api/types/followers';

function initializeScript() {
  let urlObserver: UrlObserver;
  let xhrInterceptor: XhrInterceptor;

  const getFollowers = (url: string): Promise<FollowersResponse['users']> => {
    return new Promise((resolve) => {
      const route: XhrRoute = {
        url,
        method: 'GET',
        callback: (data: FollowersResponse) => {
          resolve(data.users);
        },
      };

      xhrInterceptor.addRoute(route);
    });
  };

  const getAllFollowers = async (userName: string) => {
    const userId = userIdNameMap.getKeyByValue(userName);
    const url = `${apiV1}/friendships/${userId}/followers`;

    let followers: FollowersResponse['users'] = [];

    await clickFollowers(userName);
    const newFollowers = await getFollowers(url);
    followers = [...followers, ...newFollowers];

    const scrollDiv = await getScrollDiv();
    if (!scrollDiv) {
      return [];
    }

    const scrollCount = await getScrollCount();
    console.log('scrollCount: ', scrollCount);

    for (let i = 0; i < scrollCount; i++) {
      scrollElement(scrollDiv);
      const newFollowers = await getFollowers(url);
      followers = [...followers, ...newFollowers];
      console.log(`Count -> ${i + 1}`);
      await delay(7000);
    }

    console.log('Finished');
    return followers;
  };

  const handleClickFollowing = async (userName: string) => {
    await clickFollowing(userName);
  };

  const onPageRefresh = async (path: string) => {
    const firstSegment = getFirstPathSegment(path);
    const shouldObserve = userIdNameMap.hasValue(firstSegment);

    if (!shouldObserve) {
      return;
    }

    const allFollowers = await getAllFollowers(firstSegment);
    console.log(allFollowers);
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
