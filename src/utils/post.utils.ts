import { getPostFollowerFollowingWrapper } from './user/user.utils';

export const getPostCount = async () => {
  const parentElement = await getPostFollowerFollowingWrapper();

  if (!parentElement) {
    return 0;
  }

  return Number(parentElement.querySelectorAll('.html-span')[0].innerHTML);
};
