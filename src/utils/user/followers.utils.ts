import { getPostFollowerFollowingWrapper, getAllUsers } from './user.utils';
import XhrInterceptor from '../../services/XhrInterceptor';

export const getFollowersCount = async () => {
  const parentElement = await getPostFollowerFollowingWrapper();

  if (!parentElement) {
    return 0;
  }

  return Number(parentElement.querySelectorAll('.html-span')[1].innerHTML);
};

export const getAllFollowers = async (
  xhrInterceptor: XhrInterceptor,
  userName: string
) => {
  return await getAllUsers(xhrInterceptor, userName, 'followers');
};
