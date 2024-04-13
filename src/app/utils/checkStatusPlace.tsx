function checkStatusPlace(idPlace: number, arrStandart: Array<string>, arrVip: Array<string>, arrBlock: Array<string>, arrPaid?: Array<string>): string {

  let res: string = '';
  if (arrBlock.includes(String(idPlace))) {
    res = 'block';
  } else if (arrStandart.includes(String(idPlace)) && !arrPaid?.includes(String(idPlace))) {
    res = 'standart';
  } else if (arrVip.includes(String(idPlace)) && !arrPaid?.includes(String(idPlace))) {
    res = 'vip';
  } else if ((arrVip.includes(String(idPlace)) && arrPaid?.includes(String(idPlace))) || (arrStandart.includes(String(idPlace)) && arrPaid?.includes(String(idPlace)))) {
    res = 'paid';
  }
  return res;
}

export default checkStatusPlace;
