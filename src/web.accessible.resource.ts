import "./core/extension/map";

import UrlObserver from "./services/UrlObserver";
import { getFirstPathSegment } from "./utils/path.utils";
import { hostUrl, apiUrlV1, userIdNameMap } from "./helpers/Constants";
import { clickFollowers, clickFollowing } from "./utils/user.utils";
import FetchInterceptor from "./services/FetchInterceptor";
import { FetchRoute } from "./services/FetchInterceptor/index.type";

let urlObserver: UrlObserver;
let fetchInterceptor: FetchInterceptor;

// https://www.instagram.com/api/v1/friendships/1389322411/followers/?count=12&search_surface=follow_list_page

const handleClickFollowers = (userName: string) => {
  const userId = userIdNameMap.getKeyByValue(userName);

  const route: FetchRoute = {
    url: `${apiUrlV1}/friendships/${userId}/followers`,
    method: "GET",
    beforeExecute: async (url, request) => {
      console.log("url: ", url);
      console.log("request: ", request);
      return false;
    },
  };
  fetchInterceptor.addRoute(route);

  clickFollowers(userName);
};

const handleClickFollowing = (userName: string) => {
  // const route: FetchRoute = {};
  // fetchInterceptor.addRoute(route);

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
  console.log("ChangedPath: ", path);
};

const startApp = () => {
  fetchInterceptor = new FetchInterceptor();
  fetchInterceptor.start();

  urlObserver = new UrlObserver(hostUrl, (path) => onPathChange(path));
  onPageRefresh(urlObserver.path);
};

startApp();
