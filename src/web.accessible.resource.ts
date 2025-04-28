import './core/extension/map';

import UrlObserver from './services/UrlObserver';
import { getFirstPathSegment } from './utils/path.utils';
import {
  clickFollowers,
  clickFollowing,
  getFollowersCount,
  scrollDiv,
} from './utils/user.utils';
import { delay } from './utils/async.utils';
import XhrInterceptor, { XhrRoute } from './services/XhrInterceptor';
import { apiV1, hostUrl, userIdNameMap } from './helpers/Constants';
import { FollowersResponse } from './api/types/followers';

function initializeScript() {
  const instaPageSize = 12;

  let urlObserver: UrlObserver;
  let xhrInterceptor: XhrInterceptor;

  const mountFollowersInterceptor = (
    url: string
  ): Promise<FollowersResponse['users']> => {
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
    await clickFollowers(userName);

    const userId = userIdNameMap.getKeyByValue(userName);
    const url = `${apiV1}/friendships/${userId}/followers`;

    let followers: FollowersResponse['users'] = [];

    const followersCount = await getFollowersCount();
    const iterationCount = Math.ceil(followersCount / instaPageSize);

    console.log(iterationCount);

    for (let i = 0; i < 10; i++) {
      const users = await mountFollowersInterceptor(url);
      followers = [...followers, ...users];

      await delay(1000);
      await scrollDiv();
    }

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
