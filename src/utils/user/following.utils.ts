import XhrInterceptor from '../../services/XhrInterceptor';
import { isWithinThreshold } from '../math.utils';
import { getPostFollowerFollowingWrapper, getAllUsers } from './user.utils';
import { Following, FollowingResponse } from '../../api/types/user';

const FOLLOWING_PAGE_SIZE = 200;
const FOLLOWING_THRESHOLD = 1;

export const getFollowingCount = async () => {
  const parentElement = await getPostFollowerFollowingWrapper();

  if (!parentElement) {
    return null;
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

    console.log(
      'following.utils.getAllFollowing -> Following Count: ',
      followingCount
    );
    console.log(
      'following.utils.getAllFollowing -> All Following Length: ',
      allFollowing.length
    );
    console.log(
      'following.utils.getAllFollowing -> Diff: ',
      followingCount - allFollowing.length
    );
  } while (!isAccurateEnough);

  return allFollowing;
};
