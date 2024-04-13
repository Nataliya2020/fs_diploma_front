import {HallElem} from '../../store/slices/slicesAdmin/hallAllReducer';

export function sortHalls(halls: HallElem[]): HallElem[] {
  let hallsSort: HallElem[] = [...halls];

  let arrNumbers: HallElem[] = [];
  let arrStrings: HallElem[] = [];

  hallsSort.forEach((hall) => isNaN(Number(hall.name)) ? arrStrings.push(hall) : arrNumbers.push(hall));

  arrNumbers = arrNumbers.sort((a, b) => Number(a.name) > Number(b.name) ? 1 : -1);

  arrStrings = arrStrings.sort((a, b) => a.name.localeCompare(b.name));

  hallsSort = [...arrNumbers, ...arrStrings];

  return hallsSort;
}
