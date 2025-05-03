import XhrInterceptor, { XhrRoute } from '../../services/XhrInterceptor';
import { waitForElement } from '../dom.utils';
import { apiV1, userIdNameMap } from '../../helpers/Constants';
import { User, UserResponse, UserType } from '../../api/types/user';

export const USER_PAGE_SIZE = 200;

export const getPostFollowerFollowingWrapper = async () => {
  const selector = 'section.xc3tme8.x1xdureb.x18wylqe.x13vxnyz.xvxrpd7';
  const parentElement = await waitForElement(selector, 5000);

  if (!parentElement) {
    console.error('getPostFollowerFollowingWrapper: Element not found');
    return null;
  }

  return parentElement;
};

export const openUserModal = async (userName: string, type: UserType) => {
  const selector = `a[href="/${userName}/${type}/"]`;
  const element = await waitForElement(selector, 5000);

  if (!element) {
    console.error(`openUserModal: ${type} element not found`);
    return;
  }

  element.click();
};

export const closeUserModal = async () => {
  const selector = 'button._abl-';
  const element = await waitForElement(selector, 5000);

  if (!element) {
    console.error('closeUserModal: Element not found');
    return;
  }

  element.click();
};

export const getUsers = (
  xhrInterceptor: XhrInterceptor,
  url: string
): Promise<UserResponse['users']> => {
  const type = url.split('/').pop();
  let baseUrl = `${url}/?count=${USER_PAGE_SIZE}`;

  if (type === 'followers') {
    baseUrl += '&search_surface=follow_list_page';
  }

  const userMap = new Map<string, User>();

  return new Promise((resolve) => {
    const route: XhrRoute<UserResponse | null> = {
      url,
      method: 'GET',
      followUpRequest: {
        getUrl: (prevData) => {
          if (!prevData?.next_max_id) {
            resolve(Array.from(userMap.values()));
            return null;
          }

          return `${baseUrl}&max_id=${prevData.next_max_id}`;
        },
      },
      callback: (data) => {
        if (!data) {
          resolve(Array.from(userMap.values()));
          return;
        }

        for (const user of data.users) {
          if (!userMap.has(user.id)) {
            userMap.set(user.id, user);
          } else {
            console.log('Duplicate Full name: ', user.full_name);
          }
        }
      },
    };

    xhrInterceptor.addRoute(route);
  });
};

export const getAllUsers = async (
  xhrInterceptor: XhrInterceptor,
  userName: string,
  type: UserType
) => {
  const userId = userIdNameMap.getKeyByValue(userName);
  const url = `${apiV1}/friendships/${userId}/${type}`;

  await openUserModal(userName, type);

  const users = await getUsers(xhrInterceptor, url);
  return users;
};
