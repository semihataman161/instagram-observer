export type XhrRoute = {
  url: string;
  method: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH';
  callback: (data: any) => void;
};
