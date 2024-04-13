import * as React from 'react';
import HeaderClient from '../HeaderClient/HeaderClient';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from '../../../app/hooks';
import {fetchClientGetHallElem} from '../../../store/slices/slicesClient/hallForClientReducer';
import hallCss from './Hall.module.css';
import getChairChunk from '../../../app/utils/getChairChunk';
import getPlacesForClients from '../../../app/utils/getPlacesForClients';
import {v4 as uuidv4} from 'uuid';
import {
  fetchAddTicket,
  sethallName,
  setPrice,
  setSeats, setSeatsForDeleteTicket,
  setStartTime,
  setTitleFilm
} from '../../../store/slices/slicesClient/addTicketReducer';
import {setErrorMessage, setIsActive} from '../../../store/slices/tooltipReducer'
import Tooltip from '../../Tooltip/Tooltip';
import {fetchAddTicketSeats} from '../../../store/slices/slicesClient/ticketSeatsAddReducer'
import {Sessions} from '../../../store/slices/slicesClient/hallForClientReducer';
import {fetchSessionUpdate} from '../../../store/slices/slicesClient/sessionUpdateReducer';
import {Ticket, TicketSeat} from '../../../app/types/types';
import {styleError} from '../../../app/stylesForInfo/stylesForInfo';
import {useEffect} from "react";

