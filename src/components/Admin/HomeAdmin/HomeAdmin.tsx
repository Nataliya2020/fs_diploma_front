import * as React from 'react';
import HallAll from '../HallAll/HallAll';
import Header from '../Header/Header';
import '../../../admin.css';
import '../../../normolizeAdmin.css';
import Popup from '../Popup/Popup';
import {useAppDispatch, useAppSelector} from '../../../app/hooks';
import {
  fetchDeleteHallElem, setIsErroneousDeleteHall,
  setISuccessfulDeleteHall
} from '../../../store/slices/slicesAdmin/hallDeleteReducer';
import {
  fetchGetHallElems,
  HallElem, setIsSuccessfulAllHall, setIsErroneousAllHall
} from '../../../store/slices/slicesAdmin/hallAllReducer';
import {
  setDeleteFilm,
  setIsErrorAddFilm,
  setIsErrorFilmName,
  setIsSuccessfulGetAllFilms
} from '../../../store/slices/slicesAdmin/filmAllReducer';
import {
  fetchPOSTHallElem,
  setHallName,
  setIsVisiblePopupDeleteHall,
  setIsVisiblePopupAddHall, setIsSuccessfulAddHall, setIsErroneousAddHall
} from '../../../store/slices/slicesAdmin/hallAddReducer';
import {
  setFilmCountryOrigin, setFilmDescription,
  setFilmDuration, setIsVisiblePopupAddFilm,
  setFilmName, setImageFilm,
  setIsErroneousFilm, setIsSuccessfulAddFilms
} from '../../../store/slices/slicesAdmin/filmAddReducer';
import {v4 as uuidv4} from 'uuid';
import {ChangeEvent, useEffect} from 'react';
import {
  setIsBusySession,
  setIsErroneousAddSession,
  setIsSuccessfulAddSessions, setIsTimelineCrowded,
  setSessionFilmName,
  setSessionHallName,
  setTimeStartSession,
  setIsVisiblePopupAddSession
} from '../../../store/slices/slicesAdmin/sessionAddReducer';
import getIndent from '../../../app/utils/getIndent';
import {
  fetchDeleteSessionElem, setFilmDeleteName, setIsErroneousDeleteSession,
  setIsSuccessfulDeleteSession, setIsVisiblePopupDeleteSession
} from '../../../store/slices/slicesAdmin/sessionDeleteReducer';
import {Films} from '../../../store/slices/slicesAdmin/hallAllReducer';
import {
  fetchDeleteFilmElem,
  setIsErroneousDeleteFilm,
  setIsSuccessfulDeleteFilm,
  setIsVisiblePopupDeleteFilm,
} from '../../../store/slices/slicesAdmin/filmDeleteReducer';
import {
  fetchGetSessionElems,
  setIsSuccessfulGetAllSessions
} from '../../../store/slices/slicesAdmin/sessionsAllReducerAdmin';
import {fetchGetFilmsElems} from '../../../store/slices/slicesAdmin/filmAllReducer';
import homeAdminCss from './HomeAdmin.module.css';
import {setErrorMessage} from '../../../store/slices/tooltipReducer';
import Tooltip from '../../Tooltip/Tooltip';
import {
  setIsBusyFilmName, setIsBusyNameHall,
  setIsEmptyFilmDesc,
  setIsEmptyFilmDuration,
  setIsEmptyFilmName, setIsEmptyFilmOrigin, setIsEmptyStartSession, setIsFilmAvatarFileLoad,
  setIsFilmDurationNotNumbers, setIsHallNameEmpty, setIsUserSelectedAvatarForFilm
} from '../../../store/slices/validationFormReducer';
import {
  setAddedFilmMessage,
  setDeletedFilmMessage,
  setIsFilmAdded,
  setIsFimDeleted,
  setIsSessionAdded,
  setAddedSessionMessage,
  setIsAddedFilmsAndSessions,
  setDeletedSessionMessage,
  setIsSessionDeleted,
  setIsDeletedFilmsAndSessions,
  setIsGetHallAllForChairs,
  setIsGetHallAllForPrice,
  setIsAddHallPopup,
  setIsDeleteHallPopup,
  setPropsTitle
} from '../../../store/slices/infoFinalActionCrud';
import {setIsErroneousUpdateHall, setIsSuccessfulUpdateHall} from '../../../store/slices/slicesAdmin/hallUpdateReducer';
import {setIsErroneousAddSeats, setIsSuccessfulAddSeats} from '../../../store/slices/slicesAdmin/seatAddReducerAdmin';
import {setCompareChairsMessage, setComparePriceMessage} from '../../../store/slices/infoReducer';
import {styleError} from '../../../app/stylesForInfo/stylesForInfo';
import {
  SaveAdminInputData,
  AddSessionData,
  SaveAdminInputSessions,
  Session
} from '../../../app/types/types';

