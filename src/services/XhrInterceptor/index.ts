import { XhrRoute } from './index.type';

class XHRInterceptor {
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
            let updatedUrl = this.url;
            let shouldExecuteOriginalXHR = true;

            if (foundRoute.beforeExecute) {
              const requestInfo = {
                method: this.method,
                headers: this.requestHeaders,
                body: this.body,
              };
              const result = await foundRoute.beforeExecute(
                this.url,
                requestInfo
              );

              if (typeof result === 'string') {
                updatedUrl = result;
              } else if (result === false) {
                shouldExecuteOriginalXHR = false;
              }
            }

            if (shouldExecuteOriginalXHR) {
              super.open(this.method, updatedUrl, true);
              for (const [key, value] of Object.entries(this.requestHeaders)) {
                super.setRequestHeader(key, value);
              }

              // Orijinal isteği gönder
              super.send(this.body);
            } else {
              setTimeout(() => {
                Object.defineProperty(this, 'readyState', { value: 4 });
                Object.defineProperty(this, 'status', { value: 200 });
                Object.defineProperty(this, 'responseText', {
                  value: '{}',
                });

                if (this.onload) {
                  this.onload(new ProgressEvent('load'));
                }
              }, 0);
            }

            if (foundRoute.afterExecute) {
              this.onload = () => {
                const responseText = this.responseText;
                const responseStatus = this.status;

                const response = new Response(responseText, {
                  status: responseStatus,
                });
                foundRoute.afterExecute(this.url, response);
              };
            }
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

  public removeRoutes(url: string) {
    this.routes = this.routes.filter((element) => element.url !== url);
  }
}

export default XHRInterceptor;
export type { XhrRoute };
