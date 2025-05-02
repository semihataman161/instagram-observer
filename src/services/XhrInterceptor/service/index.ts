import { FollowUpRequest, XhrRoute } from '../index.type';

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

            const originalOnload = this.onload;
            const originalOnerror = this.onerror;

            this.onload = (event) => {
              if (this.status >= 200 && this.status < 300) {
                try {
                  const jsonData = JSON.parse(this.responseText);

                  if (foundRoute.callback) {
                    foundRoute.callback(jsonData);
                  }

                  // Handle follow-up requests with the response data
                  const followUpRequest = foundRoute.followUpRequest;
                  if (followUpRequest) {
                    this.handleFollowUp(followUpRequest, jsonData);
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

            super.send(body);
          })();
        } else {
          super.send(body);
        }
      }

      private async handleFollowUp(
        followUpRequest: FollowUpRequest,
        prevData: any
      ) {
        let currentRequest: FollowUpRequest | null | undefined =
          followUpRequest;
        let responseData: any = null;

        const processNext = async (data: any) => {
          if (!currentRequest) return;

          const url = currentRequest.getUrl(data);
          const method = currentRequest.method ?? this.method;
          const body = currentRequest.bodyBuilder
            ? currentRequest.bodyBuilder(data)
            : null;
          const headers = currentRequest.headers ?? this.requestHeaders;

          try {
            const nextData = await new Promise<any>((resolve, reject) => {
              const nextRequest = new XMLHttpRequest();
              nextRequest.open(method, url, true);

              for (const [key, value] of Object.entries(headers)) {
                nextRequest.setRequestHeader(key, value);
              }

              nextRequest.onload = () => {
                if (nextRequest.status >= 200 && nextRequest.status < 300) {
                  try {
                    resolve(JSON.parse(nextRequest.responseText));
                  } catch (error) {
                    reject('Failed to parse JSON response');
                  }
                } else {
                  reject(`Request failed with status: ${nextRequest.status}`);
                }
              };

              nextRequest.onerror = () => reject('Network error');
              nextRequest.send(body);
            });

            responseData = nextData;

            if (currentRequest.next) {
              currentRequest = currentRequest.next(data, nextData);
              await processNext(nextData);
            }
          } catch (err) {
            console.error(err);
          }
        };

        await processNext(prevData);
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
