import { FollowUpRequest } from './index.type';

export function buildFollowUpChain(
  requests: {
    getUrl: (prevData: any) => string;
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    headers?: Record<string, string>;
    bodyBuilder?: (data: any) => any;
    nextCallback?: (data: any) => void;
    shouldContinue?: (data: any) => boolean;
  }[]
): FollowUpRequest {
  const buildStep = (index: number): FollowUpRequest => {
    const {
      getUrl,
      method,
      headers,
      bodyBuilder,
      nextCallback,
      shouldContinue,
    } = requests[index];

    return {
      getUrl,
      method,
      headers,
      bodyBuilder,
      next: (prevData, responseData) => {
        if (nextCallback) nextCallback(responseData);

        if (shouldContinue?.(responseData)) {
          return buildStep(index);
        }

        return index + 1 < requests.length ? buildStep(index + 1) : undefined;
      },
    };
  };

  return buildStep(0);
}
