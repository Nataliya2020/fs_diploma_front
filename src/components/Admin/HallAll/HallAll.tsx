import * as React from 'react';
import {useAppSelector, useAppDispatch} from '../../../app/hooks';
import * as ReactRouterDOM from 'react-router-dom';
import {v4 as uuidv4} from 'uuid';
import HeaderConf from '../HeaderConf/HeaderConf';
import getStatusChairsPlace from '../../../app/utils/getStatusChairsPlace';
import getChairChunk from '../../../app/utils/getChairChunk';
import checkStatusPlace from '../../../app/utils/checkStatusPlace';
import getIdHallData from '../../../app/utils/getIdHallData';
import getIdHallId from '../../../app/utils/getIdHallId';
import {fetchUpdateHallElem, setIsErroneousUpdateHall} from '../../../store/slices/slicesAdmin/hallUpdateReducer';
import {
  fetchGetFilmsElems, setIsErroneousAllFilms,
  setIsNoneDeleteFilmServer, setIsSuccessfulGetAllFilms
} from '../../../store/slices/slicesAdmin/filmAllReducer';
import getIndent from '../../../app/utils/getIndent';
import Tooltip from '../../Tooltip/Tooltip';
import {
  setIsActive, setErrorMessage,
  setIsNotNumberInputRowsInHall, setIsNotNumberInputChairsInRowsInHall,
  setIsNotNumberInputPriceStandart, setIsNotNumberInputPriceVip
} from '../../../store/slices/tooltipReducer';
import '../../../admin.css';
import '../../../normolizeAdmin.css';

import {
  setIsVisiblePopupAddHall,
  setIsVisiblePopupDeleteHall,
  setIsAddHall, setHallName
} from '../../../store/slices/slicesAdmin/hallAddReducer';

import {
  setFilmNameForDelete,
  setIsVisiblePopupDeleteFilm,
  setIdFilmForDelete
} from '../../../store/slices/slicesAdmin/filmDeleteReducer';
import {
  setIdForDeletHall
} from '../../../store/slices/slicesAdmin/hallDeleteReducer';

import {
  fetchGetHallElems, setRowsValue,
  setCheckedHallId, setChairsInRowsValue,
  setBlocked, setStandart,
  setVip, setPriceStandartValue,
  setPriceVipValue, setCheckedHallPriceId,
  Films, setIsErroneousAllHall
} from '../../../store/slices/slicesAdmin/hallAllReducer';

import {fetchPostFilmElem, setIsVisiblePopupAddFilm} from '../../../store/slices/slicesAdmin/filmAddReducer';

import {
  fetchPostSessionElem, setDateSessions,
  setParCoords, setSessionHallName,
  setTimeStartSession, setIsVisiblePopupAddSession,
} from '../../../store/slices/slicesAdmin/sessionAddReducer';

import {
  setFilmDeleteName,
  setSessionId,
  setIsVisiblePopupDeleteSession
} from '../../../store/slices/slicesAdmin/sessionDeleteReducer';

import {
  fetchGetSessionElems, setIsErroneousAllSession, setIsSuccessfulGetAllSessions
} from '../../../store/slices/slicesAdmin/sessionsAllReducerAdmin';

import {fetchAddSeatElems} from '../../../store/slices/slicesAdmin/seatAddReducerAdmin';
import {sortHalls} from '../../../app/utils/sortHalls';
import {setIsUserSelectedAvatarForFilm} from '../../../store/slices/validationFormReducer';
import {
  setIsAddedFilmsAndSessions, setIsDeletedFilmsAndSessions,
  setIsGetHallAllForChairs, setIsGetHallAllForPrice,
  setPropsTitle,
} from '../../../store/slices/infoFinalActionCrud';
import {
  setCompareChairsMessage,
  setComparePriceMessage,
  setMessageNotRemoveFilmsAndSessions
} from '../../../store/slices/infoReducer';
import {styleError} from '../../../app/stylesForInfo/stylesForInfo';
import {UpdateSeats} from '../../../app/types/types'
import {useEffect, useRef} from 'react';
import NavigationDate from '../../Client/NavigationDate';
import {getDate} from '../../../app/utils/getDate';
import {Sessions} from '../../../store/slices/slicesAdmin/sessionsAllReducerAdmin';
import HandleFetchError from '../../HandleFetchError/HandleFetchError';

