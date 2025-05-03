import { waitForElement } from '../dom.utils';
import { getPostFollowerFollowingWrapper, getUsers } from './user.utils';
import XhrInterceptor from '../../services/XhrInterceptor';
import { apiV1, userIdNameMap } from '../../helpers/Constants';

export const getFollowingCount = async () => {
  const parentElement = await getPostFollowerFollowingWrapper();

  if (!parentElement) {
    return 0;
  }

  return Number(parentElement.querySelectorAll('.html-span')[2].innerHTML);
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
