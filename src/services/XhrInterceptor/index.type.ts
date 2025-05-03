type Method = 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH';

export type FollowUpRequest<T = any> = {
  method?: Method;
  headers?: Record<string, string>;
  getUrl: (prevData: T) => string | null;
  bodyBuilder?: (prevData: T) => any;
};

export type XhrRoute<T = any> = {
  url: string;
  method: Method;
  callback?: (data: T) => void;
  followUpRequest?: FollowUpRequest<T>;
};
