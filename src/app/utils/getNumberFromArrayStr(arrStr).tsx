export default function getNumberFromArrayStr(arrStr: string[]): number[] {
  return arrStr.reduce((min: number[], item: string) => {
    const numberDate = parseInt(item);
    min.push(numberDate);
    return min;
  }, []);
}
