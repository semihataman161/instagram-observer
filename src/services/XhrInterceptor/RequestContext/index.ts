class RequestContext {
  private headers: Record<string, string> = {};
  private url: string = '';
  private method: string = '';

  constructor(method: string, url: string) {
    this.method = method;
    this.url = url;
  }

  // Set a header for the request
  public setHeader(header: string, value: string): void {
    this.headers[header] = value;
  }

  // Get the headers for this request
  public getHeaders(): Record<string, string> {
    return this.headers;
  }

  // Manipulate the URL
  public setUrl(url: string): void {
    this.url = url;
  }

  // Get the current URL
  public getUrl(): string {
    return this.url;
  }

  // Get the method (GET, POST, etc.)
  public getMethod(): string {
    return this.method;
  }
}

export default RequestContext;
