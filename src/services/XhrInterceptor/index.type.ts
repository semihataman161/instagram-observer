type Method = 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH';

export type FollowUpRequest = {
  getUrl: (prevData: any) => string | null;
  method?: Method;
  headers?: Record<string, string>;
  bodyBuilder?: (prevData: any) => any;
};

export type XhrRoute = {
  url: string;
  method: Method;
  callback?: (data: any) => void;
  followUpRequest?: FollowUpRequest;
};
