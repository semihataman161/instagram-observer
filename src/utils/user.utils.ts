import { waitForElement } from './dom.utils';

const getPostFollowerFollowingWrapper = async () => {
  const selector =
    '.x78zum5.x1q0g3np.x1l1ennw.xz9dl7a.x4uap5.xsag5q8.xkhd6sd.x5ur3kl.x13fuv20.x178xt8z';
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
