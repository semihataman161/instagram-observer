import { waitForElement } from './dom.utils';
import XhrInterceptor, {
  XhrRoute,
  FollowUpRequest,
} from '../services/XhrInterceptor';
import { apiV1, userIdNameMap } from '../helpers/Constants';
import { UserResponse, UserType } from '../api/types/user';

export const USER_PAGE_SIZE = 12;

const getPostFollowerFollowingWrapper = async () => {
  const selector = 'section.xc3tme8.x1xdureb.x18wylqe.x13vxnyz.xvxrpd7';
  const parentElement = await waitForElement(selector, 5000);

  if (!parentElement) {
    console.error('getPostFollowerFollowingWrapper: Element not found');
    return null;
  }

  return parentElement;
};

export const getPostCount = async () => {
  const parentElement = await getPostFollowerFollowingWrapper();

  if (!parentElement) {
    return 0;
  }

  return Number(parentElement.querySelectorAll('.html-span')[0].innerHTML);
};

export const getFollowersCount = async () => {
  const parentElement = await getPostFollowerFollowingWrapper();

  if (!parentElement) {
    return 0;
  }

  return Number(parentElement.querySelectorAll('.html-span')[1].innerHTML);
};

export const getFollowingCount = async () => {
  const parentElement = await getPostFollowerFollowingWrapper();

  if (!parentElement) {
    return 0;
  }

  return Number(parentElement.querySelectorAll('.html-span')[2].innerHTML);
};

export const clickFollowers = async (userName: string) => {
  const selector = `a[href="/${userName}/followers/"]`;
  const element = await waitForElement(selector, 5000);

  if (!element) {
    console.error('clickFollowers: Element not found');
    return;
  }

  element.click();
};

export const clickFollowing = async (userName: string) => {
  const selector = `a[href="/${userName}/following/"]`;
  const element = await waitForElement(selector, 5000);

  if (!element) {
    console.error('clickFollowing: Element not found');
    return;
  }

  element.click();
};

export const getUsers = (
  xhrInterceptor: XhrInterceptor,
  url: string
): Promise<UserResponse['users']> => {
  let baseUrl = `${url}/?count=${USER_PAGE_SIZE}`;

  const type = url.split('/').pop();

  if (type === 'followers') {
    baseUrl += '&search_surface=follow_list_page';
  }

  let users: UserResponse['users'] = [];

  return new Promise((resolve) => {
    const followUpRequest: FollowUpRequest = {
      getUrl: (prevData: UserResponse) => {
        const nextUrl = prevData.next_max_id
          ? `${baseUrl}&max_id=${prevData.next_max_id}`
          : null;

        if (!nextUrl) {
          resolve(users);
        }

        return nextUrl;
      },
    };

    const route: XhrRoute = {
      url,
      method: 'GET',
      followUpRequest,
      callback: (data: UserResponse | null) => {
        if (!data) {
          resolve(users);
          return;
        }

        users = [...users, ...data.users];
      },
    };

    xhrInterceptor.addRoute(route);
  });
};

export const getAllFollowers = async (
  xhrInterceptor: XhrInterceptor,
  userName: string
) => {
  const userId = userIdNameMap.getKeyByValue(userName);
  const url = `${apiV1}/friendships/${userId}/followers`;

  await clickFollowers(userName);
  const followers = await getUsers(xhrInterceptor, url);
  return followers;
};

export const getAllFollowing = async (
  xhrInterceptor: XhrInterceptor,
  userName: string
) => {
  const userId = userIdNameMap.getKeyByValue(userName);
  const url = `${apiV1}/friendships/${userId}/following`;

  await clickFollowing(userName);
  const following = await getUsers(xhrInterceptor, url);
  return following;
};
