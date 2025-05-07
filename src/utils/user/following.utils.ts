import XhrInterceptor from '../../services/XhrInterceptor';
import { isWithinThreshold } from '../math.utils';
import { getPostFollowerFollowingWrapper, getAllUsers } from './user.utils';
import { User } from '../../api/types/user';

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
  const followingCount = await getFollowingCount();

  if (!followingCount) {
    return;
  }

  let allUsers: User[] = [];
  let isAccurateEnough = false;

  do {
    const users = await getAllUsers(xhrInterceptor, userName, 'following');
    allUsers = [...allUsers, ...users].getUniqueItemsByKey('id');

    isAccurateEnough = isWithinThreshold(followingCount, allUsers.length, 5);
  } while (!isAccurateEnough);

  return allUsers;
};
