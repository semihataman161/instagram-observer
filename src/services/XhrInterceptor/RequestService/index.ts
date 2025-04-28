import XHRInterceptor from '..';

class RequestService {
  private interceptor: XHRInterceptor;

  constructor(interceptor: XHRInterceptor) {
    this.interceptor = interceptor;
  }

  // Send the request using the intercepted headers and manipulated URL
  public async makeRequest(
    url: string,
    body?: Document | XMLHttpRequestBodyInit | null
  ): Promise<Response> {
    const headers = this.interceptor.getRequestHeaders(url);
    
    if (!headers) {
      throw new Error(`No headers found for URL: ${url}`);
    }

    const xhr = new XMLHttpRequest();

    // Open the request
    xhr.open('GET', url);

    // Set the headers
    for (const [key, value] of Object.entries(headers)) {
      xhr.setRequestHeader(key, value);
    }

    // Handle the response
    return new Promise((resolve, reject) => {
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(new Response(xhr.responseText, { status: xhr.status }));
        } else {
          reject(new Error(`Request failed with status ${xhr.status}`));
        }
      };

      xhr.onerror = () => reject(new Error('Network error'));

      // Send the request
      xhr.send(body);
    });
  }
}

export default RequestService;
