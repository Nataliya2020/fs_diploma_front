import {ReactElement} from 'react';
import {v4 as uuidv4} from 'uuid';
import * as React from 'react';
import checkStatusPlace from './checkStatusPlace';

const handleChoiceTypeChair = (e: React.FormEvent<HTMLSpanElement>) => {
  if (e.currentTarget.classList.contains('conf-step__chair_standart')) {
    e.currentTarget.classList.remove('conf-step__chair_standart');
    e.currentTarget.classList.add('conf-step__chair_vip');
  } else if (e.currentTarget.classList.contains('conf-step__chair_vip')) {
    e.currentTarget.classList.remove('conf-step__chair_vip');
    e.currentTarget.classList.add('conf-step__chair_disabled');
  } else if (e.currentTarget.classList.contains('conf-step__chair_disabled')) {
    e.currentTarget.classList.remove('conf-step__chair_disabled');
    e.currentTarget.classList.add('conf-step__chair_standart');
  }
}

function getStatusChairsPlace(rows: number, chairs: number, standartArr: Array<string>, vipArr: Array<string>, blockedArr: Array<string>): React.ReactElement[] {

  let hallChairs: ReactElement[] = [];
  let dataId = 1;
  let status = '';

  for (let i = 0; i < rows * chairs; i++) {

    if (checkStatusPlace(dataId, standartArr, vipArr, blockedArr) === 'block') {
      status = 'conf-step__chair conf-step__chair_disabled';
    } else if (checkStatusPlace(dataId, standartArr, vipArr, blockedArr) === 'standart') {
      status = 'conf-step__chair conf-step__chair_standart';
    } else if (checkStatusPlace(dataId, standartArr, vipArr, blockedArr) === 'vip') {
      status = 'conf-step__chair conf-step__chair_vip';
    } else {
      status = 'conf-step__chair conf-step__chair_standart';
    }

    hallChairs.push(<React.Fragment key={uuidv4()}><span className={status} data-id={dataId} onClick={(e) => {
      handleChoiceTypeChair(e)
    }}/></React.Fragment>);
    dataId++;
  }
  return hallChairs;
}

export default getStatusChairsPlace;
