export type User = {
  account_badges: unknown[];
  fbid_v2: string;
  full_name: string;
  has_anonymous_profile_picture: boolean;
  id: string;
  is_private: boolean;
  is_verified: boolean;
  latest_reel_media: number;
  pk: string;
  pk_id: string;
  profile_pic_id: string;
  profile_pic_url: string;
  strong_id__: string;
  third_party_downloads_enabled: number;
  username: string;
};

export type UserResponse = {
  big_list: boolean;
  follow_ranking_token: string;
  has_more: boolean;
  next_max_id?: string;
  page_size: number;
  should_limit_list_of_followers: boolean;
  status: string;
  use_clickable_see_more: boolean;
  users: User[];
};

export type Following = { is_favorite: boolean } & User;

export type FollowingResponse = {
  users: Following[];
} & Omit<UserResponse, 'users'>;

export type Followers = User;

export type FollowersResponse = {
  show_spam_follow_request_tab: boolean;
  users: Followers[];
} & Omit<UserResponse, 'users'>;

export type UserType = 'followers' | 'following';
