export type XhrRoute = {
  url: string;
  method: "GET" | "POST" | "DELETE" | "PUT" | "PATCH";
  originalResponse?: Response;
  afterExecute?: (xhr: XMLHttpRequest) => void;
};
