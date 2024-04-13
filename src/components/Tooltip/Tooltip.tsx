import React, {useEffect, useRef} from 'react';
import styles from './Tootltip.module.css'
import {setErrorMessage, setIsActive, setIsNotNumberInputRowsInHall} from '../../store/slices/tooltipReducer';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {
  setIsBusyFilmName,
  setIsBusyNameHall,
  setIsEmptyFilmDesc,
  setIsEmptyFilmDuration,
  setIsEmptyFilmName,
  setIsEmptyFilmOrigin, setIsEmptyStartSession, setIsFilmAvatarFileLoad, setIsFilmDurationNotNumbers, setIsHallNameEmpty
} from "../../store/slices/validationFormReducer";
import {setIsBusySession, setIsTimelineCrowded} from "../../store/slices/slicesAdmin/sessionAddReducer";

type PropsType = {
  text: string;
  styleEl?: string
};

const Tooltip: ({text, styleEl}: PropsType) => JSX.Element = ({text, styleEl}: PropsType) => {
  const dispatch = useAppDispatch();
  const docEl = useRef<HTMLDivElement>(null);
  const errorMessageTooltip = useAppSelector(state => state.tooltip.errorMessage);

  useEffect(() => {

    const handleOnClick = (e: MouseEvent) => {
      if (errorMessageTooltip) {
        if (docEl.current !== e.target) {
          const targetButPar = (e.target as HTMLElement).closest('.conf-step');
          const targetBut = targetButPar?.querySelector('.conf-step__button');
          const targetButParBuy = (e.target as HTMLElement).closest('.buying');
          const targetButBuy = targetButParBuy?.querySelector('.acceptin-button');
          const targetButAddFilmPar = (e.target as HTMLElement).closest('form');
          const targetButAddFilm = targetButAddFilmPar?.querySelector('.conf-step__button')

          if (e.target === targetBut || e.target === targetButBuy || e.target === targetButAddFilm) {
            return;
          }
        }
        dispatch(setIsActive(false));
        dispatch(setIsEmptyFilmName(false));
        dispatch(setIsEmptyFilmDesc(false));
        dispatch(setIsEmptyFilmOrigin(false));
        dispatch(setIsEmptyFilmDuration(false));
        dispatch(setIsFilmDurationNotNumbers(false));
        dispatch(setIsBusyFilmName(false));
        dispatch(setIsFilmAvatarFileLoad(false));
        dispatch(setIsHallNameEmpty(false));
        dispatch(setIsBusyNameHall(false));
        dispatch(setIsFilmAvatarFileLoad(false));
        dispatch(setIsFilmDurationNotNumbers(false));
        dispatch(setIsNotNumberInputRowsInHall(false));
        dispatch(setIsEmptyStartSession(false));
        dispatch(setIsBusySession(false));
        dispatch(setIsTimelineCrowded(false));
        dispatch(setErrorMessage(""));
      }
    }

    document.addEventListener('click', handleOnClick);
    return () => {
      document.removeEventListener('click', handleOnClick)
    }
  }, [dispatch, errorMessageTooltip])

  return <div className={styles.tooltip}>
    <p className={styles[`${styleEl}`]} ref={docEl}>{text}</p>
  </div>
}
export default Tooltip;

