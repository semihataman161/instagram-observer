import XhrInterceptor from '../../services/XhrInterceptor';
import { isWithinThreshold } from '../math.utils';
import { getPostFollowerFollowingWrapper, getAllUsers } from './user.utils';
import { Followers, FollowersResponse } from '../../api/types/user';

const FOLLOWERS_PAGE_SIZE = 25;
const FOLLOWERS_THRESHOLD = 1;

export const getFollowersCount = async () => {
  const parentElement = await getPostFollowerFollowingWrapper();

  if (!parentElement) {
    return null;
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
    const newFollowers = await getAllUsers<FollowersResponse>(
      xhrInterceptor,
      userName,
      FOLLOWERS_PAGE_SIZE,
      'followers'
    );

    allFollowers = [...allFollowers, ...newFollowers].getUniqueItemsByKey('id');

    isAccurateEnough = isWithinThreshold(
      followersCount,
      allFollowers.length,
      FOLLOWERS_THRESHOLD
    );

    console.log(
      'followers.utils.getAllFollowers -> Followers Count: ',
      followersCount
    );
    console.log(
      'followers.utils.getAllFollowers -> All Followers Length: ',
      allFollowers.length
    );
    console.log(
      'followers.utils.getAllFollowers -> Diff: ',
      followersCount - allFollowers.length
    );
  } while (!isAccurateEnough);

  return allFollowers;
};
