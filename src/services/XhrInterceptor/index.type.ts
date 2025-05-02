type Method = 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH';

export type FollowUpRequest = {
  getUrl: (prevData: any) => string;
  method?: Method;
  headers?: Record<string, string>;
  bodyBuilder?: (prevData: any) => any;
  next?: (prevData: any, responseData: any) => FollowUpRequest | undefined;
};

export type XhrRoute = {
  url: string;
  method: Method;
  callback?: (data: any) => void;
  followUpRequest?: FollowUpRequest;
};
