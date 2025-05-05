export const isWithinThreshold = (a: number, b: number, threshold = 1) =>
  Math.abs(a - b) <= threshold;
