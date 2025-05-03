import './core/extension/map';

import UrlObserver from './services/UrlObserver';
import XhrInterceptor from './services/XhrInterceptor';
import { getFirstPathSegment } from './utils/path.utils';
import {
  getFollowersCount,
  getAllFollowers,
} from './utils/user/followers.utils';
import {
  getFollowingCount,
  getAllFollowing,
} from './utils/user/following.utils';
import { hostUrl, userIdNameMap } from './helpers/Constants';

const initializeScript = () => {
  let urlObserver: UrlObserver;
  let xhrInterceptor: XhrInterceptor;

  const onPageRefresh = async (path: string) => {
    const firstSegment = getFirstPathSegment(path);
    const shouldObserve = userIdNameMap.hasValue(firstSegment);

    if (!shouldObserve) {
      console.log('Current url is not observable');
      return;
    }

    const followersCount = await getFollowersCount();
    const followingCount = await getFollowingCount();

    const allFollowers = await getAllFollowers(xhrInterceptor, firstSegment);
    console.log('AllFollowers: ', allFollowers);

    if (followersCount === allFollowers.length) {
      console.log('True followers count: ', followersCount);
    } else {
      console.log(
        `Wrong followers count -> Expected ${followersCount}, Real: ${allFollowers.length}`
      );
    }

    const allFollowing = await getAllFollowing(xhrInterceptor, firstSegment);
    console.log('AllFollowing: ', allFollowing);

    if (followingCount === allFollowing.length) {
      console.log('True following count: ', followersCount);
    } else {
      console.log(
        `Wrong following count -> Expected ${followingCount}, Real: ${allFollowing.length}`
      );
    }
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
};

initializeScript();
