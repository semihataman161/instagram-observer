export const getFirstPathSegment = (path: string) => {
  const match = path.match(/^\/([^\/]+)\/?/);
  return match ? match[1] : '';
};
