export const getPeriodInDays = (
  startDate: string | null,
  endDate: string | null
) => {
  if (!startDate || !endDate) {
    return 0;
  }

  const depositEnd = new Date(parseInt(startDate, 10) * 1000);
  const lockEnd = new Date(parseInt(endDate, 10) * 1000);

  const differenceInTime = lockEnd.getTime() - depositEnd.getTime();

  return Math.floor(differenceInTime / (1000 * 60 * 60 * 24));
};
