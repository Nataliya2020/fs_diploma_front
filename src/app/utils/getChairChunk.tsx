import {ReactElement} from 'react';

function getChairChunk(arr: ReactElement[], chairs: number) {
  let hallChairsMulti: ReactElement[][] = [];

  for (let i = 0; i < arr.length; i += Number(chairs)) {
    const chunk = arr.slice(i, i + Number(chairs));
    hallChairsMulti.push(chunk);
  }

  return hallChairsMulti;
}

export default getChairChunk;
