import "./core/extension/map";

import UrlObserver from "./services/UrlObserver";
import { getFirstPathSegment } from "./utils/path.utils";
import { hostUrl, userIdNameMap } from "./helpers/Constants";
import { clickFollowers, clickFollowing } from "./utils/user.utils";
import FetchInterceptor from "./services/FetchInterceptor";
import { FetchRoute } from "./services/FetchInterceptor/index.type";

let urlObserver: UrlObserver;
let fetchInterceptor: FetchInterceptor;

const handleClickFollowers = (userName: string) => {
  const userId = userIdNameMap.getKeyByValue(userName);

  // const route: FetchRoute = {
  //   url: `${}`,
  //   method: 'GET'
  // };
  // interceptor.addRoute(route);

  clickFollowers(userName);
};

const handleClickFollowing = (userName: string) => {
  // const route: FetchRoute = {};
  // interceptor.addRoute(route);

  clickFollowing(userName);
};

const onPageRefresh = (path: string) => {
  const firstSegment = getFirstPathSegment(path);
  const shouldObserve = userIdNameMap.hasValue(firstSegment);

  if (!shouldObserve) {
    return;
  }

  // handleClickFollowers(firstSegment);
  // handleClickFollowing(firstSegment);
};

const onPathChange = (path: string) => {
  console.log("ChangedPath: ", path);
};

const startApp = () => {
  fetchInterceptor = new FetchInterceptor();
  fetchInterceptor.start();

  urlObserver = new UrlObserver(hostUrl, (path) => onPathChange(path));
  onPageRefresh(urlObserver.path);
};

startApp();