function HallAll({
                   addSessionData = (sessionData: {
                     hall: number,
                     start: number,
                     end: number
                   }) => {
                   }
                 }) {
  const dispatch = useAppDispatch();
  const authError = useAppSelector((state) => state.hallsAll.unauthorizedAuthTimeout);
  let halls = useAppSelector((state) => state.hallsAll.hallElems);
  const rowsValue = useAppSelector((state) => state.hallsAll.rowsValue);
  const chairsInRowsValue = useAppSelector((state) => state.hallsAll.chairsInRowsValue);
  const checkedId = useAppSelector(state => state.hallsAll.checkedHallId);
  const standartArr = useAppSelector(state => state.hallsAll.standart);
  const vipArr = useAppSelector(state => state.hallsAll.vip);
  const blockedArr = useAppSelector(state => state.hallsAll.blocked);
  const priceStandartValue = useAppSelector(state => state.hallsAll.priceStandartValue);
  const priceVipValue = useAppSelector(state => state.hallsAll.priceVipValue);
  const checkedHallPriceId = useAppSelector(state => state.hallsAll.checkedHallPriceId);
  const films = useAppSelector(state => state.filmsAll.filmElems);
  let filmForRender = useAppSelector(state => state.filmsAll.copyFilmsForRender);
  let sessionForRender = useAppSelector(state => state.sessionAllAdmin.copySessionsElems);
  const copySession = useAppSelector(state => state.sessionAllAdmin.sessionsElems);
  const isLoadingGetFilms = useAppSelector(state => state.filmsAll.isLoading);
  const isLoadingHallAll = useAppSelector(state => state.hallsAll.isLoading);
  const isTooltipActive = useAppSelector(state => state.tooltip.isActive);
  const tooltipErrorMessage = useAppSelector(state => state.tooltip.errorMessage);
  const Navigate = ReactRouterDOM.Navigate;
  const localStorageAdminInput = localStorage.getItem('adminInputData');
  const isNotNumberInputRowsInHall = useAppSelector(state => state.tooltip.isNotNumberInputRowsInHall);
  const errorMessageTooltip = useAppSelector(state => state.tooltip.errorMessage);
  const isNotNumberInputChairsInRowsInHall = useAppSelector(state => state.tooltip.isNotNumberInputChairsInRowsInHall);
  const isNotNumberInputPriceStandart = useAppSelector(state => state.tooltip.isNotNumberInputPriceStandart);
  const isNotNumberInputPriceVip = useAppSelector(state => state.tooltip.isNotNumberInputPriceVip);
  const isLoadingSession = useAppSelector(state => state.sessionAllAdmin.isLoading);
  const isErroneousAllHall = useAppSelector(state => state.hallsAll.isErroneousAllHall);
  const isErroneousAllFilms = useAppSelector(state => state.filmsAll.isErroneousAllFilms);
  const isErroneousAllSession = useAppSelector(state => state.sessionAllAdmin.isErroneousAllSession);
  const isErroneousUpdateHall = useAppSelector(state => state.updateHall.isErroneousUpdateHall);
  const isLoadingUpdateHall = useAppSelector(state => state.updateHall.isLoading);
  const isActiveSale = useAppSelector(state => state.hallsAll.isActiveSale);
  const errorMessageGetHalls = useAppSelector(state => state.hallsAll.errorMessage);
  const errorMessageGetFilms = useAppSelector(state => state.filmsAll.errorMessage);
  const errorMessageGetSessions = useAppSelector(state => state.sessionAllAdmin.errorMessage);

  let dateSessions = '';
  const dateForBegin = getDate();

  // ref for movie
  const filmsNew = useRef<HTMLDivElement>(null);
  let refCurrentFilmsArray: HTMLDivElement[];

  let backgroundsFilms: {
    title: string,
    backgroundColor: string
  }[] = [];
//

  // use ref for movie
  if (filmsNew && filmsNew.current) {
    refCurrentFilmsArray = filmsNew.current.querySelectorAll('.conf-step__movie') as unknown as HTMLDivElement[];

    backgroundsFilms = [...refCurrentFilmsArray].reduce((arr: {
      title: string,
      backgroundColor: string
    }[], film) => {

      let obj = {title: '', backgroundColor: ''};
      const filmTitle = film.querySelector('.conf-step__movie-title');

      if (filmTitle && filmTitle?.textContent) {
        obj.title = filmTitle && filmTitle?.textContent;
      }

      obj.backgroundColor = getComputedStyle(film).backgroundColor;

      arr.push(obj);
      return arr;
    }, []);
  }
//

  useEffect(() => {
    dispatch(setIsErroneousUpdateHall(false))
    dispatch(setIsErroneousAllHall(false));
    dispatch(setIsErroneousAllFilms(false));
    dispatch(setIsErroneousAllSession(false));
    dispatch((setIsActive(false)));
    dispatch((setErrorMessage('')));
    const controller = new AbortController();
    const signal = controller.signal;
    const data = {date: dateSessions, signal: signal};

    try {
      if (authError) {
        return;
      } else {
        dispatch(fetchGetHallElems(signal));
        dispatch(fetchGetFilmsElems(signal));
        dispatch(fetchGetSessionElems(data));
      }
    } catch (e) {
      const resultError = (e as Error).message;
      throw new Error('что-то пошло не так' + resultError);
    }

    return () => {

      controller.abort();
    }
  }, [authError, dateSessions, dispatch])

  let arraySeatsInHall: UpdateSeats[] = [];
  let localStorageAdminInputParse: Films[] = [];

  if (localStorageAdminInput) {
    try {
      localStorageAdminInputParse = JSON.parse(localStorageAdminInput) || [];
    } catch (e) {
      const resultError = (e as Error);
      throw new Error(resultError.message);
    }
  }

  if (localStorageAdminInput && !isLoadingGetFilms) {
    filmForRender = [...filmForRender, ...localStorageAdminInputParse];
  }

  const localStorageAdminSessions = localStorage.getItem('adminInputSessions');
  let localStorageAdminSessionsParse: Sessions[] = [];

  if (localStorageAdminSessions) {
    try {
      localStorageAdminSessionsParse = JSON.parse(localStorageAdminSessions);
    } catch (e) {
      const resultError = (e as Error);
      throw new Error(resultError.message);
    }
  }

  if (localStorageAdminSessions) {

    const daySesLocSt = localStorageAdminSessionsParse.filter((ses) => ses.dateSession === dateForBegin);
    sessionForRender = [...sessionForRender, ...daySesLocSt];
  }

  const hallsSort = sortHalls(halls);

  let indexHall = Number(localStorage.getItem('indexHall'));

  if (indexHall === 0) {
    indexHall = hallsSort[0].id;
    localStorage.setItem('indexHall', String(hallsSort[0].id));
  }

  if (authError) {
    return <Navigate to={'/login'}/>
  }

  const handleRowsValue = (e: {
    target: {
      value: string
    }
  }) => {

    if (!/(^[\d]+$)/.test(e.target.value) && e.target.value.length !== 0) {
      dispatch(setIsNotNumberInputRowsInHall(true));
      dispatch(setErrorMessage('Вводите только цифры'));
    } else {
      dispatch(setIsNotNumberInputRowsInHall(false));
      dispatch(setRowsValue(e.target.value));
      dispatch(setErrorMessage(''));
    }

    dispatch(setBlocked([]));
    dispatch(setStandart([]));
    dispatch(setVip([]));
  }

  const handleClickRowsValue = () => {
    dispatch(setRowsValue(''));
  }

  const handleChairsInRowsValue = (e: {
    target: {
      value: string
    }
  }) => {
    if (!/(^[\d]+$)/.test(e.target.value) && e.target.value.length !== 0) {
      dispatch(setIsNotNumberInputChairsInRowsInHall(true));
      dispatch(setErrorMessage('Вводите только цифры'));
    } else {
      dispatch(setChairsInRowsValue(e.target.value));
      dispatch(setIsNotNumberInputChairsInRowsInHall(false));
      dispatch(setErrorMessage(''));
    }

    dispatch(setBlocked([]));
    dispatch(setStandart([]));
    dispatch(setVip([]));
  }

  const handleClickChairsValue = () => {
    dispatch(setChairsInRowsValue(''));
  }

  const handleCreateHall = () => {
    dispatch(setIsNoneDeleteFilmServer(false));
    dispatch(setIsAddHall(true));
    dispatch(setIsVisiblePopupAddHall(true));
    dispatch(setPropsTitle('Добавление зала'));
    dispatch(setHallName(''));
  }

  const choiceHallForPrice = (e: React.ChangeEvent<HTMLInputElement>, i: number, item: {
    price_standart_chair: number,
    price_vip_chair: number
  }) => {
    if (i === checkedHallPriceId) {
      return;
    } else {
      dispatch(setCheckedHallPriceId(i));
      localStorage.setItem('indexHallPrice', String(i));
      const parentArrayPriceRadio = (e.target as HTMLElement).closest('.conf-step__wrapper');

      if (parentArrayPriceRadio) {
        const arrayPriceRadio = parentArrayPriceRadio.querySelectorAll('[name="prices-hall"]');

        Array.from(arrayPriceRadio).forEach((item) => {
          if (item instanceof HTMLElement) {
            if (item.dataset.i !== String(i)) {
              item.removeAttribute('checked');
            }
          }
        });
        e.target.setAttribute('checked', 'true');
      }

      dispatch(setPriceStandartValue(item.price_standart_chair));
      dispatch(setPriceVipValue(item.price_vip_chair));
    }
  }
  const choiceHallForConf = (e: React.ChangeEvent<HTMLInputElement>, i: number, item: {
    id: number,
    rows: number,
    chairs_in_row: number,
    blocked_chairs: string,
    number_standard_chairs: string,
    number_vip_chairs: string
  }) => {
    if (item.id === checkedId) {
      return;
    } else {
      const radioParent = e.target.closest('.conf-step__wrapper');
      const checkedIdStr = '"' + checkedId + '"';

      if (radioParent) {
        const elRemoveActive = radioParent.querySelector('input[data-id=' + checkedIdStr + ']');
        elRemoveActive?.removeAttribute('checked');
      }

      dispatch(setCheckedHallId(item.id));

      localStorage.setItem('indexHall', String(item.id));

      e.target.setAttribute('checked', 'true');

      dispatch(setRowsValue(item.rows));
      dispatch(setChairsInRowsValue(item.chairs_in_row));

      const blockedItem = item.blocked_chairs.split(',');
      let standartItem = item.number_standard_chairs.split(',');
      let vipItem = item.number_vip_chairs.split(',');

      if (vipItem.length === 1 && vipItem[0] === '') {
        vipItem = [];
      }

      if (standartItem.length === 1 && standartItem[0] === '') {
        standartItem = [];
      }

      dispatch(setBlocked(blockedItem));
      dispatch(setStandart(standartItem));
      dispatch(setVip(vipItem));
    }
  }

  const handleDeleteHall = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(setIsVisiblePopupDeleteHall(true));
    dispatch(setPropsTitle('Удаление зала'));

    const parent = (e.target as HTMLElement).closest('li');

    if (parent) {
      dispatch(setIdForDeletHall(parent.getAttribute('id')));
    }
  }

  const handleClickCancelConfHall = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const [idHall, chairsArray] = getIdHallData(e.currentTarget);

    let res = '';

    const currentHall = hallsSort.find((item) => item.id === Number(idHall));

    let arrBlock: string[] = [];
    let arrStandart: string[] = [];
    let arrVip: string[] = [];

    chairsArray.forEach((chair) => {
      if (currentHall) {
        arrBlock = currentHall?.blocked_chairs.split(',');
        arrStandart = currentHall?.number_standard_chairs.split(',');
        arrVip = currentHall?.number_vip_chairs.split(',');

        res = checkStatusPlace(Number(chair.getAttribute('data-id')), arrStandart, arrVip, arrBlock);

        if (res === 'block') {
          chair.classList.remove('conf-step__chair_standart');
          chair.classList.remove('conf-step__chair_vip');
          chair.classList.add('conf-step__chair_disabled');
        } else if (res === 'vip') {
          chair.classList.remove('conf-step__chair_standart');
          chair.classList.add('conf-step__chair_vip');
          chair.classList.remove('conf-step__chair_disabled');
        } else {
          chair.classList.add('conf-step__chair_standart');
          chair.classList.remove('conf-step__chair_vip');
          chair.classList.remove('conf-step__chair_disabled');
        }
      }
    })

    dispatch(setRowsValue(currentHall?.rows));
    dispatch(setChairsInRowsValue(currentHall?.chairs_in_row));
    dispatch(setBlocked(arrBlock));
    dispatch(setStandart(arrStandart));
    dispatch(setVip(arrVip));
  }
  const handleClickSaveChairs = (e: React.MouseEvent<HTMLInputElement>) => {
    e.preventDefault();

    const parent = (e.target as HTMLElement).closest('.conf-step__wrapper');
    const [idHall, chairsArray] = getIdHallData(e.currentTarget);
    const inputRows = parent?.querySelector('.conf-step__legend');
    const inputsValue = inputRows?.querySelectorAll('.conf-step__label>.conf-step__input');

    if (inputsValue) {
      Array.from(inputsValue).forEach((inputRows) => {
        if (inputRows.getAttribute('name') === 'rows') {
          dispatch(setRowsValue(inputRows.getAttribute('value')))
        }
        if (inputRows.getAttribute('name') === 'chairs_in_rows') {
          dispatch(setChairsInRowsValue(inputRows.getAttribute('value')))
        }
      })
    }

    const currentHall = hallsSort.find((hall) => hall.id === Number(idHall));
    const blockedArray: string[] = [];
    const standardArray: string[] = [];
    const vipArray: string[] = [];

    chairsArray.forEach((chair) => {
      if (chair.classList.contains('conf-step__chair_disabled')) {
        const chairId = chair.getAttribute('data-id');
        if (chairId) {
          blockedArray.push(chairId);
        }
      } else if (chair.classList.contains('conf-step__chair_standart')) {
        const chairId = chair.getAttribute('data-id');
        if (chairId) {
          standardArray.push(chairId);
        }
      } else if (chair.classList.contains('conf-step__chair_vip')) {
        const chairId = chair.getAttribute('data-id');
        if (chairId) {
          vipArray.push(chairId);
        }
      }
    })

    dispatch(setBlocked(blockedArray));
    dispatch(setStandart(standardArray));
    dispatch(setVip(vipArray));

    let blocked: string = blockedArray.join();

    if (blocked === '') {
      blocked = '.';
    }

    const updateHallData = {
      name: currentHall?.name,
      rows: rowsValue,
      chairs_in_row: chairsInRowsValue,
      total_chairs: rowsValue * chairsInRowsValue,
      blocked_chairs: blocked,
      price_standart_chair: currentHall?.price_standart_chair,
      price_vip_chair: currentHall?.price_vip_chair,
      is_active: currentHall?.is_active
    }

    const id = currentHall?.id;
    standardArray.forEach((standart) => {
      const numbSeat = parseInt(standart);

      if (Number.isNaN(numbSeat)) {
        throw new Error('Номер места не является числом');
      }

      if (id) {
        const temp: UpdateSeats = {
          hall_id: id,
          seat_number: numbSeat,
          is_vip_chairs: false,
          is_standard_chairs: true
        };
        arraySeatsInHall.push(temp);
      }
    });

    vipArray.forEach((vip) => {
      const numbSeat = parseInt(vip);
      if (Number.isNaN(numbSeat)) {
        throw new Error('Номер места не является числом');
      }
      if (id) {
        const temp: UpdateSeats = {
          hall_id: id,
          seat_number: numbSeat,
          is_vip_chairs: true,
          is_standard_chairs: false
        };
        arraySeatsInHall.push(temp);
      }
    });

    const sortStandardArray = standardArray.slice().sort((a, b) => a.localeCompare(b, undefined, {numeric: true}))
    const sortStandartArr = standartArr.slice().sort((a, b) => a.localeCompare(b, undefined, {numeric: true}));
    const sortVipArr = vipArr.slice().sort((a, b) => a.localeCompare(b, undefined, {numeric: true}));
    const sortVipArray = vipArray.slice().sort((a) => a.localeCompare(a, undefined, {numeric: true}));

    if ((Number(updateHallData.rows) === currentHall?.rows)
      && (Number(updateHallData.chairs_in_row) === currentHall?.chairs_in_row)
      && (updateHallData.blocked_chairs === currentHall?.blocked_chairs)
      && (sortStandardArray.length === sortStandartArr.length && sortStandardArray.every((standart, index) => standart === sortStandartArr[index])
        && sortVipArr.length === sortVipArray.length && sortVipArr.every((vip, index) => vip === sortVipArray[index]))) {
      dispatch(setCompareChairsMessage('Изменений нет, нечего сохранить'));
    } else {
      if (!updateHallData.rows) {
        updateHallData.rows = 0;
      }

      if (!updateHallData.chairs_in_row) {
        updateHallData.chairs_in_row = 0;
      }

      if (updateHallData.rows === 0 || updateHallData.chairs_in_row === 0) {
        if (id) {
          arraySeatsInHall = [{
            hall_id: id,
            seat_number: 0,
            is_vip_chairs: true,
            is_standard_chairs: false
          }];
        }
      }

      dispatch(fetchUpdateHallElem([updateHallData, Number(id)])
      )
        .then((response) => {
          if (!response.payload.message) {
            dispatch(fetchAddSeatElems(arraySeatsInHall));
          } else {
            return;
          }
        })
        .then(() => dispatch(fetchGetHallElems(undefined)));
    }

    dispatch(setIsGetHallAllForChairs(true));
    dispatch(setPropsTitle('Сохранение данных'));
  }

  const handleChangePriceStandart = (e: {
    preventDefault: () => void,
    target: {
      value: string
    }
  }) => {
    e.preventDefault();

    if (!/(^[\d]+$)/.test(e.target.value) && e.target.value.length !== 0) {
      dispatch(setIsNotNumberInputPriceStandart(true));
      dispatch(setErrorMessage('Вводите только цифры'));
    } else {
      dispatch(setPriceStandartValue(e.target.value));
      dispatch(setIsNotNumberInputPriceStandart(false));
      dispatch(setErrorMessage(''));
    }
  }

  const handleClickPriceStandartValue = (e: React.MouseEvent<HTMLInputElement>) => {
    e.preventDefault();
    dispatch(setPriceStandartValue(''));
  }

  const handleChangePriceVip = (e: {
    preventDefault: () => void,
    target: {
      value: string
    }
  }) => {
    e.preventDefault();
    if (!/(^[\d]+$)/.test(e.target.value) && e.target.value.length !== 0) {
      dispatch(setIsNotNumberInputPriceVip(true));
      dispatch(setErrorMessage('Вводите только цифры'));
    } else {
      dispatch(setPriceVipValue(e.target.value));
      dispatch(setIsNotNumberInputPriceVip(false));
      dispatch(setErrorMessage(''));
    }
  }

  const handleClickPriceVipValue = (e: React.MouseEvent<HTMLInputElement>) => {
    e.preventDefault();
    dispatch(setPriceVipValue(''));
  }

  const handleClickCancelPrice = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const idHallForPrice = getIdHallId(e.currentTarget);
    const currentHall = hallsSort.find((item) => item.id === Number(idHallForPrice));
    dispatch(setPriceStandartValue(currentHall?.price_standart_chair));
    dispatch(setPriceVipValue(currentHall?.price_vip_chair));
  }

  const handleOnClickButtonAddFilm = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(setIsUserSelectedAvatarForFilm(false));
    dispatch(setIsVisiblePopupAddFilm(true));
    dispatch(setPropsTitle('Добавление фильма'));
  }

  const handleClickFilmAddSession = (e: React.MouseEvent<HTMLDivElement>, hallName: string) => {
    e.preventDefault();

    const parentCoords = e.currentTarget.getBoundingClientRect();
    const parentSerialized = JSON.parse(JSON.stringify(parentCoords));

    dispatch(setParCoords(parentSerialized));
    dispatch(setTimeStartSession(''));

    if (e.target !== e.currentTarget) {
      return;
    }

    dispatch(setSessionHallName(hallName));
    dispatch(setPropsTitle('Добавление сеанса'));
    dispatch(setIsVisiblePopupAddSession(true));
    dispatch(setDateSessions(dateSessions));
  }

  const handleSubmitSavePrice = (e: React.MouseEvent<HTMLInputElement>) => {
    e.preventDefault();
    const idHallForPrice = getIdHallId(e.currentTarget);
    const currentHall = hallsSort.find((item) => item.id === Number(idHallForPrice));

    if (currentHall) {
      const updateHallData = {
        name: currentHall.name,
        rows: currentHall.rows,
        chairs_in_row: currentHall.chairs_in_row,
        total_chairs: currentHall.rows * currentHall?.chairs_in_row,
        blocked_chairs: currentHall.blocked_chairs,
        number_standard_chairs: currentHall.number_standard_chairs,
        number_vip_chairs: currentHall.number_vip_chairs,
        price_standart_chair: priceStandartValue,
        price_vip_chair: priceVipValue,
        is_active: 0
      }
      const id = currentHall.id;

      if (!updateHallData.price_standart_chair) {
        updateHallData.price_standart_chair = 0;
      }
      if (!updateHallData.price_vip_chair) {
        updateHallData.price_vip_chair = 0;
      }
      if (updateHallData.price_standart_chair === currentHall.price_standart_chair && updateHallData.price_vip_chair === currentHall.price_vip_chair) {
        dispatch(setComparePriceMessage('Изменений нет. Нечего сохранить'));
      } else {
        dispatch(fetchUpdateHallElem([updateHallData, Number(id)])).then(() => dispatch(fetchGetHallElems(undefined)));
      }
    }
    dispatch(setIsGetHallAllForPrice(true));
    dispatch(setPropsTitle('Добавление данных'));
  }

  const handleClickFilmSession = (e: React.MouseEvent<HTMLDivElement>, id: number) => {

    const filmTarget = e.currentTarget.querySelector('.conf-step__seances-movie-title');
    const filmTargetName = filmTarget?.textContent;

    dispatch(setPropsTitle('Снятие с сеанса'));
    dispatch(setFilmDeleteName(filmTargetName));
    dispatch(setIsVisiblePopupDeleteSession(true));
    dispatch(setSessionId(id));
  }

  const handleClickFilm = (e: React.MouseEvent<HTMLDivElement>, title: string, id: number | string) => {

    dispatch(setIsVisiblePopupDeleteFilm(true));
    dispatch(setPropsTitle('Удаление фильма'));
    dispatch(setIsNoneDeleteFilmServer(false));
    dispatch(setFilmNameForDelete(title));
    dispatch(setIdFilmForDelete(id));
  }

  const handleClickCancelFull = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    dispatch(setIsSuccessfulGetAllFilms(false));
    dispatch(setIsSuccessfulGetAllSessions(false));
    dispatch(setIsErroneousAllFilms(false));
    dispatch(setIsErroneousAllSession(false));

    const filmsLocal = localStorage.getItem('adminInputData');
    const sessionsLocal = localStorage.getItem('adminInputSessions');

    if (filmsLocal || sessionsLocal) {
      localStorage.removeItem('adminInputData');
      localStorage.removeItem('adminInputSessions');
      dispatch(setIsDeletedFilmsAndSessions(true));
      dispatch(setPropsTitle('Удаление данных'));
      dispatch(fetchGetFilmsElems(undefined)).then(() => dispatch(fetchGetSessionElems({
        date: dateSessions,
        signal: undefined
      })));
    } else {
      dispatch(setMessageNotRemoveFilmsAndSessions('Нет данных для удаления'));
      dispatch(setIsDeletedFilmsAndSessions(true));
      dispatch(setPropsTitle('Удаление данных'));
    }
  }

  const onSubmitSaveFull = (e: React.MouseEvent<HTMLInputElement>) => {
    e.preventDefault();
    dispatch(setIsNoneDeleteFilmServer(false));

    let filmForAdd = {}
    const arrFilmForAdd: {}[] = [];

    if (films.length === 0) {
      filmForRender.forEach((film) => {
        filmForAdd = {
          title: film.title,
          movie_duration: film.movie_duration,
          image: film.image,
          description: film.description,
          country_of_origin: film.country_of_origin
        }
        arrFilmForAdd.push(filmForAdd);
      });
    } else {
      const filmsForSave = filmForRender.filter((film) => film.hasOwnProperty('isAddedAdmin'));
      filmsForSave.forEach((film) => {
        filmForAdd = {
          title: film.title,
          movie_duration: film.movie_duration,
          image: film.image,
          description: film.description,
          country_of_origin: film.country_of_origin
        }
        arrFilmForAdd.push(filmForAdd);
      });
    }

    if (arrFilmForAdd.length > 0) {
      arrFilmForAdd.forEach((filmForAdd) => {
        dispatch(fetchPostFilmElem(filmForAdd)).then(() => dispatch(fetchGetFilmsElems(undefined)));
      })
    }

    let sessionForAdd = {};
    const arrsessionForAdd: {}[] = [];

    if (copySession.length === 0) {
      sessionForRender.forEach((sessionRender) => {
        sessionForAdd = {
          hall_id: sessionRender.hall_id,
          film_id: sessionRender.film_id,
          session_start_time: sessionRender.session_start_time,
          session_date: sessionRender.dateSession
        }
        arrsessionForAdd.push(sessionForAdd);
      });
    } else {
      const sessionsForSave = sessionForRender.filter((session) => session.hasOwnProperty('isAddedAdmin'));

      sessionsForSave.forEach((session) => {
        sessionForAdd = {
          hall_id: session.hall_id,
          film_id: session.film_id,
          session_start_time: session.session_start_time,
          session_date: session.dateSession
        }
        arrsessionForAdd.push(sessionForAdd);
      });
    }

    if (arrsessionForAdd.length > 0) {
      arrsessionForAdd.forEach((sessionForAdd) => {
        dispatch(fetchPostSessionElem(sessionForAdd)).then(() => dispatch(fetchGetSessionElems({
          date: dateSessions,
          signal: undefined
        })));
      })
    }

    dispatch(setIsAddedFilmsAndSessions(true));
    dispatch(setPropsTitle('Сохранение данных'));
  }

  const handleClickTicketSales = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(setIsErroneousUpdateHall(false));

    const updateHallData = {
      name: halls[0].name,
      rows: halls[0].rows,
      chairs_in_row: halls[0].chairs_in_row,
      total_chairs: halls[0].rows * halls[0].chairs_in_row,
      blocked_chairs: halls[0].blocked_chairs,
      price_standart_chair: halls[0].price_standart_chair,
      price_vip_chair: halls[0].price_vip_chair,
      is_active: 0
    }

    if ((hallsSort.length === 0 || films.length === 0 || sessionForRender.length === 0) || (films.every((film) => film.hasOwnProperty('isAddedAdmin'))) || sessionForRender.every((ses) => ses.hasOwnProperty('isAddedAdmin'))
      || hallsSort.some((hall) => !hall.total_chairs) || hallsSort.some((hall) => !hall.price_standart_chair) || hallsSort.some((hall) => !hall.price_vip_chair)) {
      if (e.currentTarget.innerHTML === 'Приостановить продажу билетов') {
        updateHallData['is_active'] = 0;
        dispatch(fetchUpdateHallElem([updateHallData, halls[0].id])).then(() => dispatch(fetchGetHallElems(undefined)));
      } else if (e.currentTarget.innerHTML === 'Открыть продажу билетов') {
        dispatch(setIsActive(true));
        dispatch(setErrorMessage('Открытие продажи билетов невозможно. Проверьте наличие залов, фильмов, сеансов, мест в залах и цен.'));
        updateHallData['is_active'] = 0;
        if (halls[0].id !== 0) {
          dispatch(fetchUpdateHallElem([updateHallData, halls[0].id])).then(() => dispatch(fetchGetHallElems(undefined)));
        }

        return;
      }
    } else {
      if (e.currentTarget.innerHTML === 'Приостановить продажу билетов') {
        updateHallData['is_active'] = 0;
        dispatch(fetchUpdateHallElem([updateHallData, halls[0].id])).then(() => dispatch(fetchGetHallElems(undefined)));
      } else if (e.currentTarget.innerHTML === 'Открыть продажу билетов') {
        updateHallData['is_active'] = 1;
        dispatch(fetchUpdateHallElem([updateHallData, halls[0].id])).then(() => dispatch(fetchGetHallElems(undefined)));
      }
    }
  }

  const getSelectedDay = (date: string) => {
    dateSessions = date;
  }

  return (
    <>
      <NavigationDate getSelectedDay={getSelectedDay} queryUser="admin"/>
      <section className="conf-step">
        <HeaderConf title={"Управление залами"}>
          <div className="conf-step__wrapper">
            <p className="conf-step__paragraph">Доступные залы:</p>

            {isLoadingHallAll || errorMessageGetHalls === 'The user aborted a request.' ?
              <div className={"style-info"}><p>Идет загрузка залов. Пожалуйста, подождите.</p></div> :

              (isErroneousAllHall && errorMessageGetHalls !== 'The user aborted a request.') ? <HandleFetchError/> :

                ((hallsSort[0]?.id === 0) || (hallsSort.length === 0)) ?
                  <div><p>Залов нет. Создайте зал</p></div> :
                  <ul className="conf-step__list">
                    {
                      hallsSort.map((item) => {
                        return (
                          <li key={item.id} id={String(item.id)}>
                            {item.name + " "}
                            <button className="conf-step__button conf-step__button-trash"
                                    onClick={(e) => handleDeleteHall(e)}/>
                          </li>
                        )
                      })
                    }
                  </ul>
            }

            <button className="conf-step__button conf-step__button-accent" onClick={() => handleCreateHall()}>Создать
              зал
            </button>
          </div>
        </HeaderConf>
      </section>

      <section className="conf-step">
        <HeaderConf title={"Конфигурация залов:"}>
          <div className="conf-step__wrapper">
            <p className="conf-step__paragraph">Выберите зал для конфигурации:</p>

            {isLoadingHallAll || errorMessageGetHalls === 'The user aborted a request.' ?
              <div className={"style-info"}><p>Идет загрузка залов. Пожалуйста, подождите.</p></div> :
              (isErroneousAllHall && errorMessageGetHalls !== 'The user aborted a request.') ? <HandleFetchError/> :
                hallsSort[0].id === 0 || hallsSort.length === 0 ? <div><p>Залов нет. Создайте зал</p></div> :
                  <ul className="conf-step__selectors-box">
                    {
                      hallsSort.map((hall, i) => {
                        return (
                          <li key={hall.id}>
                            <input
                              type="radio"
                              className="conf-step__radio"
                              name="chairs-hall"
                              value={hall.name}
                              onChange={(e) => {
                                choiceHallForConf(e, i, hall)
                              }}
                              data-i={i}
                              data-id={String(hall.id)}
                              checked={hall.id === indexHall}
                            />
                            <span className="conf-step__selector">{hall.name}</span>
                          </li>
                        )
                      })
                    }
                  </ul>
            }
            {
              (hallsSort.length === 0 || hallsSort[0].id === 0) ? null :
                <>
                  <p className="conf-step__paragraph">Укажите количество рядов и максимальное количество кресел в
                    ряду:
                  </p>
                  <div className="conf-step__legend">
                    <label className="conf-step__label">Рядов, шт
                      <input
                        type="text"
                        className="conf-step__input"
                        placeholder="0"
                        value={rowsValue}
                        name="rows"
                        onChange={(e) => handleRowsValue(e)}
                        onClick={() => handleClickRowsValue()}
                      />
                    </label>
                    <span className="multiplier">x</span>
                    <label className="conf-step__label">Мест, шт
                      <input
                        type="text"
                        className="conf-step__input"
                        placeholder="0"
                        value={chairsInRowsValue}
                        name="chairs_in_rows"
                        onChange={(e) => handleChairsInRowsValue(e)}
                        onClick={() => handleClickChairsValue()}
                      />
                    </label>
                  </div>
                  {isNotNumberInputRowsInHall && <Tooltip text={errorMessageTooltip} styleEl={styleError}/>}
                  {isNotNumberInputChairsInRowsInHall && <Tooltip text={errorMessageTooltip} styleEl={styleError}/>}

                  <p className="conf-step__paragraph">Теперь вы можете указать типы кресел на схеме зала:</p>
                  <div className="conf-step__legend">
                    <span className="conf-step__chair conf-step__chair_standart"></span> — обычные кресла
                    <span className="conf-step__chair conf-step__chair_vip"></span> — VIP кресла
                    <span className="conf-step__chair conf-step__chair_disabled"></span> — заблокированные (нет кресла)
                    <p className="conf-step__hint">Чтобы изменить вид кресла, нажмите по нему левой кнопкой мыши</p>
                  </div>

                  <div className="conf-step__hall">
                    <div className="conf-step__hall-wrapper">
                      {
                        getChairChunk(getStatusChairsPlace(rowsValue, chairsInRowsValue, standartArr, vipArr, blockedArr), chairsInRowsValue)
                          .map((item) => {
                            return (
                              <div className="conf-step__row" key={uuidv4()}>
                                {item}
                              </div>
                            )
                          })
                      }
                    </div>
                  </div>

                  <fieldset className="conf-step__buttons text-center">
                    <button className="conf-step__button conf-step__button-regular"
                            onClick={(e) => handleClickCancelConfHall(e)}>Отмена
                    </button>
                    <input type="submit" value="Сохранить" className="conf-step__button conf-step__button-accent"
                           onClick={(e) => handleClickSaveChairs(e)}/>
                  </fieldset>
                </>
            }
          </div>
        </HeaderConf>
      </section>

      <section className="conf-step">
        <HeaderConf title={"Конфигурация цен:"}/>
        <div className="conf-step__wrapper">
          <p className="conf-step__paragraph">Выберите зал для конфигурации:</p>

          {isLoadingHallAll || errorMessageGetHalls === 'The user aborted a request.' ?
            <div className={"style-info"}><p>Идет загрузка залов. Пожалуйста, подождите.</p></div> :
            (isErroneousAllHall && errorMessageGetHalls !== 'The user aborted a request.') ? <HandleFetchError/> :
              hallsSort[0].id === 0 ? <div><p>Залов нет. Создайте зал</p></div> :
                <ul className="conf-step__selectors-box">
                  {
                    hallsSort[0].id !== 0 && hallsSort.map((hall, i) => {
                      return (
                        <li key={hall.id}>
                          <input
                            type="radio"
                            className="conf-step__radio"
                            name="prices-hall"
                            value={hall.name}
                            onChange={(e) => {
                              choiceHallForPrice(e, i, hall)
                            }}
                            data-i={i}
                            checked={i === Number(localStorage.getItem("indexHallPrice"))}
                            id={String(hall.id)}
                          />
                          <span className="conf-step__selector">{hall.name}</span>
                        </li>
                      )
                    })
                  }
                </ul>
          }

          {(hallsSort.length === 0 || hallsSort[0].id === 0) ? null : <>
            <p className="conf-step__paragraph">Установите цены для типов кресел:</p>
            <div className="conf-step__legend">
              <label className="conf-step__label">Цена, рублей
                <input
                  id={uuidv4()}
                  type="text"
                  className="conf-step__input"
                  placeholder="0"
                  value={priceStandartValue}
                  onChange={(e) => handleChangePriceStandart(e)}
                  onClick={(e: React.MouseEvent<HTMLInputElement>) => handleClickPriceStandartValue(e)}
                /></label>
              за <span className="conf-step__chair conf-step__chair_standart"></span> обычные кресла
            </div>
            <div className="conf-step__legend">
              <label className="conf-step__label">Цена, рублей
                <input
                  id={uuidv4()}
                  type="text"
                  className="conf-step__input"
                  placeholder="0"
                  value={priceVipValue}
                  onChange={(e) => handleChangePriceVip(e)}
                  onClick={(e: React.MouseEvent<HTMLInputElement>) => handleClickPriceVipValue(e)}
                /></label>
              за <span className="conf-step__chair conf-step__chair_vip"></span> VIP кресла
            </div>
            {isNotNumberInputPriceStandart && <Tooltip text={errorMessageTooltip} styleEl={styleError}/>}
            {isNotNumberInputPriceVip && <Tooltip text={errorMessageTooltip} styleEl={styleError}/>}

            <fieldset className="conf-step__buttons text-center">
              <button
                className="conf-step__button conf-step__button-regular"
                onClick={(e) => handleClickCancelPrice(e)}>Отмена
              </button>
              <input
                type="submit"
                value="Сохранить"
                className="conf-step__button conf-step__button-accent"
                onClick={(e) => handleSubmitSavePrice(e)}/>
            </fieldset>
          </>
          }
        </div>
      </section>

      <section className="conf-step">
        <HeaderConf title={"Сетка сеансов"}/>
        <div className="conf-step__wrapper">
          <p className="conf-step__paragraph">
            <button className="conf-step__button conf-step__button-accent"
                    onClick={(e) => handleOnClickButtonAddFilm(e)}>Добавить фильм
            </button>
          </p>

          {isLoadingGetFilms ?
            <div className={"style-info"}><p>Идет загрузка фильмов. Пожалуйста, подождите</p></div> :

            (isErroneousAllFilms && errorMessageGetFilms !== 'The user aborted a request.') ? <HandleFetchError/> :
              filmForRender.length === 0 ? <div><p>Фильмов нет</p></div> :
                <div className="conf-step__movies" ref={filmsNew}>
                  {

                    filmForRender.map((film) => {
                      return (
                        <div
                          key={uuidv4()}
                          style={{opacity: typeof film.id === "string" ? 0.6 : 1}}
                          className="conf-step__movie"
                          onClick={(e) => handleClickFilm(e, film.title, film.id)}
                        >
                          <img className="conf-step__movie-poster" alt="poster" src={film.image}/>
                          <h3 className="conf-step__movie-title">{film.title}</h3>
                          <p className="conf-step__movie-duration">{film.movie_duration} минут</p>
                        </div>
                      )
                    })
                  }
                </div>
          }
          {isLoadingSession ? <div className={"style-info"}><p>Идет загрузка сессий. Пожалуйста, подождите</p></div> :
            (isErroneousAllSession && errorMessageGetSessions !== 'The user aborted a request.') ? <HandleFetchError/> :
              <div className="conf-step__seances">
                {
                  (hallsSort[0]?.id === 0 || hallsSort.length === 0) ?
                    <div><p>Сеансов нет</p></div> : hallsSort.map((hall) => {
                        const hallSessions = sessionForRender.filter((item) => item.hall_id === hall.id);

                        return (
                          <div className="conf-step__seances-hall" data-id={hall.id} key={hall.id}>
                            <h3 className="conf-step__seances-title">{hall.name}</h3>
                            <div
                              className="conf-step__seances-timeline"
                              onClick={(e) => handleClickFilmAddSession(e, hall.name)}
                            >
                              {
                                hallSessions.length === 0 ? null :
                                  hallSessions.sort((a, b) => a['session_start_time'] > b['session_start_time'] ? 1 : -1)
                                    .map((session) => {

                                      const film = filmForRender.find((film) => film.id === session.film_id);
                                      const startSession = getIndent(session.session_start_time) / 2;
                                      let endSession = 0;

                                      if (film) {
                                        endSession = startSession + (film?.movie_duration / 2);
                                      }

                                      addSessionData({
                                        hall: session.hall_id,
                                        start: startSession,
                                        end: endSession
                                      });

                                      let backgroundSession: {
                                        title: string,
                                        backgroundColor: string
                                      } | undefined = backgroundsFilms?.find((filmColor) => filmColor.title === film?.title);

                                      return (
                                        <div
                                          className="conf-step__seances-movie"
                                          style={{
                                            width: film?.movie_duration && film?.movie_duration / 2 + "px",
                                            backgroundColor: backgroundSession ? backgroundSession?.backgroundColor : '#FFEB85',
                                            left: startSession,
                                            opacity: typeof session.id === "string" ? 0.4 : 1
                                          }}
                                          title={film?.title}
                                          key={session.id ? session.id : uuidv4()}
                                          onClick={(e) => handleClickFilmSession(e, +session.id)}>
                                          <p className="conf-step__seances-movie-title">{film?.title}</p>
                                          <p className="conf-step__seances-movie-start">{session.session_start_time}</p>
                                        </div>
                                      )
                                    })
                              }
                            </div>
                          </div>
                        )
                      }
                    )
                }
              </div>
          }
          <fieldset className="conf-step__buttons text-center">
            <button
              className="conf-step__button conf-step__button-regular"
              onClick={(e) => handleClickCancelFull(e)}
              title={"Удаление предварительных данных"}>Отмена
            </button>
            <input
              type="submit"
              value="Сохранить"
              className="conf-step__button conf-step__button-accent"
              onClick={(e) => onSubmitSaveFull(e)}
            />
          </fieldset>
        </div>
      </section>

      <section className="conf-step">
        <HeaderConf title={"Открыть продажи"}/>
        <div className="conf-step__wrapper text-center"><p className="conf-step__paragraph">Всё готово, теперь
          можно:</p>
          <button
            className="conf-step__button conf-step__button-accent"
            onClick={(e) => handleClickTicketSales(e)}
          >{isActiveSale ? "Приостановить продажу билетов" : "Открыть продажу билетов"}
          </button>
          {isLoadingUpdateHall &&
            <div className={"style-info"}><p>Информация отправляется, пожалуйста, подождите</p></div>}
          {isErroneousUpdateHall && <HandleFetchError/>}
          {isTooltipActive && <Tooltip text={tooltipErrorMessage} styleEl={styleError}/>}
        </div>
      </section>
    </>
  )
}

export default HallAll;
