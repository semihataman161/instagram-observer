import XhrInterceptor from '../../services/XhrInterceptor';
import { isWithinThreshold } from '../math.utils';
import { getPostFollowerFollowingWrapper, getAllUsers } from './user.utils';
import { Following, FollowingResponse } from '../../api/types/user';

const FOLLOWING_PAGE_SIZE = 200;
const FOLLOWING_THRESHOLD = 1000;

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
    return [];
  }

  let allFollowing: Following[] = [];
  let isAccurateEnough = false;

  do {
    const newFollowing = await getAllUsers<FollowingResponse>(
      xhrInterceptor,
      userName,
      FOLLOWING_PAGE_SIZE,
      'following'
    );

    allFollowing = [...allFollowing, ...newFollowing].getUniqueItemsByKey('id');

    isAccurateEnough = isWithinThreshold(
      followingCount,
      allFollowing.length,
      FOLLOWING_THRESHOLD
    );
  } while (!isAccurateEnough);

  return allFollowing;
};
