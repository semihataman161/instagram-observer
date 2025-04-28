import { FetchRoute } from './index.type';

class FetchInterceptor {
  private originalFetch: typeof fetch;
  private routes: FetchRoute[] = [];

  constructor() {
    this.originalFetch = window.fetch;
  }

  public start() {
    window.fetch = async (url, request) => {
      const stringUrl = url.toString();
      const method = request.method;

      const foundRoute = [...this.routes]
        .reverse()
        .find(
          (element) =>
            stringUrl?.includes(element.url) && method === element.method
        );

      if (foundRoute) {
        let shouldExecuteOriginalFetch = false;

        if (foundRoute.beforeExecute) {
          shouldExecuteOriginalFetch = await foundRoute.beforeExecute(
            stringUrl,
            request
          );
        }

        const defaultResponse = new Response('{}', { status: 200 });
        let response = foundRoute?.originalResponse || defaultResponse;

        if (shouldExecuteOriginalFetch) {
          response = await this.originalFetch(url, request);
        }

        if (foundRoute.afterExecute) {
          foundRoute.afterExecute(stringUrl, response);
        }

        return response;
      }

      return this.originalFetch(url, request);
    };
  }

  public addRoute(route: FetchRoute) {
    this.routes.push(route);
  }

  public removeRoutes(url: string) {
    this.routes = this.routes.filter((element) => element.url !== url);
  }
}

export default FetchInterceptor;
export type { FetchRoute };
