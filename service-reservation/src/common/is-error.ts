export const isError = function (err: any): boolean {
  if (err.status == 503 || err.responses.status == 503) {
    return true;
  } else return false;
};