function Hall() {
  const dispatch = useAppDispatch();
  const hall = useAppSelector(state => state.clientHallItem.hallElem);
  const isLoading = useAppSelector(state => state.clientHallItem.isLoading);
  const isTooltipActive = useAppSelector(state => state.tooltip.isActive);
  const errorMessageTooltip = useAppSelector(state => state.tooltip.errorMessage);
  const params = useParams();
  const prodId = params.id;
  const location = useLocation();
  const rows = hall.rows;
  const chairInRows = hall.chairs_in_row;
  const arrBlock = hall.blocked_chairs.split(',');
  const arrStandart = hall.number_standard_chairs.split(',');
  const arrVip = hall.number_vip_chairs.split(',');
  const navigate = useNavigate();
  const dateForTicket = useAppSelector(state => state.addTicket.dateForTicket);
  const isLoadingAllHall = useAppSelector(state => state.clientHallAll.isLoading);
  const errorMessageGetHallItem = useAppSelector(state => state.clientHallItem.errorMessage);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const data = {id: Number(prodId), signal: signal};
    document.body.classList.add(`${hallCss.bodyHome}`);
    try {
      dispatch(fetchClientGetHallElem(data));
    } catch (e) {
      const resultError = (e as Error).message;
      throw new Error('что-то пошло не так' + resultError);
    }
    return () => {
      controller.abort();
      document.body.classList.remove(`${hallCss.bodyHome}`);
    }
  }, [dispatch, prodId]);

  let currentSessionSource: Sessions | undefined = hall.sessions.find((ses) => ses['session_start_time'] === location.state.time);
  let currentSession: Sessions = {
    hall_id: 0,
    paid_chairs: '',
    film_id: 0,
    id: 0,
    created_at: '',
    updated_at: '',
    session_start_time: '',
    session_date: ''
  };

  if (currentSessionSource) {
    currentSession = JSON.parse(JSON.stringify(currentSessionSource));
  }

  if (currentSession.paid_chairs === null) {
    currentSession.paid_chairs = '.';
  }
  const arrPaid: string[] | undefined = currentSession.paid_chairs.split(',');

  if (isLoading || isLoadingAllHall || errorMessageGetHallItem) {
    return (
      <>
        <HeaderClient/>
        <main>
          <div style={{fontSize: "20px", color: "black"}}>Информация загружается. Пожалуйста, подождите.</div>
        </main>
      </>
    )
  }

  const handleClickToBookTicket = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const arrBuyChairParent = (e.target as HTMLElement).closest('.buying');
    let arrBuyChairs: Element[] = [];
    let paid: string[] | undefined = currentSession?.paid_chairs === '.' ? [] : currentSession?.paid_chairs.split(',');
    let totalSum = 0;
    const paidForTicket: string[] = [];
    const userSelectedPlacesForDeleteTicket: string[] = [];

    if (arrBuyChairParent) {
      const arrBuyChairsWithStatusDesc: NodeListOf<HTMLElement> | undefined = arrBuyChairParent?.querySelectorAll('.buying-scheme__chair');
      arrBuyChairs = Array.from(arrBuyChairsWithStatusDesc).filter((chair) => chair.hasAttribute('data-id'));

      const isSelected = arrBuyChairs.some((chair) => chair.classList.contains('buying-scheme__chair_selected'));

      if (isSelected === false) {
        dispatch(setIsActive(true));
        dispatch(setErrorMessage('Выберите места'));
        return;
      }

      for (let i = 0; i < arrBuyChairs.length; i++) {
        if (arrBuyChairs[i].classList.contains('buying-scheme__chair_selected')) {

          const id: string | null = arrBuyChairs[i].getAttribute('data-id');

          if (id) {
            paid?.push(id);
            userSelectedPlacesForDeleteTicket.push(id);
            paidForTicket.push(id);
          }

          if (arrBuyChairs[i].classList.contains('buying-scheme__chair_standart')) {
            totalSum += hall.price_standart_chair;
          } else if (arrBuyChairs[i].classList.contains('buying-scheme__chair_vip')) {
            totalSum += hall.price_vip_chair;
          }
        }
      }
    }
    dispatch(setSeatsForDeleteTicket(userSelectedPlacesForDeleteTicket.join(',')));

    const arrSeat: { row: number, col: string[] }[] = [];
    let chunkMulty: number[][] = [];
    const totalNumbersChairs = Array.from({length: hall.total_chairs}, (_, i) => i + 1);

    for (let i = 0; i < totalNumbersChairs.length; i += hall.chairs_in_row) {
      const chunk = totalNumbersChairs.slice(i, i + hall.chairs_in_row);
      chunkMulty.push(chunk);
    }

    paidForTicket.forEach((seat) => {
      for (let i = 0; i < chunkMulty.length; i++) {
        for (let j = 0; j < chunkMulty[i].length; j++) {
          if (chunkMulty[i][j] === +seat) {
            if (arrSeat.some((s) => s.row === i + 1)) {
              let seatFind = arrSeat.find((s) => s.row === i + 1);
              seatFind?.col.push(` ${j + 1}`);
            } else {
              arrSeat.push({row: i + 1, col: [String(j + 1)]})
            }
          }
        }
      }
    });

    const sessionUpdateData = {
      id: currentSession.id,
      hall_id: currentSession.hall_id,
      session_start_time: currentSession.session_start_time,
      film_id: currentSession.film_id,
      paid_chairs: paid.join(','),
      session_date: dateForTicket
    }

    dispatch(fetchSessionUpdate(sessionUpdateData));

    const dataTicket: Ticket = {
      film_title: location.state.filmTitle,
      hall_name: hall.name,
      start_time: location.state.time,
      total_price: totalSum,
      session_date: dateForTicket
    };

    const seatCopy = JSON.parse(JSON.stringify(arrSeat));

    const seatForRequest = seatCopy.map((seat: { row: number, col: string[] }) => {
      return {
        row: seat.row,
        col: seat.col.join(',')
      };
    });

    const ticketSeat: TicketSeat = {
      ticket_id: 0,
      seat: seatForRequest
    }

    dispatch(fetchAddTicket(dataTicket)).then((ticket) => {
      ticketSeat.ticket_id = ticket.payload.id;
      dispatch(fetchAddTicketSeats(ticketSeat))
    })

    dispatch(setTitleFilm(location.state.filmTitle));
    dispatch(setSeats(arrSeat));
    dispatch(sethallName(hall.name));
    dispatch(setStartTime(location.state.time));
    dispatch(setPrice(totalSum));
    navigate('/payment');
  }

  return (
    <>

      <HeaderClient/>
      <main>
        <section className="buying">
          <div className="buying__info">
            <div className="buying__info-description">
              <h2 className="buying__info-title">{location.state.filmTitle}</h2>
              <p className="buying__info-start">Начало сеанса: {location.state.time}</p>
              <p className="buying__info-hall">{hall.name}</p>
            </div>
            <div className="buying__info-hint">
              <p>Тапните дважды,<br/>чтобы увеличить</p>
            </div>
          </div>
          <div className="buying-scheme">
            <div className="buying-scheme__wrapper">
              {
                getChairChunk(getPlacesForClients(rows, chairInRows, arrStandart, arrVip, arrBlock, arrPaid), chairInRows).map((seat) => {
                  return (
                    <div className="buying-scheme__row" key={uuidv4()}>
                      {seat}
                    </div>
                  )
                })
              }
            </div>
            <div className="buying-scheme__legend">
              <div className="col">
                <p className="buying-scheme__legend-price">
                  <span className="buying-scheme__chair buying-scheme__chair_standart"/> Свободно
                  (<span className="buying-scheme__legend-value">{hall.price_standart_chair}</span>руб)
                </p>
                <p className="buying-scheme__legend-price">
                  <span className="buying-scheme__chair buying-scheme__chair_vip"/> Свободно VIP
                  (<span className="buying-scheme__legend-value">{hall.price_vip_chair}</span>руб)
                </p>
              </div>
              <div className="col">
                <p className="buying-scheme__legend-price">
                  <span className="buying-scheme__chair buying-scheme__chair_taken"/> Занято
                </p>
                <p className="buying-scheme__legend-price">
                  <span className="buying-scheme__chair buying-scheme__chair_selected"/> Выбрано
                </p>
              </div>
            </div>
          </div>
          <button className="acceptin-button" onClick={(e) => handleClickToBookTicket(e)}>Забронировать</button>
          {isTooltipActive && <Tooltip text={errorMessageTooltip} styleEl={styleError}/>}
        </section>
      </main>
    </>
  )
}

export default Hall;
