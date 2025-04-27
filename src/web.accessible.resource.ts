import "./core/extension/map";

import UrlObserver from "./services/UrlObserver";
import { getFirstPathSegment } from "./utils/path.utils";
import { hostUrl, userIdNameMap } from "./helpers/Constants";
import { clickFollowers, clickFollowing } from "./utils/user.utils";
import XhrInterceptor from "./services/XhrInterceptor";
import { XhrRoute } from "./services/XhrInterceptor/index.type";

function initializeScript() {
  let urlObserver: UrlObserver;
  let xhrInterceptor: XhrInterceptor;

  const handleClickFollowers = (userName: string) => {
    const userId = userIdNameMap.getKeyByValue(userName);

    xhrInterceptor.addRoute({
      url: "https://www.instagram.com/api/v1/friendships/2382378448/followers",
      method: "GET",
      afterExecute: (xhr) => {
        console.log("Custom handler after the request is completed:", xhr);
      },
    });

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
    console.log("ChangedPath: ", path);
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
