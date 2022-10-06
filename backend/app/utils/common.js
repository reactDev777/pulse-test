const objectToParams = (obj) => {
  let str = "";
  for (const key in obj) {
    if (obj[key] !== undefined && obj[key] !== null) {
      if (str !== "") {
        str += "&";
      }
      str += key + "=" + encodeURIComponent(obj[key]);
    }
  }
  return str;
};

module.exports = { objectToParams };
