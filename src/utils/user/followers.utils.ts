import { waitForElement } from '../dom.utils';
import { getPostFollowerFollowingWrapper, getUsers } from './user.utils';
import XhrInterceptor from '../../services/XhrInterceptor';
import { apiV1, userIdNameMap } from '../../helpers/Constants';

export const getFollowersCount = async () => {
  const parentElement = await getPostFollowerFollowingWrapper();

  if (!parentElement) {
    return 0;
  }

  return Number(parentElement.querySelectorAll('.html-span')[1].innerHTML);
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
