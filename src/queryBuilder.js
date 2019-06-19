const queryBuilder = (obj) => {
  let query = '';
  Object.keys(obj).forEach(function(key, i) {
    if (obj[key] === undefined) {
      throw new  Error(`${key} is undefined`)
    }
    if (i === 0) {
      query = `?${key}=${encodeURI(obj[key])}`;
    } else {
      query += `&${key}=${encodeURI(obj[key])}`;
    }
  });
  return query;
}

export default queryBuilder;