import * as React from 'react';
import {NavLink} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from '../../../app/hooks';
import {ReactNode} from 'react';
import {
  setFilmDeleteName,
  setIsVisiblePopupDeleteSession
} from '../../../store/slices/slicesAdmin/sessionDeleteReducer';
import popupStyles from './Popup.module.css';
import '../../../normolizeAdmin.css';

import {
  setHallName,
  setIsVisiblePopupAddHall,
  setIsVisiblePopupDeleteHall,
} from '../../../store/slices/slicesAdmin/hallAddReducer';

import {setPropsTitle} from '../../../store/slices/infoFinalActionCrud';

import {
  setFilmCountryOrigin,
  setFilmDescription,
  setFilmDuration,
  setFilmName,
  setIsVisiblePopupAddFilm,
} from '../../../store/slices/slicesAdmin/filmAddReducer';

import {setIsVisiblePopupDeleteFilm} from '../../../store/slices/slicesAdmin/filmDeleteReducer';

import {
  setSessionFilmName,
  setSessionHallName,
  setTimeStartSession,
  setIsVisiblePopupAddSession
} from '../../../store/slices/slicesAdmin/sessionAddReducer';
import close from '../../../img/admin/close.png';

function Popup(props: { children: ReactNode, status: string }) {
  const dispatch = useAppDispatch();
  const title = useAppSelector(state => state.infoFinalCrud.props.title);

  const handleClosePopup = () => {
    dispatch(setHallName(''));
    dispatch(setIsVisiblePopupAddHall(false));
    dispatch(setIsVisiblePopupDeleteHall(false));
    dispatch(setIsVisiblePopupAddFilm(false));
    dispatch(setFilmName(''));
    dispatch(setFilmDuration(''));
    dispatch(setFilmCountryOrigin(''));
    dispatch(setFilmDescription(''));
    dispatch(setIsVisiblePopupAddSession(false));
    dispatch(setSessionHallName(''));
    dispatch(setSessionFilmName(''));
    dispatch(setTimeStartSession(''));
    dispatch(setFilmDeleteName(''));
    dispatch(setPropsTitle(''));
    dispatch(setIsVisiblePopupDeleteSession(false));
    dispatch(setIsVisiblePopupDeleteFilm(false));
  }

  return (
    <>
      <div className={props.status ? `${popupStyles.popup} ${popupStyles.active}` : `${popupStyles.popup}`}>
        <div className={popupStyles.popup__container}>
          <div className={popupStyles.popup__content}>
            <div className={popupStyles.popup__header}>
              <h2 className={popupStyles.popup__title}>
                {title}
                <NavLink to={'/homeAdmin'} className={popupStyles.popup__dismiss} onClick={handleClosePopup}><img
                  src={close} alt="Закрыть"/>
                </NavLink>
              </h2>

            </div>
            <div className={popupStyles.popup__wrapper}>
              {props.children}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Popup;
