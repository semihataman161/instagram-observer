export type FetchRoute = {
  url: string;
  method: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH';
  originalResponse?: Response;
  beforeExecute?: (url: string, request: RequestInit) => Promise<boolean>;
  afterExecute?: (url: string, response: Response) => void;
};
