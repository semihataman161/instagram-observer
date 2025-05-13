import './core/extension/map';
import './core/extension/array';

import UrlObserver from './services/UrlObserver';
import XhrInterceptor from './services/XhrInterceptor';
import { getFirstPathSegment } from './utils/path.utils';
import { getAllFollowers } from './utils/user/followers.utils';
import { getAllFollowing } from './utils/user/following.utils';
import { hostUrl, userIdNameMap } from './helpers/Constants';

const initializeScript = () => {
  let urlObserver: UrlObserver;
  let xhrInterceptor: XhrInterceptor;

  const onPageRefresh = async (path: string) => {
    const firstSegment = getFirstPathSegment(path);
    const shouldObserve = userIdNameMap.hasValue(firstSegment);

    if (!shouldObserve) {
      console.log(
        'initializeScript.onPageRefresh -> Current url is not observable'
      );
      return;
    }

    const allFollowing = await getAllFollowing(xhrInterceptor, firstSegment);
    console.log('All Following: ', allFollowing);

    const allFollowers = await getAllFollowers(xhrInterceptor, firstSegment);
    console.log('All Followers: ', allFollowers);
  };

  const onPathChange = (path: string) => {
    console.log('initializeScript.onPathChange -> ChangedPath: ', path);
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
