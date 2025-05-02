import './core/extension/map';

import UrlObserver from './services/UrlObserver';
import { getFirstPathSegment } from './utils/path.utils';
import { clickFollowers, clickFollowing } from './utils/user.utils';
import XhrInterceptor, { XhrRoute } from './services/XhrInterceptor';
import { apiV1, hostUrl, userIdNameMap } from './helpers/Constants';
import { FollowersResponse, UserType } from './api/types/followers';
import { buildFollowUpChain } from './services/XhrInterceptor/route';

const initializeScript = () => {
  let urlObserver: UrlObserver;
  let xhrInterceptor: XhrInterceptor;

  const getUsers = (url: string, type: UserType) => {
    let nextUrl = '';

    if(type === 'followers') {
      
    } else {

    }
    const requests = [
      {
        getUrl: (prevData: any = {}) => {
          const maxId = prevData?.next_max_id ?? '';
          return `${url}/?count=12&search_surface=follow_list_page${
            maxId ? `&max_id=${maxId}` : ''
          }`;
        },
        nextCallback: (data: any) => {
          console.log('User Data:', data);
        },
        shouldContinue: (data: any) => !!data.next_max_id,
      },
    ];

    const followUpRequest = buildFollowUpChain(requests);

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
    getFollowers(url);
    return followers;
  };

  const getFollowing = (url: string) => {
    const requests = [
      {
        getUrl: (prevData: any = {}) => {
          const maxId = prevData?.next_max_id ?? '';
          return `${url}/?count=12&search_surface=follow_list_page${
            maxId ? `&max_id=${maxId}` : ''
          }`;
        },
        nextCallback: (data: any) => {
          console.log('User Data:', data);
        },
        shouldContinue: (data: any) => !!data.next_max_id,
      },
    ];

    const followUpRequest = buildFollowUpChain(requests);

    const route: XhrRoute = {
      url,
      method: 'GET',
      followUpRequest,
    };

    xhrInterceptor.addRoute(route);
  };

  const getAllFollowing = async (userName: string) => {
    const userId = userIdNameMap.getKeyByValue(userName);
    const url = `${apiV1}/friendships/${userId}/followers`;

    let following: FollowersResponse['users'] = [];

    await clickFollowing(userName);
    getFollowing(url);
    return following;
  };

  const onPageRefresh = async (path: string) => {
    const firstSegment = getFirstPathSegment(path);
    const shouldObserve = userIdNameMap.hasValue(firstSegment);

    if (!shouldObserve) {
      return;
    }

    const allFollowers = await getAllFollowers(firstSegment);
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
};

initializeScript();
