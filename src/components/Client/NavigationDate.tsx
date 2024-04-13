import * as React from 'react';
import moment from 'moment';
import 'moment/locale/ru';
import {NavLink} from 'react-router-dom';
import {v4 as uuidv4} from 'uuid';
import {useAppDispatch} from '../../app/hooks';
import {fetchGetSessionElems} from '../../store/slices/slicesAdmin/sessionsAllReducerAdmin';
import {getDayData} from '../../app/utils/getDayData';
import {setLocStDayData} from '../../app/utils/setLocStDayData';
import {fetchClientGetSession} from '../../store/slices/slicesClient/sessionAllForClientReducer';

moment().locale('ru-RU');

const daysData = [
  moment().format('YYYYMMDD'),
  moment().add(1, 'days').format('YYYYMMDD'),
  moment().add(2, 'days').format('YYYYMMDD'),
  moment().add(3, 'days').format('YYYYMMDD'),
  moment().add(4, 'days').format('YYYYMMDD'),
  moment().add(5, 'days').format('YYYYMMDD'),
];

function NavigationDate({
                          getSelectedDay = (day: string): void => {
                          }, queryUser = ''
                        }) {
  const dispatch = useAppDispatch();
  const dateLocStor = localStorage.getItem('selectedDay');
  let dateParse: { dayNumber: string, dayName: string, dayDate: string } = {dayNumber: '', dayName: '', dayDate: ''};
  const controller = new AbortController();
  const signal = controller.signal;

  if (dateLocStor) {
    try {
      dateParse = JSON.parse(dateLocStor);
    } catch (e) {
      throw new Error('Ошибка при извлечении данных');
    }
    getSelectedDay(dateParse.dayDate);
  } else {
    getSelectedDay(moment().format('YYYYMMDD'));
    const parent = document.querySelector('.page-nav');
    let chosenInd = 0;
    const listNavElems = parent?.querySelectorAll('.page-nav__day');

    if (listNavElems) {
      chosenInd = Array.from(listNavElems).findIndex((el) => el.classList.contains('page-nav__day_chosen'));

      const selectedDay = getDayData(listNavElems, chosenInd);
      localStorage.setItem('selectedDay', JSON.stringify(selectedDay));
    }
  }

  const handleClickDate = (e: React.MouseEvent<HTMLAnchorElement>, day: string) => {
    e.preventDefault();

    const linkParent = e.currentTarget.closest('.page-nav');
    const linksDate = linkParent?.querySelectorAll('.page-nav__day');
    const linkToday = linksDate && Array.from(linksDate)?.find((link) => link.querySelector('.page-nav__day-week')?.textContent === moment().format('ddd')
      && link.querySelector('.page-nav__day-number')?.textContent === moment().format('D'));

    linkToday && linkToday.classList.add('page-nav__day_today');

    const selectedDay = {
      dayNumber: e.currentTarget.querySelector('.page-nav__day-number')?.textContent,
      dayName: e.currentTarget.querySelector('.page-nav__day-week')?.textContent,
      dayDate: day
    }

    localStorage.setItem('selectedDay', JSON.stringify(selectedDay));
    if (queryUser === 'admin') {
      dispatch(fetchGetSessionElems({date: day, signal}));
    } else if (queryUser === 'user') {
      dispatch(fetchClientGetSession({date: day, signal}));
    }

    if (linkParent) {
      const chosenDay = linkParent.querySelector('.page-nav__day_chosen');
      if (e.currentTarget !== chosenDay) {
        chosenDay?.classList.remove('page-nav__day_chosen');
        e.currentTarget.classList.add('page-nav__day_chosen');
      }
    }
  }

  const handleClickNextDayArrow = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    const parent = e.currentTarget.closest('.page-nav');
    const listNavElems = parent?.querySelectorAll('.page-nav__day');
    let chosenInd: number = 0;

    if (listNavElems) {
      chosenInd = Array.from(listNavElems).findIndex((el) => el.classList.contains('page-nav__day_chosen'));

      Array.from(listNavElems)[chosenInd]?.classList.remove('page-nav__day_chosen');

      if (Array.from(listNavElems)[chosenInd + 1] !== undefined
        && !Array.from(listNavElems)[chosenInd + 1].classList.contains('page-nav__day_next')) {

        Array.from(listNavElems)[chosenInd + 1].classList.add('page-nav__day_chosen');
        const selectedDay = getDayData(listNavElems, chosenInd + 1);
        setLocStDayData(selectedDay);

        if (queryUser === 'admin') {
          dispatch(fetchGetSessionElems({date: selectedDay.dayDate, signal} ?? {date: '', signal}));
        } else if (queryUser === 'user') {
          dispatch(fetchClientGetSession({date: selectedDay.dayDate, signal} ?? {date: '', signal}));
        }
      } else {
        Array.from(listNavElems)[0].classList.add('page-nav__day_chosen');
        const selectedDay = getDayData(listNavElems, 0);
        setLocStDayData(selectedDay);

        if (queryUser === 'admin') {
          dispatch(fetchGetSessionElems({date: selectedDay.dayDate, signal} ?? {date: '', signal}));
        } else if (queryUser === 'user') {
          dispatch(fetchClientGetSession({date: selectedDay.dayDate, signal} ?? {date: '', signal}));
        }
      }
    }
  }

  return (
    <nav className="page-nav">
      {daysData.length === 0 ? null : daysData.map((day) => {
        let classAddToday: string;
        let classAddWeekends: string;
        classAddToday = (moment(day, 'YYYYMMDD').format('YYYYMMDD') === moment().format('YYYYMMDD')) ? 'page-nav__day_today' : '';
        classAddWeekends = (moment(day, 'YYYYMMDD').format('E') === '6' || moment(day, 'YYYYMMDD').format('E') === '7') ? 'page-nav__day_weekend' : '';

        const dateLocStor = localStorage.getItem('selectedDay');
        let dateParse: { dayNumber: string, dayName: string, dayDate: string } = {
          dayNumber: '',
          dayName: '',
          dayDate: ''
        };

        let chosen = '';

        if (dateLocStor) {
          try {
            dateParse = JSON.parse(dateLocStor);
            if (daysData.some((day) => day === dateParse.dayDate)) {
              chosen = moment(day, 'YYYYMMDD').format('ddd') === dateParse.dayName && moment(day, 'YYYYMMDD').format('D') === dateParse.dayNumber ? 'page-nav__day_chosen' : '';
            } else {
              const parentToday = document.querySelector('.page-nav__day_today');

              if (parentToday) {
                const selectedDay = {
                  dayNumber: parentToday.querySelector('.page-nav__day-number')?.textContent,
                  dayName: parentToday.querySelector('.page-nav__day-week')?.textContent,
                  dayDate: day
                }
                localStorage.setItem('selectedDay', JSON.stringify(selectedDay));
              }
            }
          } catch (e) {
            throw new Error('Ошибка при извлечении данных');
          }
        } else {
          chosen = (moment(day, 'YYYYMMDD').format('YYYYMMDD') === moment().format('YYYYMMDD')) ? 'page-nav__day_chosen' : '';
        }

        return (
          <NavLink
            to={"?date=" + day} className={`page-nav__day ${classAddWeekends} ${classAddToday} ${chosen}`}
            onClick={(e) => handleClickDate(e, day)} data-date={day}
            key={uuidv4()}
          >
            <span className="page-nav__day-week">{moment(day, 'YYYYMMDD').format('ddd')}</span>
            <span className="page-nav__day-number">{moment(day, 'YYYYMMDD').format('D')}</span>
          </NavLink>
        )
      })}
      <NavLink to={moment().add(1, 'days').format('YYYYMMDD')} className={"page-nav__day page-nav__day_next"}
               onClick={(e) => handleClickNextDayArrow(e)}/>
    </nav>
  )
}

export default NavigationDate;
