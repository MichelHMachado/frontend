export const formatDate = (date: string) => {
  const parsedDate = new Date(date);
  return new Intl.DateTimeFormat("en-US").format(parsedDate);
};
