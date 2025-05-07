import XhrInterceptor, { XhrRoute } from '../../services/XhrInterceptor';
import { waitForElement } from '../dom.utils';
import { delay } from '../async.utils';
import { apiV1, userIdNameMap } from '../../helpers/Constants';
import { UserResponse, UserType } from '../../api/types/user';

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

export const fetchUsers = <T extends UserResponse = UserResponse>(
  xhrInterceptor: XhrInterceptor,
  interceptedUrl: string,
  pageSize: number
) => {
  const fullUrl = `${interceptedUrl}/?count=${pageSize}`;
  let users: T['users'] = [];

  return new Promise<T['users']>((resolve) => {
    console.log('Sem1');

    const route: XhrRoute<T | null> = {
      url: interceptedUrl,
      method: 'GET',
      followUpRequest: {
        getUrl: (prevData) => {
          if (!prevData?.next_max_id) {
            resolve(users);
            return null;
          }

          return `${fullUrl}&max_id=${prevData.next_max_id}`;
        },
      },
      callback: (data) => {
        if (!data) {
          console.log('Sem2')
          resolve(users);
          console.log('Sem3')
          return;
        }

        users = [...users, ...data.users].getUniqueItemsByKey('id');
      },
    };

    xhrInterceptor.addRoute(route);
  });
};

export const getAllUsers = async <T extends UserResponse = UserResponse>(
  xhrInterceptor: XhrInterceptor,
  userName: string,
  pageSize: number,
  type: UserType
) => {
  const userId = userIdNameMap.getKeyByValue(userName);
  let interceptedUrl = `${apiV1}/friendships/${userId}/${type}`;

  await delay(2000);
  await openUserModal(userName, type);
  const users = await fetchUsers<T>(xhrInterceptor, interceptedUrl, pageSize);
  await delay(2000);
  await closeUserModal();
  return users;
};
