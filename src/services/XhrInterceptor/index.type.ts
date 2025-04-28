export type XhrRoute = {
  url: string;
  method: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH';
  originalResponse?: Response;
  beforeExecute?: (
    url: string,
    request: { method: string; headers: Record<string, string>; body?: any }
  ) => Promise<boolean | string>;
  afterExecute?: (url: string, response: Response) => void;
};
