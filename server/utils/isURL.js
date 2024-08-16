const isUrlRegex =
  /^(https?:\/\/)?([\w\d\-]+\.)+[\w\d\-]+(\:[0-9]{1,5})?(\/[\w\d\-\.\/]*)*$/;

const isURL = (url) => {
  return isUrlRegex.test(url);
};

export { isURL };
