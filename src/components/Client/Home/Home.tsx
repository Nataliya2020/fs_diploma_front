import * as React from 'react';
import {useAppSelector, useAppDispatch} from '../../../app/hooks';
import '../../../client.css';
import HeaderClient from '../HeaderClient/HeaderClient';
import NavigationDate from '../../Client/NavigationDate';
import {fetchClientGetFilmsElems} from '../../../store/slices/slicesClient/filmAllForClientReducer';
import {fetchClientGetSession} from '../../../store/slices/slicesClient/sessionAllForClientReducer';
import {fetchClientGetHalls} from '../../../store/slices/slicesClient/hallAllForClientReducer';
import homeCss from './Home.module.css';
import Main from '../Main';
import {getDate} from '../../../app/utils/getDate';
import HandleFetchError from '../../HandleFetchError/HandleFetchError';
import {useEffect} from "react";

function Home() {
  const dispatch = useAppDispatch();
  const isLoadingFilms = useAppSelector(state => state.clientFilmsAll.isLoading);
  const isLoadingHall = useAppSelector(state => state.clientHallAll.isLoading)
  const isLoadingSession = useAppSelector(state => state.clientSessionAll.isLoading)
  const isErrorFetchHalls = useAppSelector(state => state.clientHallAll.isErroneousGetAllHalls);
  const selectedDate = getDate();
  const isErrorFetchFilmsAll = useAppSelector(state => state.clientFilmsAll.isErroneousGetAllFilm);
  const isErrorFetchSessions = useAppSelector(state => state.clientSessionAll.isErroneousSessionAll);
  const errorMessageGetHalls = useAppSelector(state => state.clientHallAll.errorMessage);
  const errorMessageGetFilms = useAppSelector(state => state.clientFilmsAll.errorMessage);
  const errorMessageGetSessions = useAppSelector(state => state.clientFilmsAll.errorMessage);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const data = {date: selectedDate, signal: signal};

    document.body.classList.add(`${homeCss.bodyHome}`)
    try {
      dispatch(fetchClientGetFilmsElems(signal));
      dispatch(fetchClientGetHalls(signal));
      dispatch(fetchClientGetSession(data));
    } catch (e) {
      const resultError = (e as Error).message;
      throw new Error('что-то пошло не так' + resultError);
    }
    return () => {
      controller.abort();
      document.body.classList.remove(`${homeCss.bodyHome}`)
    }
  }, [dispatch, selectedDate])

  if (isLoadingFilms || isLoadingHall || isLoadingSession || errorMessageGetHalls === 'The user aborted a request.' || errorMessageGetFilms === 'The user aborted a request.' || errorMessageGetSessions === 'The user aborted a request.') {

    return (
      <>
        <HeaderClient/>
        <NavigationDate queryUser={"user"}/>
        <main>
          <div style={{textAlign: "center", fontSize: "20px"}}><p>Информация загружается. Пожалуйста, подождите.</p>
          </div>
        </main>
      </>
    )
  }

  if ((isErrorFetchHalls && errorMessageGetHalls !== 'The user aborted a request.') || (isErrorFetchFilmsAll && errorMessageGetFilms !== 'The user aborted a request.') || (isErrorFetchSessions && errorMessageGetSessions !== 'The user aborted a request.')) {
    return (
      <>
        <HeaderClient/>
        <NavigationDate queryUser={"user"}/>
        <HandleFetchError/>
      </>
    );
  }

  return (
    <>
      <HeaderClient/>
      <NavigationDate queryUser={"user"}/>
      <Main date={selectedDate}/>
    </>
  )
}

export default Home;
