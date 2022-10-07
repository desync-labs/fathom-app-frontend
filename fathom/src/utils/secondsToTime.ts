export const secondsToTime = (seconds: number) => {
  const days = Math.floor(seconds / (24 * 60 * 60));
  const remainingSecs = seconds - days * 24 * 60 * 60;
  const hour = Math.floor(remainingSecs / (60 * 60));

  const divisor_for_minutes = remainingSecs % (60 * 60);
  const min = Math.floor(divisor_for_minutes / 60);

  const divisor_for_seconds = divisor_for_minutes % 60;
  const sec = Math.ceil(divisor_for_seconds);

  const obj = {
    days,
    hour,
    min,
    sec,
    seconds,
  };
  return obj;
};
