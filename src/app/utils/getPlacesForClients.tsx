import {ReactElement} from 'react';
import {v4 as uuidv4} from 'uuid';
import * as React from 'react';
import checkStatusPlace from './checkStatusPlace';

const handleChoiceTypeChair = (e: React.FormEvent<HTMLSpanElement>) => {
  if (e.currentTarget.classList.contains('buying-scheme__chair_standart') || e.currentTarget.classList.contains('buying-scheme__chair_vip')) {
    e.currentTarget.classList.toggle('buying-scheme__chair_selected');
  }
}

function getPlacesForClients(rows: number, chairs: number, standartArr: Array<string>, vipArr: Array<string>, blockedArr: Array<string>, paidArr: Array<string>): React.ReactElement[] {

  let hallChairs: ReactElement[] = [];
  let dataId = 1;
  let status = '';

  for (let i = 0; i < rows * chairs; i++) {
    if (checkStatusPlace(dataId, standartArr, vipArr, blockedArr, paidArr) === 'block') {
      status = 'buying-scheme__chair buying-scheme__chair_disabled';
    } else if (checkStatusPlace(dataId, standartArr, vipArr, blockedArr, paidArr) === 'standart') {
      status = 'buying-scheme__chair buying-scheme__chair_standart';
    } else if (checkStatusPlace(dataId, standartArr, vipArr, blockedArr, paidArr) === 'vip') {
      status = 'buying-scheme__chair buying-scheme__chair_vip';
    } else if (checkStatusPlace(dataId, standartArr, vipArr, blockedArr, paidArr) === 'paid') {
      status = 'buying-scheme__chair buying-scheme__chair_taken';
    } else {
      status = 'buying-scheme__chair buying-scheme__chair_standart';
    }

    hallChairs.push(<React.Fragment key={uuidv4()}><span className={status} data-id={dataId} onClick={(e) => {
      handleChoiceTypeChair(e);
    }}/></React.Fragment>);
    dataId++;
  }

  return hallChairs;
}

export default getPlacesForClients;
