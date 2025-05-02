import { waitForElement } from './dom.utils';

const INSTAGRAM_PAGE_SIZE = 12;

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

export const getScrollDiv = async () => {
  const selector =
    'div.xyi19xy.x1ccrb07.xtf3nb5.x1pc53ja.x1lliihq.x1iyjqo2.xs83m0k.xz65tgg.x1rife3k.x1n2onr6';
  const element = await waitForElement(selector, 5000);

  if (!element) {
    console.error('getScrollElement: Element not found');
  }

  return element;
};

export const scrollElement = (element: HTMLElement) => {
  element.scrollTo({
    top: element.scrollHeight,
    behavior: 'smooth',
  });
};

export const getScrollCount = async () => {
  const followersCount = await getFollowersCount();
  return Math.floor(followersCount / INSTAGRAM_PAGE_SIZE);
};
