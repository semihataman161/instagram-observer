import './core/extension/map';

import UrlObserver from './services/UrlObserver';
import { getFirstPathSegment } from './utils/path.utils';
import { clickFollowers, clickFollowing } from './utils/user.utils';
import XhrInterceptor, { XhrRoute } from './services/XhrInterceptor';
import { apiV1, hostUrl, userIdNameMap } from './helpers/Constants';
import { FollowersResponse } from './api/types/followers';
import { buildFollowUpChain } from './services/XhrInterceptor/route';

const initializeScript = () => {
  let urlObserver: UrlObserver;
  let xhrInterceptor: XhrInterceptor;

  const getFollowers = (url: string) => {
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
    // ---> /api/v1/friendships/1389322411/followers/?count=12&search_surface=follow_list_page
    getFollowers(url);
    // const newFollowers = await getFollowers(url);

    // if (newFollowers.next_max_id) {
    //   const modifiedUrl = `${url}/?count=12&search_surface=follow_list_page&max_id=${newFollowers.next_max_id}`;
    //   const x = await getFollowers(url);
    //   console.log(x);
    // }
    // followers = [...followers, ...newFollowers];

    // const scrollDiv = await getScrollDiv();
    // if (!scrollDiv) {
    //   return [];
    // }

    // const scrollCount = await getScrollCount();
    // console.log('scrollCount: ', scrollCount);

    // for (let i = 0; i < 2; i++) {
    //   scrollElement(scrollDiv);
    //   const newFollowers = await getFollowers(url);
    //   followers = [...followers, ...newFollowers];
    //   console.log(followers.length);
    //   console.log(`Count -> ${i + 1}`);
    //   await delay(7000);
    // }

    // console.log('Finished');
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
