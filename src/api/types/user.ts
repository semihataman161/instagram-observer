export type User = {
  full_name: string;
  id: string;
  is_private: boolean;
  username: string;
  [key: string]: unknown;
};

export type UserResponse = {
  next_max_id?: string;
  users: User[];
  [key: string]: unknown;
};

export type UserType = 'followers' | 'following';
