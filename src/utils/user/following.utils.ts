import XhrInterceptor from '../../services/XhrInterceptor';
import { isWithinThreshold } from '../math.utils';
import { getPostFollowerFollowingWrapper, getAllUsers } from './user.utils';
import { User } from '../../api/types/user';
import { delay } from '../async.utils';

export const getFollowingCount = async () => {
  const parentElement = await getPostFollowerFollowingWrapper();

  if (!parentElement) {
    return 0;
  }

  return Number(parentElement.querySelectorAll('.html-span')[2].innerHTML);
};

// export const getAllFollowing = async (
//   xhrInterceptor: XhrInterceptor,
//   userName: string
// ) => {
//   let allUsers: User[] = [];

//   const followingCount = await getFollowingCount();
//   let isAccurateEnough = false;

//   do {
//     console.log('hiammm');
//     const users = await getAllUsers(xhrInterceptor, userName, 'following');
//     allUsers = [...allUsers, ...users].getUniqueItemsByKey('id');
//     console.log('All users: ', allUsers);
//     isAccurateEnough = isWithinThreshold(followingCount, allUsers.length);
//     console.log('IsAcc: ', isAccurateEnough);
//     console.log('Semm:', followingCount && !isAccurateEnough);
//   } while (followingCount && !isAccurateEnough);

//   return allUsers;
// };

// export const getAllFollowing = async (
//   xhrInterceptor: XhrInterceptor,
//   userName: string
// ) => {
//   let allUsers: User[] = [];

//   const followingCount = await getFollowingCount();
//   let isAccurateEnough = false;

//   for (let i = 0; i < 4; i++) {
//     const users = await getAllUsers(xhrInterceptor, userName, 'following');
//     allUsers = [...allUsers, ...users].getUniqueItemsByKey('id');
//   }

//   return allUsers;
// };

export const getAllFollowing = async (
  xhrInterceptor: XhrInterceptor,
  userName: string
) => {
  let allUsers: User[] = [];

  for (let i = 0; i < 4; i++) {
    const users = await getAllUsers(xhrInterceptor, userName, 'following');
    allUsers = [...allUsers, ...users];
  }

  return allUsers.getUniqueItemsByKey('id');
};

/* 

let allUsers: User[] = [];

  const followingCount = await getFollowingCount();

  for (let i = 0; i < 4; i++) {
    const users = await getAllUsers(xhrInterceptor, userName, 'following');
    allUsers = [...allUsers, ...users];
  }

  return allUsers.getUniqueItemsByKey('id');

*/
