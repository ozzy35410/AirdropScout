export const isSameUTCDate = (a: number, b: number): boolean => {
  const A = new Date(a);
  const B = new Date(b);
  return (
    A.getUTCFullYear() === B.getUTCFullYear() &&
    A.getUTCMonth() === B.getUTCMonth() &&
    A.getUTCDate() === B.getUTCDate()
  );
};
