export const isWithinThreshold = (a: number, b: number, threshold: number) =>
  Math.abs(a - b) <= threshold;
