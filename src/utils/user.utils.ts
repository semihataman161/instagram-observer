import { waitForElement } from './dom.utils';

const getPostFollowerFollowingWrapper = async () => {
  const selector =
    'section.xc3tme8.x1xdureb.x18wylqe.x13vxnyz.xvxrpd7';
  const parentElement = await waitForElement(selector, 5000);

  if (!parentElement) {
    console.error('getPostFollowerFollowingWrapper: Element not found');
    return null;
  }

  return parentElement;
};

export const getPostCount = async () => {
  const parentElement = await getPostFollowerFollowingWrapper();
  return parentElement.querySelectorAll('.html-span')[0].innerHTML;
};

export const getFollowersCount = async () => {
  const parentElement = await getPostFollowerFollowingWrapper();
  return parentElement.querySelectorAll('.html-span')[1].innerHTML;
};

export const getFollowingCount = async () => {
  const parentElement = await getPostFollowerFollowingWrapper();
  return parentElement.querySelectorAll('.html-span')[2].innerHTML;
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

export const changeCountInQueryString = (url: string, newCount: number) => {
  return url.replace(/(count=)(\d+)/, `$1${newCount}`);
};
