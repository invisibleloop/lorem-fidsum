export default () => {
  const nums = [1, 2, 3, 5, 8, 13, 21];
  return nums.map(n => ({
    key: n,
    value: n,
    text: n,
  }));
};
