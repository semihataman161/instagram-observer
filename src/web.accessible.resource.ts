import './core/extension/map';
import './core/extension/array';

import XhrInterceptor from './services/XhrInterceptor';
import { getFirstPathSegment } from './utils/path.utils';
import { getAllFollowers } from './utils/user/followers.utils';
import { getAllFollowing } from './utils/user/following.utils';
import { userIdNameMap } from './helpers/Constants';

const initializeScript = () => {
  let xhrInterceptor: XhrInterceptor;

  const handlePageRefresh = async () => {
    const firstSegment = getFirstPathSegment(location.pathname);
    const shouldObserve = userIdNameMap.hasValue(firstSegment);

    if (!shouldObserve) {
      console.log(
        'initializeScript.handlePageRefresh -> Current url is not observable'
      );
      return;
    }

    const allFollowing = await getAllFollowing(xhrInterceptor, firstSegment);
    console.log('All Following: ', allFollowing);

    const allFollowers = await getAllFollowers(xhrInterceptor, firstSegment);
    console.log('All Followers: ', allFollowers);
  };

  const startScript = () => {
    xhrInterceptor = new XhrInterceptor();
    xhrInterceptor.start();

    handlePageRefresh();
  };

  startScript();
};

initializeScript();
