import XhrInterceptor, { XhrRoute } from '../../services/XhrInterceptor';
import { waitForElement } from '../dom.utils';
import { delay } from '../async.utils';
import { apiV1, userIdNameMap } from '../../helpers/Constants';
import { UserResponse, UserType } from '../../api/types/user';

export const getPostFollowerFollowingWrapper = async () => {
  const selector = 'section.xc3tme8.x1xdureb.x18wylqe.x13vxnyz.xvxrpd7';
  const section = await waitForElement(selector, 5000);

  if (!section) {
    console.error(
      'user.utils.getPostFollowerFollowingWrapper -> section not found'
    );
    return null;
  }

  return section;
};

export const openUserModal = async (userName: string, type: UserType) => {
  const selector = `a[href="/${userName}/${type}/"]`;
  const button = await waitForElement(selector, 5000);

  if (!button) {
    console.error(`user.utils.openUserModal -> ${type} button not found`);
    return;
  }

  button.click();
};

export const closeUserModal = async () => {
  const selector = 'button[type="button"] svg[aria-label="Close"]';
  const svg = await waitForElement(selector, 5000);

  if (!svg) {
    console.error('user.utils.closeUserModal -> svg not found');
    return;
  }

  const button = svg.closest('button');

  if (!button) {
    console.error('user.utils.closeUserModal -> button not found');
    return;
  }

  button.click();
};

export const fetchUsers = <T extends UserResponse = UserResponse>(
  xhrInterceptor: XhrInterceptor,
  interceptedUrl: string,
  pageSize: number,
  executeAfterAddingRoute: () => void
) => {
  const fullUrl = `${interceptedUrl}/?count=${pageSize}`;
  let users: T['users'] = [];

  return new Promise<T['users']>((resolve) => {
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
          resolve(users);
          return;
        }

        users = [...users, ...data.users].getUniqueItemsByKey('id');
      },
    };

    xhrInterceptor.addRoute(route);
    executeAfterAddingRoute();
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

  const executeAfterAddingRoute = () => openUserModal(userName, type);

  const users = await fetchUsers<T>(
    xhrInterceptor,
    interceptedUrl,
    pageSize,
    executeAfterAddingRoute
  );

  await delay(1000);
  await closeUserModal();
  await delay(1000);

  return users;
};