function HomeAdmin() {
  const dispatch = useAppDispatch();
  const isVisibleModalAddHall = useAppSelector(state => state.hallAdd.isVisiblePopupAddHall);
  const isLoadingHallAdd = useAppSelector(state => state.hallAdd.isLoading);
  const isloadingHallDelete = useAppSelector(state => state.deleteHall.isLoading);
  const halls = useAppSelector((state) => state.hallsAll.hallElems);
  const films = useAppSelector((state) => state.filmsAll.filmElems);
  const hallName = useAppSelector(state => state.hallAdd.hallName);
  const isVisibleModalDeleteHall = useAppSelector(state => state.hallAdd.isVisiblePopupDeleteHall);
  const idForDeleteHall = useAppSelector(state => state.deleteHall.idForDeletHall);
  const isVisibleModalAddFilm = useAppSelector(state => state.addFilm.isVisiblePopupAddFilm);
  const filmDurationValue = useAppSelector(state => state.addFilm.filmDuration);
  const filmNameValue = useAppSelector(state => state.addFilm.filmName);
  const filmDescriptionValue = useAppSelector(state => state.addFilm.filmDescription);
  const filmCountryOriginValue = useAppSelector(state => state.addFilm.filmCountryOfOrigin);
  const imageFilm = useAppSelector(state => state.addFilm.imageFilm);
  const copyFilmForRender = useAppSelector(state => state.filmsAll.copyFilmsForRender);
  const isVisibleAddSession = useAppSelector(state => state.addSession.isVisiblePopupAddSession);
  const isBusySession = useAppSelector(state => state.addSession.isBusySession);
  const sessionHallName = useAppSelector(state => state.addSession.sessionHallName);
  const sessionFilmNameValue = useAppSelector(state => state.addSession.sessionFilmName);
  const startSessionValue = useAppSelector(state => state.addSession.timeStartSession);
  const isVisibleDeleteSession = useAppSelector(state => state.deleteSession.isVisiblePopupDeleteSession);
  const copySessionForRender = useAppSelector(state => state.sessionAllAdmin.sessionsElems);
  const sessionId = useAppSelector(state => state.deleteSession.sessionId);
  const filmNameSessionDelete = useAppSelector(state => state.deleteSession.sessionFilmDeleteName);
  const isVisibleModalDeleteFilm = useAppSelector(state => state.deleteFilm.isVisiblePopupDeleteFilm);
  const idFilmForDelete = useAppSelector(state => state.deleteFilm.idFilmForDelete);
  const filmNameForDelete = useAppSelector(state => state.deleteFilm.filmNameForDelete);
  const errorMessageTooltip = useAppSelector(state => state.tooltip.errorMessage);
  const isFilmDurationNotNumbers = useAppSelector(state => state.validationForm.isFilmDurationNotNumbers);
  const isEmptyFilmName = useAppSelector(state => state.validationForm.isEmptyFilmName);
  const isEmptyFilmDesc = useAppSelector(state => state.validationForm.isEmptyFilmDesc);
  const isEmptyFilmOrigin = useAppSelector(state => state.validationForm.isEmptyFilmOrigin);
  const isEmptyFilmDuration = useAppSelector(state => state.validationForm.isEmptyFilmDuration);
  const isBusyFilmName = useAppSelector(state => state.validationForm.isBusyFilmName);
  const isUserSelectedAvatarForFilm = useAppSelector(state => state.validationForm.isUserSelectedAvatarForFilm);
  const isFilmAvatarFileLoad = useAppSelector(state => state.validationForm.isFilmAvatarFileLoad);
  const isHallNameEmpty = useAppSelector(state => state.validationForm.isHallNameEmpty);
  const isBusyNameHall = useAppSelector(state => state.validationForm.isBusyNameHall);
  const isFilmAdded = useAppSelector(state => state.infoFinalCrud.isFilmAdded);
  const isFimDeleted = useAppSelector(state => state.infoFinalCrud.isFimDeleted);
  let deletedFilmMessage = useAppSelector(state => state.infoFinalCrud.deletedFilmMessage);
  const addedFilmMessage = useAppSelector(state => state.infoFinalCrud.addedFilmMessage);
  const hallsSort: HallElem[] = [...halls];
  const isLoadingAddFilm = useAppSelector(state => state.addFilm.isLoading);
  const isLoadingDeleteFilm = useAppSelector(state => state.deleteFilm.isLoading);
  const isSessionAdded = useAppSelector(state => state.infoFinalCrud.isSessionAdded);
  const addedSessionMessage = useAppSelector(state => state.infoFinalCrud.addedSessionMessage);
  const isLoadingSessionAdd = useAppSelector(state => state.addSession.isLoading);
  const isAddedFilmsAndSessions = useAppSelector(state => state.infoFinalCrud.isAddedFilmsAndSessions);
  const isSuccessfulAddFilms = useAppSelector(state => state.addFilm.isSuccessfulAddFilms);
  const isErroneousFilm = useAppSelector(state => state.addFilm.isErroneousFilm);
  const isSuccessfulAddSessions = useAppSelector(state => state.addSession.isSuccessfulAddSessions);
  const isErroneousSession = useAppSelector(state => state.addSession.isErroneousAddSession);
  const isSuccessfulDeleteFilm = useAppSelector(state => state.deleteFilm.isSuccessfulDeleteFilm);
  const isErroneousDeleteFilm = useAppSelector(state => state.deleteFilm.isErroneousDeleteFilm);
  const isSessionDeleted = useAppSelector(state => state.infoFinalCrud.isSessionDeleted);
  const deletedSessionMessage = useAppSelector(state => state.infoFinalCrud.deletedSessionMessage);
  const isSuccessfulDeleteSession = useAppSelector(state => state.deleteSession.isSuccessfulDeleteSession);
  const isErroneousDeleteSession = useAppSelector(state => state.deleteSession.isErroneousDeleteSession);
  const isLoadingSessionDelete = useAppSelector(state => state.deleteSession.isLoading);
  const isDeletedFilmsAndSessions = useAppSelector(state => state.infoFinalCrud.isDeletedFilmsAndSessions);
  const isLoadingFilmsAll = useAppSelector(state => state.filmsAll.isLoading);
  const isLoadingSessionsAll = useAppSelector(state => state.sessionAllAdmin.isLoading);
  const isSuccessfulGetAllFilms = useAppSelector(state => state.filmsAll.isSuccessfulGetAllFilms);
  const isSuccessfulGetAllSessions = useAppSelector(state => state.sessionAllAdmin.isSuccessfulGetAllSessions);
  const isLoadingAllHall = useAppSelector(state => state.hallsAll.isLoading);
  const isGetHallAllForChairs = useAppSelector(state => state.infoFinalCrud.isGetHallAllForChairs);
  const isLoadingUpdateHall = useAppSelector(state => state.updateHall.isLoading);
  const isLoadingSeatsAdd = useAppSelector(state => state.seatsAdd.isLoading);
  const isSuccessfulAddSeats = useAppSelector(state => state.seatsAdd.isSuccessfulAddSeats);
  const isErroneousAddSeats = useAppSelector(state => state.seatsAdd.isErroneousAddSeats);
  const isSuccessfulUpdateHall = useAppSelector(state => state.updateHall.isSuccessfulUpdateHall);
  const isErroneousUpdateHall = useAppSelector(state => state.updateHall.isErroneousUpdateHall);
  const isSuccessfulAllHall = useAppSelector(state => state.hallsAll.isSuccessfulAllHall);
  const isErroneousAllHall = useAppSelector(state => state.hallsAll.isErroneousAllHall);
  const compareChairsMessage = useAppSelector(state => state.infoReducer.compareChairsMessage);
  const isGetHallAllForPrice = useAppSelector(state => state.infoFinalCrud.isGetHallAllForPrice);
  const comparePriceMessage = useAppSelector(state => state.infoReducer.comparePriceMessage);
  const isErroneousAllFilms = useAppSelector(state => state.filmsAll.isErroneousAllFilms);
  const isErroneousAllSession = useAppSelector(state => state.sessionAllAdmin.isErroneousAllSession);
  const messageNotRemoveFilmsAndSessions = useAppSelector(state => state.infoReducer.messageNotRemoveFilmsAndSessions);
  const isAddHallPopup = useAppSelector(state => state.infoFinalCrud.isAddHallPopup);
  const isSuccessfulAddHall = useAppSelector(state => state.hallAdd.isSuccessfulAddHall);
  const isErroneousAddHall = useAppSelector(state => state.hallAdd.isErroneousAddHall);
  const IsDeleteHallPopup = useAppSelector(state => state.infoFinalCrud.isDeleteHallPopup);
  const isSuccessfulDeleteHall = useAppSelector(state => state.deleteHall.isSuccessfulDeleteHall);
  const isErroneousDeleteHall = useAppSelector(state => state.deleteHall.isErroneousDeleteHall);
  const isEmptyStartSession = useAppSelector(state => state.validationForm.isEmptyStartSession);
  const parCoords = useAppSelector(state => state.addSession.parCoords);
  const isTimelineCrowded = useAppSelector(state => state.addSession.isTimelineCrowded);
  const dateSessions = useAppSelector(state => state.addSession.session_date);
  let currentDate = '';
  const selectedDayLocalSt = localStorage.getItem('selectedDay');
  let selectedDay: { dayNumber: string, dayName: string, dayDate: string } = {dayNumber: '', dayName: '', dayDate: ''};

  const controller = new AbortController();
  const signal = controller.signal;

  if (selectedDayLocalSt) {
    try {
      selectedDay = JSON.parse(selectedDayLocalSt);
      currentDate = selectedDay.dayDate;
    } catch {
      throw new Error('Ошибка при извлечении данных');
    }
  }

  let arrayPeriodSessionData: {
    hall: number,
    start: number,
    end: number
  }[] = [];

  hallsSort.sort((a, b) =>
    a.name > b.name ? 1 : -1);

  const optionsHalls = hallsSort.map((hall) => {
    return (
      <option key={hall.id} id={String(hall.id)}>{hall.name}</option>
    )
  });

  const optionsFilms = films.map((film) => {
    return (
      <option key={film.id} id={String(film.id)}>{film.title}</option>
    )
  })

  useEffect(() => {
    document.body.classList.add(`${homeAdminCss.bodyAd}`)

    return () => {
      document.body.classList.remove(`${homeAdminCss.bodyAd}`)
    }
  }, []);

  const handleSubmitHallAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!hallName) {
      dispatch(setIsHallNameEmpty(true));
      dispatch(setErrorMessage('Заполните имя зала'));
      return;
    }

    if (halls.length > 0) {
      if (halls.some((hall) => hall.name.toLocaleLowerCase() === (hallName.toLocaleLowerCase()))) {
        dispatch(setIsBusyNameHall(true));
        dispatch(setErrorMessage('Такой зал уже существует. Уточните название зала'));
        return;
      }
    }

    dispatch(setIsVisiblePopupAddHall(false));
    dispatch(setIsAddHallPopup(true));
    dispatch(setPropsTitle('Добавление зала'));

    dispatch(fetchPOSTHallElem({
      name: hallName,
      rows: 0,
      chairs_in_row: 0,
      total_chairs: 0,
      blocked_chairs: '.',
      paid_chairs: '.',
      is_active: 0
    })).then(() => dispatch(fetchGetHallElems(undefined)));
  }

  const handleChangeHallAdd = (e: {
    target: {
      value: string
    }
  }) => {
    dispatch(setHallName(e.target.value));
  }

  const handleClickHallAdd = (e: {
    preventDefault: () => void;
  }) => {
    e.preventDefault();
    dispatch(setHallName(''));
  }

  const handleCancelHallAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(setIsBusyNameHall(false));
    dispatch(setIsVisiblePopupAddHall(false));
  }

  const handleCancelDeleteHall = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(setIsVisiblePopupDeleteHall(false));
  }

  const handleSubmitHallDelete = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    dispatch(setIsVisiblePopupDeleteHall(false));
    dispatch(setIsDeleteHallPopup(true));
    dispatch(setPropsTitle('Удаление зала'));

    dispatch(fetchDeleteHallElem(Number(idForDeleteHall))).then(() => dispatch(fetchGetHallElems(undefined)));
  }
  const handleSubmitAddFilm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!filmNameValue) {
      dispatch(setIsEmptyFilmName(true));
      dispatch(setErrorMessage('Заполните поле название фильма'));
      return;
    }

    const isNoneUnicNameFilm = copyFilmForRender.some((film) => (film.title === filmNameValue) || (film.title + ' ' === filmNameValue) || film.title === filmNameValue + ' ');
    let isNoneUnicNameFilmLocalStorage = false;
    const localStorageAdminInputData = localStorage.getItem('adminInputData');

    if (localStorageAdminInputData) {
      try {
        isNoneUnicNameFilmLocalStorage = localStorageAdminInputData && JSON.parse(localStorageAdminInputData)?.some((film: Films) => (film.title === filmNameValue) || (film.title + ' ' === filmNameValue) || (film.title === filmNameValue + ' '));
      } catch (e) {
        throw new Error('Ошибка при извлечении данных');
      }
    }
    if (isNoneUnicNameFilm || isNoneUnicNameFilmLocalStorage) {
      dispatch(setIsBusyFilmName(true));
      dispatch(setErrorMessage('Такой фильм уже добавлен. Уточните название фильма'));
      return;
    }

    if (!filmDescriptionValue) {
      dispatch(setIsEmptyFilmDesc(true));
      dispatch(setErrorMessage('Заполните поле описание фильма'));
      return;
    }

    if (!filmCountryOriginValue) {
      dispatch(setIsEmptyFilmOrigin(true));
      dispatch(setErrorMessage('Заполните поле страна-производитель фильма'));
      return;
    }

    if (!filmDurationValue) {
      dispatch(setIsEmptyFilmDuration(true));
      dispatch(setErrorMessage('Заполните поле продолжительность фильма'));
      return;
    }

    if (typeof Number(filmDurationValue) !== 'number') {
      dispatch(setIsFilmDurationNotNumbers(true));
      dispatch(setErrorMessage('Вводите только цифры'));
      return;
    }

    if (!isUserSelectedAvatarForFilm) {
      dispatch(setIsFilmAvatarFileLoad(true));
      dispatch(setErrorMessage('Выберите изображение для фильма'));
      return;
    }

    const filmDataForSave: SaveAdminInputData = {
      id: uuidv4(),
      title: filmNameValue,
      movie_duration: Number(filmDurationValue),
      description: filmDescriptionValue,
      country_of_origin: filmCountryOriginValue,
      image: imageFilm.toString(),
      isAddedAdmin: true
    }

    let saveAdminInputData: SaveAdminInputData[] = [];

    if (localStorageAdminInputData) {
      try {
        saveAdminInputData = localStorageAdminInputData && JSON.parse(localStorageAdminInputData);
      } catch (e) {
        throw new Error('Ошибка при извлечении данных');
      }

      saveAdminInputData.push(filmDataForSave);
      localStorage.setItem('adminInputData', JSON.stringify(saveAdminInputData));

    } else {
      saveAdminInputData.push(filmDataForSave);
      localStorage.setItem('adminInputData', JSON.stringify(saveAdminInputData));
    }

    dispatch(setIsVisiblePopupAddFilm(false));
    dispatch(setIsFilmAdded(true));
    dispatch(setAddedFilmMessage('Фильм предварительно добавлен'));
    dispatch(setFilmName(''));
    dispatch(setFilmDuration(''));
    dispatch(setFilmDescription(''));
    dispatch(setFilmCountryOrigin(''));
    dispatch(setIsErrorAddFilm(false));
    dispatch(setIsUserSelectedAvatarForFilm(false));
  }
  const handleChangeFilmName = (e: {
    target: {
      name: string,
      value: string
    }
  }) => {
    dispatch(setFilmName(e.target.value));
  }

  const handleChangeFilmDescription = (e: {
    target: {
      value: string
    }
  }) => {
    dispatch(setFilmDescription(e.target.value));
  }

  const handleChangeFilmOrigin = (e: {
    target: {
      value: string
    }
  }) => {
    dispatch(setFilmCountryOrigin(e.target.value));
  }

  const handleChangeFilmDuration = (e: {
    target: {
      value: string
    }
  }) => {
    dispatch(setIsFilmDurationNotNumbers(false));

    if (!/(^[\d]+$)/.test(e.target.value) && e.target.value.length !== 0) {
      dispatch(setIsFilmDurationNotNumbers(true));
      dispatch(setErrorMessage('Вводите только цифры'));
    } else {
      dispatch(setFilmDuration(e.target.value));
    }
  }

  const handleClickFilmDuration = () => {
    dispatch(setIsFilmDurationNotNumbers(false));
  }

  const handleChangeImageFilm = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files) {
      dispatch(setIsUserSelectedAvatarForFilm(true));
      let reader = new FileReader();

      if (e.target.files[0]) {
        reader.readAsDataURL(e.target.files[0]);
      }
      reader.onloadend = function () {
        let base64data = reader.result;
        dispatch(setImageFilm(base64data));
      }
    } else {
      dispatch(setIsUserSelectedAvatarForFilm(false));
    }
  }

  const handleCancelFIlmAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(setIsVisiblePopupAddFilm(false));
    dispatch(setFilmName(''));
    dispatch(setFilmDuration(''));
    dispatch(setFilmCountryOrigin(''));
    dispatch(setFilmDescription(''));
    dispatch(setErrorMessage(''));
    dispatch(setIsBusyFilmName(false))
  }

  const handleSubmitAddSession = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!sessionHallName) {
      dispatch(setSessionHallName(hallsSort[0].name));
    }

    if (!startSessionValue) {
      dispatch(setIsEmptyStartSession(true));
      dispatch(setErrorMessage('Заполните поле время начала сеанса'));
      return;
    }

    const hall = halls.find((hall) => hall.name === sessionHallName);
    const film = copyFilmForRender.find((film) => film.title === sessionFilmNameValue);

    if (!hall) {
      return;
    }

    if (!film) {
      return;
    }

    const startSessionInMinutes = getIndent(startSessionValue) / 2;
    const endSessionInMinutes = startSessionInMinutes + (film.movie_duration / 2);
    const arrayPeriodSessionForHall = arrayPeriodSessionData.filter((period) => period.hall === hall.id);
    const isTimeIsBusy = arrayPeriodSessionForHall.some((period) => (period.start <= startSessionInMinutes && startSessionInMinutes <= period.end) ||
      (period.start <= endSessionInMinutes && endSessionInMinutes <= period.end) ||
      (startSessionInMinutes <= period.start && period.start <= endSessionInMinutes)
    );

    if (endSessionInMinutes > parCoords.width) {
      dispatch(setIsTimelineCrowded(true));
      dispatch(setErrorMessage('Сеанс должен заканчиваться до полуночи'));
      return;
    }

    if (isTimeIsBusy) {
      dispatch(setErrorMessage('Время занято, выберите другое'));
      dispatch(setIsBusySession(true));
      dispatch(setIsErrorFilmName(false));
      return;
    }

    const localStorageAdminInputSessions = localStorage.getItem('adminInputSessions');

    const sessionDataForSave: SaveAdminInputSessions = {
      id: uuidv4(),
      hall_id: hall.id,
      film_id: film.id,
      session_start_time: startSessionValue,
      isAddedAdmin: true,
      dateSession: dateSessions
    }

    let saveAdminInputSessions: SaveAdminInputSessions[] = [];
    if (localStorageAdminInputSessions) {
      saveAdminInputSessions = JSON.parse(localStorageAdminInputSessions);
      saveAdminInputSessions.push(sessionDataForSave);
      localStorage.setItem('adminInputSessions', JSON.stringify(saveAdminInputSessions));
    } else {
      saveAdminInputSessions.push(sessionDataForSave);
      localStorage.setItem('adminInputSessions', JSON.stringify(saveAdminInputSessions));
    }

    dispatch(setIsVisiblePopupAddSession(false));
    dispatch(setIsSessionAdded(true));
    dispatch(setAddedSessionMessage('Сеанс предварительно добавлен'));
    dispatch(setIsErrorFilmName(''));
  }

  const handleChangeSessionHallName = (e: {
    target: {
      value: string
    }
  }) => {
    dispatch(setIsBusySession(false));
    dispatch(setSessionHallName(e.target.value))
  }

  const handleClickSessionHallName = () => {
    dispatch(setIsBusySession(false));
  }

  const handleChangeSessionStartTime = (e: {
    target: {
      value: string
    }
  }) => {
    dispatch(setTimeStartSession(e.target.value));
    dispatch(setIsBusySession(false));
  }

  const handleClickSessionStartTime = () => {
    dispatch(setIsBusySession(false));
  }

  const handleChangeSessionFilmName = (e: {
    target: {
      value: string
    }
  }) => {
    dispatch(setSessionFilmName(e.target.value));
    dispatch(setIsBusySession(false));
  }

  const handleClickSessionFilmName = () => {
    dispatch(setIsBusySession(false));
  }

  const handleCancelAddSession = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    dispatch(setIsVisiblePopupAddSession(false));
    dispatch(setSessionFilmName(copyFilmForRender[0]?.title));
    dispatch(setTimeStartSession(''));
    dispatch(setIsBusySession(false));
  }

  const handleSubmitDeleteSession = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const sessionDel = copySessionForRender.find((session) => session.id === sessionId);

    if (sessionDel) {
      if (typeof sessionId === 'number') {
        dispatch(fetchDeleteSessionElem(sessionId)).then(() => dispatch(fetchGetSessionElems({
          date: currentDate,
          signal
        })));
        dispatch(setIsVisiblePopupDeleteSession(false));
        dispatch(setIsSessionDeleted(true));
      }
    } else {
      const localStorageAdminSessions = localStorage.getItem('adminInputSessions');

      if (localStorageAdminSessions) {
        let localStorageAdminSessionsParse: SaveAdminInputSessions[] = [];
        let localStorageAdminSessionsActual: SaveAdminInputSessions[] = [];

        try {
          localStorageAdminSessionsParse = JSON.parse(localStorageAdminSessions);
        } catch (e) {
          throw new Error('Ошибка при извлечении данных');
        }
        localStorageAdminSessionsActual = localStorageAdminSessionsParse.filter((ses: SaveAdminInputSessions) => ses.id !== sessionId);

        if (localStorageAdminSessionsActual.length > 0) {
          localStorage.setItem('adminInputSessions', JSON.stringify(localStorageAdminSessionsActual));
        } else {
          localStorage.removeItem('adminInputSessions');
        }

        dispatch(setIsVisiblePopupDeleteSession(false));
        dispatch(setIsSessionDeleted(true));
        dispatch(setDeletedSessionMessage('Предварительно сохраненный сеанс удален'));
      }
    }
  }

  const handleClickCancelSessionDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    dispatch(setFilmDeleteName(''));
    dispatch(setPropsTitle(''));
    dispatch(setIsVisiblePopupDeleteSession(false));
  }

  const handleSubmitDeleteFilm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!idFilmForDelete) {
      return;
    }

    const localStorageAdminInputData = localStorage.getItem('adminInputData');
    let filmsWithoutFilmDelete: SaveAdminInputData[];
    let dataParse: SaveAdminInputData[] = [];

    if (localStorageAdminInputData) {
      try {
        dataParse = JSON.parse(localStorageAdminInputData);
      } catch (e) {
        throw new Error('Ошибка при извлечении данных');
      }
    }

    if (dataParse.some((film) => film.id === idFilmForDelete)) {
      filmsWithoutFilmDelete = dataParse.filter((film: SaveAdminInputData) => film.id !== idFilmForDelete);

      if (filmsWithoutFilmDelete.length > 0) {
        localStorage.setItem('adminInputData', JSON.stringify(filmsWithoutFilmDelete));
      } else {
        localStorage.removeItem('adminInputData');
      }

      dispatch(setDeletedFilmMessage('Предварительно добавленный фильм удален'));
      dispatch(setIsFimDeleted(true));
      dispatch(setIsVisiblePopupDeleteFilm(false));
    } else {
      const localStorageSessionAdminData = localStorage.getItem('adminInputSessions');
      let sessionActual: Session[] = [];
      let sessionActualParse: Session[] = [];

      if (localStorageSessionAdminData) {
        try {
          sessionActualParse = JSON.parse(localStorageSessionAdminData);
        } catch (e) {
          throw new Error('Ошибка при извлечении данных');
        }

        sessionActual = sessionActualParse.filter((ses: Session) => ses.film_id !== Number(idFilmForDelete));
        localStorage.setItem('adminInputSessions', JSON.stringify(sessionActual));
      }

      dispatch(fetchDeleteFilmElem(Number(idFilmForDelete))).then(() => dispatch(fetchGetFilmsElems(signal))).then(() => dispatch(fetchGetSessionElems({
        date: currentDate,
        signal
      })));
      dispatch(setDeleteFilm(idFilmForDelete));
      dispatch(setIsVisiblePopupDeleteFilm(false));
      dispatch(setIsFimDeleted(true));
    }
  }

  const handleClickCancelFilmDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(setIsVisiblePopupDeleteFilm(false));
    dispatch(setPropsTitle(''));
  }

  const addSessionData = (sessionData: AddSessionData) => {
    arrayPeriodSessionData.push(sessionData);
  }

  const handleSubmitInfoDeleteFilm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(setIsFimDeleted(false));
    dispatch(setDeletedFilmMessage(''));
    dispatch(setIsSuccessfulDeleteFilm(false));
    dispatch(setIsErroneousDeleteFilm);
    dispatch(setIsFimDeleted(false));
  }

  const handleSubmitInfoAddFilm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(setIsFilmAdded(false));
    dispatch(setAddedFilmMessage(false));
  }

  const handleSubmitInfoAddSession = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(setIsSessionAdded(false));
    dispatch(setAddedSessionMessage(''));
  }

  const handleSubmitAddedFilmsAndSessions = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(setIsAddedFilmsAndSessions(false));
    dispatch(setAddedFilmMessage(''));
    dispatch(setAddedSessionMessage(''));
    dispatch(setIsSuccessfulAddFilms(false));
    dispatch(setIsErroneousFilm(false));
    dispatch(setIsSuccessfulAddSessions(false));
    dispatch(setIsErroneousAddSession(false));
  }

  const handleSubmitDeletedFilmsAndSessions = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(setIsVisiblePopupDeleteSession(false));
    dispatch(setDeletedFilmMessage(''));
    dispatch(setDeletedSessionMessage(''));
    dispatch(setIsSuccessfulDeleteFilm(false));
    dispatch(setIsErroneousDeleteFilm(false));
    dispatch(setIsSuccessfulDeleteSession(false));
    dispatch(setIsErroneousDeleteSession(false));
    dispatch(setIsDeletedFilmsAndSessions(false));
    dispatch(setIsSuccessfulGetAllFilms(false));
    dispatch(setIsSuccessfulGetAllSessions(false));
  }

  const handleSubmitInfoDeleteSession = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(setIsSessionDeleted(false));
    dispatch(setDeletedSessionMessage(''));
    dispatch(setIsSuccessfulDeleteSession(false));
    dispatch(setIsErroneousAddSession(false));
    dispatch(setIsSessionDeleted(false));
  }

  const handleSubmitSaveChairs = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(setIsGetHallAllForChairs(false));
    dispatch(setIsSuccessfulUpdateHall(false));
    dispatch(setIsSuccessfulAddSeats(false));
    dispatch(setIsSuccessfulAllHall(false));
    dispatch(setIsErroneousUpdateHall(false));
    dispatch(setIsErroneousAddSeats(false));
    dispatch(setIsErroneousAllHall(false));
    dispatch(setCompareChairsMessage(''));
  }

  const handleSubmitSavePrice = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(setIsGetHallAllForPrice(false));
    dispatch(setIsSuccessfulUpdateHall(false));
    dispatch(setIsErroneousUpdateHall(false));
    dispatch(setIsSuccessfulAllHall(false));
    dispatch(setIsErroneousAllHall(false));
    dispatch(setComparePriceMessage(''));
  }

  const handleSubmitAddHall = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(setIsSuccessfulAddHall(false));
    dispatch(setIsSuccessfulAllHall(false));
    dispatch(setIsErroneousAddHall(false));
    dispatch(setIsErroneousAllHall(false));
    dispatch(setIsAddHallPopup(false));
  }

  const handleSubmitDeleteHall = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(setISuccessfulDeleteHall(false));
    dispatch(setIsSuccessfulAllHall(false));
    dispatch(setIsErroneousDeleteHall(false));
    dispatch(setIsErroneousAllHall(false));
    dispatch(setIsDeleteHallPopup(false));
  }

  return (
    <>
      {
        isGetHallAllForPrice && <Popup status={"active"}>
          {
            (isLoadingUpdateHall || isLoadingAllHall) ?
              <div><p>Идет сохранение данных, пожалуйста, подождите</p></div> :
              <>
                <div>
                  <p>
                    {
                      (isSuccessfulUpdateHall && isSuccessfulAllHall)
                        ? "Данные сохранены"
                        : (isErroneousUpdateHall || isErroneousAllHall)
                          ? "Не удалось сохранить данные"
                          : comparePriceMessage && comparePriceMessage
                    }
                  </p>
                </div>
                <form onSubmit={(e) => handleSubmitSavePrice(e)}>
                  <div className="conf-step__buttons text-center">
                    <button className="conf-step__button conf-step__button-regular">OK</button>
                  </div>
                </form>
              </>
          }
        </Popup>}

      {
        isGetHallAllForChairs && <Popup status={"active"}>
          {
            (isLoadingUpdateHall || isLoadingSeatsAdd || isLoadingAllHall) ?
              <div><p>Идет сохранение данных, пожалуйста, подождите</p></div> :
              <>
                <div>
                  <p>
                    {
                      (isSuccessfulUpdateHall && isSuccessfulAddSeats && isSuccessfulAllHall) ? "Данные сохранены"
                        : isErroneousUpdateHall || isErroneousAddSeats || isErroneousAllHall ? "Не удалось сохранить данные"
                          : compareChairsMessage && compareChairsMessage
                    }
                  </p>
                </div>
                <form onSubmit={(e) => handleSubmitSaveChairs(e)}>
                  <div className="conf-step__buttons text-center">
                    <button className="conf-step__button conf-step__button-regular">OK
                    </button>
                  </div>
                </form>
              </>
          }
        </Popup>
      }

      {isVisibleModalAddHall && <Popup status={"active"}>
        <form onSubmit={(e) => handleSubmitHallAdd(e)} noValidate>
          <label className="conf-step__label conf-step__label-fullsize" htmlFor="name">
            Название зала
            <input className="conf-step__input" type="text" placeholder="Например, &laquo;Зал 1&raquo;"
                   name="name" value={hallName} onChange={(e) => handleChangeHallAdd(e)}
                   onClick={(e) => handleClickHallAdd(e)} required/>
          </label>
          {isHallNameEmpty && <Tooltip text={errorMessageTooltip} styleEl={styleError}/>}
          {isBusyNameHall && <Tooltip text={errorMessageTooltip} styleEl={styleError}/>}

          <div className="conf-step__buttons text-center">
            <input type="submit" value="Добавить зал" className="conf-step__button conf-step__button-accent"/>
            <button type="button" className="conf-step__button conf-step__button-regular"
                    onClick={(e) => handleCancelHallAdd(e)}>Отменить
            </button>
          </div>
        </form>
      </Popup>
      }

      {isVisibleModalDeleteHall && <Popup status={"active"}>
        {isloadingHallDelete && <Tooltip text={"Зал удаляется. Пожалуйста, подождите."}/>}
        <form onSubmit={(e) => handleSubmitHallDelete(e)}>
          <p className="conf-step__paragraph">Вы действительно хотите удалить зал <span></span>?</p>
          <div className="conf-step__buttons text-center">
            <input type="submit" value="Удалить" className="conf-step__button conf-step__button-accent"/>
            <button type="button" className="conf-step__button conf-step__button-regular"
                    onClick={(e) => handleCancelDeleteHall(e)}>Отменить
            </button>
          </div>
        </form>
      </Popup>}

      {IsDeleteHallPopup && <Popup status={"active"}>
        {
          isloadingHallDelete || isLoadingAllHall ?
            <div><p>Зал удаляется, пожалуйста, подождите</p></div> :
            <>
              {(isSuccessfulDeleteHall && isSuccessfulAllHall) ? "Зал удален"
                : (isErroneousDeleteHall || isErroneousAllHall) && "Не удалось удалить зал"}
              <form onSubmit={(e) => handleSubmitDeleteHall(e)}>
                <div className="conf-step__buttons text-center">
                  <button className="conf-step__button conf-step__button-regular">OK
                  </button>
                </div>
              </form>
            </>
        }
      </Popup>}

      {isAddHallPopup && <Popup status={"active"}>
        {
          isLoadingHallAdd || isLoadingAllHall ?
            <div><p>Зал добавляется, пожалуйста, подождите</p></div> :
            <>
              {(isSuccessfulAddHall && isSuccessfulAllHall) ? "Зал добавлен"
                : (isErroneousAddHall || isErroneousAllHall) && "Не удалось создать зал"
              }
              <form onSubmit={(e) => handleSubmitAddHall(e)}>
                <div className="conf-step__buttons text-center">
                  <button className="conf-step__button conf-step__button-regular">OK
                  </button>
                </div>
              </form>
            </>
        }
      </Popup>}

      {isDeletedFilmsAndSessions && <Popup status={"active"}>
        {(isLoadingFilmsAll || isLoadingSessionsAll) ?
          <div><p>Идет удаление данных, пожалуйста, подождите</p></div> :
          <>
            <div>
              <p>
                {(isSuccessfulGetAllFilms && isSuccessfulGetAllSessions) ? "Данные удалены"
                  : isErroneousAllFilms || isErroneousAllSession ? "Не удалось удалить данные"
                    : messageNotRemoveFilmsAndSessions && messageNotRemoveFilmsAndSessions
                }
              </p>
            </div>
            <form onSubmit={(e) => handleSubmitDeletedFilmsAndSessions(e)}>
              <div className="conf-step__buttons text-center">
                <button className="conf-step__button conf-step__button-regular">OK
                </button>
              </div>
            </form>
          </>}
      </Popup>}

      {isAddedFilmsAndSessions && <Popup status={"active"}>
        {(isLoadingAddFilm || isLoadingSessionAdd) ? <div><p> Идет сохранение данных, пожалуйста, подождите</p></div> :
          <>
            <div>
              <p> {(isSuccessfulAddFilms && isSuccessfulAddSessions) ? "Фильмы сохранены. Сеансы сохранены"
                : isSuccessfulAddFilms && isErroneousSession ? "Фильмы сохранены. Не удалось сохранить сеансы"
                  : isErroneousFilm && isSuccessfulAddSessions ? "Фильмы сохранить не удалось. Сеансы сохранены"
                    : isErroneousFilm && isErroneousSession ? "Данные не сохранены"
                      : isSuccessfulAddFilms ? "Фильмы сохранены."
                        : isErroneousFilm ? "Фильмы сохранить не удалось."
                          : isSuccessfulAddSessions ? "Сеансы сохранены."
                            : isErroneousSession ? "Не удалось сохранить сеансы"
                              : "Нет данных для сохранения"}
              </p>
            </div>
            <form onSubmit={(e) => handleSubmitAddedFilmsAndSessions(e)}>
              <div className="conf-step__buttons text-center">
                <button className="conf-step__button conf-step__button-regular">OK
                </button>
              </div>
            </form>
          </>}
      </Popup>}


      {isFilmAdded && <Popup status={"active"}>
        <>
          <div>
            <p> {addedFilmMessage}
            </p>
          </div>
          <form onSubmit={(e) => handleSubmitInfoAddFilm(e)}>
            <div className="conf-step__buttons text-center">
              <button className="conf-step__button conf-step__button-regular">OK
              </button>
            </div>
          </form>
        </>
      </Popup>}

      {isVisibleModalAddFilm && <Popup status={"active"}>
        <form onSubmit={(e) => handleSubmitAddFilm(e)} noValidate>
          <label className="conf-step__label conf-step__label-fullsize" htmlFor="name">
            Название фильма
            <input
              className="conf-step__input"
              type="text"
              placeholder="Например, &laquo;Гражданин Кейн&raquo;"
              name="name"
              value={filmNameValue}
              onChange={(e) => handleChangeFilmName(e)}
              required
            />
          </label>
          {isEmptyFilmName && <Tooltip text={errorMessageTooltip} styleEl={styleError}/>}
          {isBusyFilmName && <Tooltip text={errorMessageTooltip} styleEl={styleError}/>}

          <label className="conf-step__label conf-step__label-fullsize" htmlFor="desc">
            Описание фильма
            <input
              className="conf-step__input"
              type="text"
              placeholder="Например, &laquo;Приключения в галактике&raquo;"
              name="desc"
              value={filmDescriptionValue}
              onChange={(e) => handleChangeFilmDescription(e)}
              required
            />
          </label>

          {isEmptyFilmDesc && <Tooltip text={errorMessageTooltip} styleEl={styleError}/>}
          <label className="conf-step__label conf-step__label-fullsize" htmlFor="origin">
            Страна-производитель фильма
            <input
              className="conf-step__input"
              type="text"
              placeholder="Название страны"
              name="origin"
              value={filmCountryOriginValue}
              onChange={(e) => handleChangeFilmOrigin(e)}
              required
            />
          </label>

          {isEmptyFilmOrigin && <Tooltip text={errorMessageTooltip} styleEl={styleError}/>}
          <label className="conf-step__label conf-step__label-fullsize" htmlFor="duration">
            Продолжительность фильма
            <input
              className="conf-step__input"
              type="text"
              placeholder="Продолжительность фильма в минутах"
              name="duration"
              value={filmDurationValue}
              onChange={(e) => handleChangeFilmDuration(e)}
              onClick={handleClickFilmDuration}
              required
            />
          </label>

          {isEmptyFilmDuration && <Tooltip text={errorMessageTooltip} styleEl={styleError}/>}
          {isFilmDurationNotNumbers && <Tooltip text={errorMessageTooltip} styleEl={styleError}/>}

          <label className="conf-step__label conf-step__label-fullsize" htmlFor="duration">
            Постер для фильма
            <input
              className="conf-step__input"
              type="file"
              name="poster"
              onChange={(e) => handleChangeImageFilm(e)}
              accept={"image/*, .png, .jpg, .gif, .web"}
              required
            />
          </label>

          {isFilmAvatarFileLoad && <Tooltip text={errorMessageTooltip} styleEl={styleError}/>}

          <div className="conf-step__buttons text-center">
            <input type="submit" value="Добавить фильм" className="conf-step__button conf-step__button-accent"/>
            <button
              type="button"
              className="conf-step__button conf-step__button-regular"
              onClick={(e) => handleCancelFIlmAdd(e)}>Отменить
            </button>
          </div>
        </form>
      </Popup>
      }

      {isFimDeleted && <Popup status={"active"}>
        {isLoadingDeleteFilm ? <div><p> Фильм удаляется, пожалуйста, подождите</p></div> :
          <>
            <div>
              <p> {isSuccessfulDeleteFilm ? "Фильм удален" : isErroneousDeleteFilm ? "Не удалось удалить фильм" : deletedFilmMessage}
              </p>
            </div>
            <form onSubmit={(e) => handleSubmitInfoDeleteFilm(e)}>
              <div className="conf-step__buttons text-center">
                <button className="conf-step__button conf-step__button-regular">OK
                </button>
              </div>
            </form>
          </>}
      </Popup>}

      {isVisibleModalDeleteFilm && <Popup status={"active"}>
        <form onSubmit={(e) => handleSubmitDeleteFilm(e)}>
          <p className="conf-step__paragraph">Вы действительно хотите удалить фильм <span>"{filmNameForDelete}"</span> ?
          </p>
          {/*// <!-- В span будет подставляться название фильма -->*/}
          <div className="conf-step__buttons text-center">
            <input type="submit" value="Удалить" className="conf-step__button conf-step__button-accent"/>
            <button
              type="button"
              className="conf-step__button conf-step__button-regular"
              onClick={(e) => handleClickCancelFilmDelete(e)}>Отменить
            </button>
          </div>
        </form>
      </Popup>}

      {isSessionAdded && <Popup status={"active"}>
        <>
          <div><p>{addedSessionMessage}</p></div>
          <form onSubmit={(e) => handleSubmitInfoAddSession(e)}>
            <div className="conf-step__buttons text-center">
              <button className="conf-step__button conf-step__button-regular">OK</button>
            </div>
          </form>
        </>
      </Popup>}

      {isVisibleAddSession && <Popup status={"active"}>
        {isBusySession && <Tooltip text={errorMessageTooltip} styleEl={styleError}/>}
        {isTimelineCrowded && <Tooltip text={errorMessageTooltip} styleEl={styleError}/>}
        <form onSubmit={(e) => handleSubmitAddSession(e)} noValidate>
          <label className="conf-step__label conf-step__label-fullsize" htmlFor="hall"> Название зала
            <select
              className="conf-step__input"
              name="hall"
              value={sessionHallName}
              onChange={(e) => handleChangeSessionHallName(e)}
              onClick={handleClickSessionHallName}
              required>
              {optionsHalls}
            </select>
          </label>

          <label className="conf-step__label conf-step__label-fullsize" htmlFor="name">
            Время начала
            <input
              className="conf-step__input"
              type="time"
              value={startSessionValue}
              name="start_time"
              onChange={(e) => handleChangeSessionStartTime(e)}
              onClick={handleClickSessionStartTime}
              required
            />
          </label>

          {isEmptyStartSession && <Tooltip text={errorMessageTooltip} styleEl={styleError}/>}

          <label className="conf-step__label conf-step__label-fullsize" htmlFor="name"> Название фильма
            <select
              className="conf-step__input"
              name="film"
              value={sessionFilmNameValue}
              onChange={(e) => handleChangeSessionFilmName(e)}
              onClick={handleClickSessionFilmName}
              required
            >
              {optionsFilms}
            </select>
          </label>
          <div className="conf-step__buttons text-center">
            <input type="submit" value="Добавить" className="conf-step__button conf-step__button-accent"/>
            <button type="button" className="conf-step__button conf-step__button-regular"
                    onClick={(e) => handleCancelAddSession(e)}>Отменить
            </button>
          </div>
        </form>
      </Popup>}

      {isSessionDeleted && <Popup status={"active"}>
        {isLoadingSessionDelete ? <div><p> Сеанс удаляется, пожалуйста, подождите</p></div> :
          <>
            <div>
              <p> {isSuccessfulDeleteSession ? "Сеанс удален" : isErroneousDeleteSession ? "Не удалось удалить сеанс" : deletedSessionMessage}</p>
            </div>
            <form onSubmit={(e) => handleSubmitInfoDeleteSession(e)}>
              <div className="conf-step__buttons text-center">
                <button className="conf-step__button conf-step__button-regular">OK
                </button>
              </div>
            </form>
          </>}
      </Popup>}

      {isVisibleDeleteSession && <Popup status={"active"}>
        <form onSubmit={(e) => handleSubmitDeleteSession(e)}>
          <p className="conf-step__paragraph">Вы действительно хотите снять с сеанса
            фильм <span>"{filmNameSessionDelete}"</span>?</p>
          {/*// <!-- В span будет подставляться название фильма -->*/}
          <div className="conf-step__buttons text-center">
            <input type="submit" value="Удалить" className="conf-step__button conf-step__button-accent"/>
            <button
              type="button"
              className="conf-step__button conf-step__button-regular"
              onClick={(e) => handleClickCancelSessionDelete(e)}>Отменить
            </button>
          </div>
        </form>
      </Popup>}

      <Header>
        <span className={homeAdminCss.page_header__subtitle}>Администраторррская</span>
      </Header>
      <main className="conf-steps">
        <HallAll addSessionData={addSessionData}/>
      </main>
    </>
  )
}

export default HomeAdmin;
