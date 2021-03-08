export default (context) => {
  return context.type === "UNAUTHORIZED" ? false : true;
};
