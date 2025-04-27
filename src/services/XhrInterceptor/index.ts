import { XhrRoute } from "./index.type";

class XhrInterceptor {
  private originalXMLHttpRequest: typeof XMLHttpRequest;
  private routes: XhrRoute[] = [];

  constructor() {
    this.originalXMLHttpRequest = window.XMLHttpRequest;
  }

  public start() {
    const self = this;

    window.XMLHttpRequest = class extends this.originalXMLHttpRequest {
      private afterSendCallback = null;

      constructor() {
        super();
        const xhr = this;

        const originalOpen = xhr.open;
        xhr.open = function (method: string, url: string) {
          const foundRoute = [...self.routes]
            .reverse()
            .find(
              (element) =>
                url?.includes(element.url) && method === element.method
            );

          console.log("Found route: ", foundRoute);
          // Eğer belirli bir URL bulunursa, parametreleri değiştireceğiz.
          if (foundRoute) {
            // Burada URL parametrelerini değiştirebiliriz
            if (
              url.includes(
                "https://www.instagram.com/api/v1/friendships/2382378448/followers"
              )
            ) {
              const modifiedUrl = url.replace("count=20", "count=50"); // Örneğin, count parametresini değiştirebiliriz
              console.log("Modified URL:", modifiedUrl);

              // Yeni URL ile isteği kendimiz gönderiyoruz
              const newRequest = new XMLHttpRequest();
              newRequest.open(method, modifiedUrl, true);
              newRequest.withCredentials = true;
              newRequest.send();

              // Callback fonksiyonu çağırıyoruz
              if (xhr.afterSendCallback) {
                xhr.afterSendCallback(this);
              }

              return; // Orijinal istek gönderilmiyor, sadece yeni istek yapılacak
            }
            xhr.afterSendCallback = foundRoute.afterExecute || null;
          } else {
            xhr.afterSendCallback = null;
          }

          originalOpen.apply(xhr, arguments);
        };

        const originalSend = xhr.send;
        xhr.send = async function (data: any) {
          originalSend.apply(xhr, arguments);

          if (xhr.afterSendCallback) {
            xhr.afterSendCallback(this);
          }
        };
      }
    };
  }

  public addRoute(route: XhrRoute) {
    this.routes.push(route);
  }

  public removeRoutes(url: string) {
    this.routes = this.routes.filter((element) => element.url !== url);
  }
}

export default XhrInterceptor;
