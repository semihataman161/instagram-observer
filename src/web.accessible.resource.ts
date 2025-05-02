import './core/extension/map';

import UrlObserver from './services/UrlObserver';
import {
  XhrInterceptor,
  XhrRoute,
  buildFollowUpRequest,
} from './services/XhrInterceptor';
import { getFirstPathSegment } from './utils/path.utils';
import {
  clickFollowers,
  clickFollowing,
  USER_PAGE_SIZE,
} from './utils/user.utils';
import { apiV1, hostUrl, userIdNameMap } from './helpers/Constants';
import { FollowersResponse, UserType } from './api/types/followers';

const initializeScript = () => {
  let urlObserver: UrlObserver;
  let xhrInterceptor: XhrInterceptor;

  const getUsers = (url: string, type: UserType) => {
    let baseUrl = `${url}/?count=${USER_PAGE_SIZE}`;

    if (type === 'followers') {
      baseUrl += '&search_surface=follow_list_page';
    }

    const requests = [
      {
        getUrl: (prevData: any = {}) => {
          const maxId = prevData?.next_max_id ?? '';
          return `${baseUrl}&max_id=${maxId}`;
        },
        nextCallback: (data: any) => {
          console.log('User Data:', data);
        },
        shouldContinue: (data: any) => !!data.next_max_id,
      },
    ];

    const followUpRequest = buildFollowUpRequest(requests);

    const route: XhrRoute = {
      url,
      method: 'GET',
      followUpRequest,
    };

    xhrInterceptor.addRoute(route);
  };

  const getAllFollowers = async (userName: string) => {
    const userId = userIdNameMap.getKeyByValue(userName);
    const url = `${apiV1}/friendships/${userId}/followers`;

    let followers: FollowersResponse['users'] = [];

    await clickFollowers(userName);
    getUsers(url, 'followers');
    return followers;
  };

  const onPageRefresh = async (path: string) => {
    const firstSegment = getFirstPathSegment(path);
    const shouldObserve = userIdNameMap.hasValue(firstSegment);

    if (!shouldObserve) {
      return;
    }

    const allFollowers = await getAllFollowers(firstSegment);
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
