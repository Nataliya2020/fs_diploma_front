export function getDateForUser(date: string): string {

  const dateYear = date.slice(0, 4);
  const dateMonth = date.slice(4, 6);
  const dateDay = date.slice(6, 8);

  return `${dateDay}.${dateMonth}.${dateYear}`;
}
