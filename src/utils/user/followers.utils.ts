import XhrInterceptor from '../../services/XhrInterceptor';
import { isWithinThreshold } from '../math.utils';
import { getPostFollowerFollowingWrapper, getAllUsers } from './user.utils';
import { Followers, FollowersResponse } from '../../api/types/user';

const FOLLOWERS_PAGE_SIZE = 25;
const FOLLOWERS_THRESHOLD = 1000;

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
  const followersCount = await getFollowersCount();

  if (!followersCount) {
    return [];
  }

  let allFollowers: Followers[] = [];
  let isAccurateEnough = false;

  do {
    console.log('Sem6')
    const newFollowers = await getAllUsers<FollowersResponse>(
      xhrInterceptor,
      userName,
      FOLLOWERS_PAGE_SIZE,
      'followers'
    );
    console.log('Sem7')
    allFollowers = [...allFollowers, ...newFollowers].getUniqueItemsByKey('id');

    isAccurateEnough = isWithinThreshold(
      followersCount,
      allFollowers.length,
      FOLLOWERS_THRESHOLD
    );
  } while (!isAccurateEnough);

  return allFollowers;
};
