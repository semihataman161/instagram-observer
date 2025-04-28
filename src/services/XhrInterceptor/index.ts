import { XhrRoute } from './index.type';

class XhrInterceptor {
  private originalXHR: typeof XMLHttpRequest;
  private routes: XhrRoute[] = [];

  constructor() {
    this.originalXHR = window.XMLHttpRequest;
  }

  public start() {
    const routes = this.routes;
    const OriginalXHR = this.originalXHR;

    class CustomXHR extends OriginalXHR {
      private method = '';
      private url = '';
      private requestHeaders: Record<string, string> = {};
      private body?: Document | XMLHttpRequestBodyInit | null;

      open(
        method: string,
        url: string,
        async: boolean = true,
        username?: string | null,
        password?: string | null
      ) {
        this.method = method;
        this.url = url;
        super.open(method, url, async, username ?? null, password ?? null);
      }

      setRequestHeader(header: string, value: string) {
        this.requestHeaders[header] = value;
        super.setRequestHeader(header, value);
      }

      send(body?: Document | XMLHttpRequestBodyInit | null) {
        this.body = body;

        const foundRoute = [...routes]
          .reverse()
          .find(
            (route) =>
              this.url.includes(route.url) && this.method === route.method
          );

        if (foundRoute) {
          (async () => {
            super.open(this.method, this.url, true);

            for (const [key, value] of Object.entries(this.requestHeaders)) {
              super.setRequestHeader(key, value);
            }

            // Save original handlers
            const originalOnload = this.onload;
            const originalOnerror = this.onerror;

            // Set your custom handlers
            this.onload = (event) => {
              if (this.status >= 200 && this.status < 300) {
                try {
                  const jsonData = JSON.parse(this.responseText);

                  if (foundRoute.callback) {
                    foundRoute.callback(jsonData);
                  }
                } catch (error) {
                  console.error('Failed to parse JSON response:', error);
                }
              } else {
                console.error('Request failed with status:', this.status);
              }

              if (originalOnload) {
                originalOnload.call(this, event);
              }
            };

            this.onerror = (event) => {
              console.error('Network error or request failed');

              if (originalOnerror) {
                originalOnerror.call(this, event);
              }
            };

            super.send(this.body);
          })();
        } else {
          super.send(body);
        }
      }
    }

    window.XMLHttpRequest = CustomXHR as any;
  }

  public addRoute(route: XhrRoute) {
    this.routes.push(route);
  }

  public removeRoute(url: string) {
    this.routes = this.routes.filter((element) => element.url !== url);
  }
}

export default XhrInterceptor;
export type { XhrRoute };
