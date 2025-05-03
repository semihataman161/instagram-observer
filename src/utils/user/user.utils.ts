import { waitForElement } from '../dom.utils';
import XhrInterceptor, { XhrRoute } from '../../services/XhrInterceptor';
import { apiV1, userIdNameMap } from '../../helpers/Constants';
import { UserResponse, UserType } from '../../api/types/user';

export const USER_PAGE_SIZE = 12;

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

  let users: UserResponse['users'] = [];

  return new Promise((resolve) => {
    const route: XhrRoute<UserResponse | null> = {
      url,
      method: 'GET',
      followUpRequest: {
        getUrl: (prevData) => {
          if (!prevData?.next_max_id) {
            resolve(users);
            return null;
          }

          return `${baseUrl}&max_id=${prevData.next_max_id}`;
        },
      },
      callback: (data) => {
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
