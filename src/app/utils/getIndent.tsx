import getNumberFromArrayStr from './getNumberFromArrayStr(arrStr)';

export default function getIndent(sessionStartTime: string): number {
  const strSplit = sessionStartTime.split(':');
  const numberFromArrStr = getNumberFromArrayStr(strSplit);
  return numberFromArrStr[0] * 60 + numberFromArrStr[1];
}
