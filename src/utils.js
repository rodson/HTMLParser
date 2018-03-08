// create a map based on the input string delimited by comma
export function makeMap(str) {
  const map = Object.create(null);
  const list = str.split(',');
  list.forEach(item => {
    map[item] = true;
  });
  return val => map[val.toLowerCase()];
}
