import { getPostFollowerFollowingWrapper, getAllUsers } from './user.utils';
import XhrInterceptor from '../../services/XhrInterceptor';

export const getFollowingCount = async () => {
  const parentElement = await getPostFollowerFollowingWrapper();

  if (!parentElement) {
    return 0;
  }

  return Number(parentElement.querySelectorAll('.html-span')[2].innerHTML);
};

export const getAllFollowing = async (
  xhrInterceptor: XhrInterceptor,
  userName: string
) => {
  return await getAllUsers(xhrInterceptor, userName, 'following');
};
