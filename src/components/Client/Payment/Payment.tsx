import * as React from 'react';
import HeaderClient from '../HeaderClient/HeaderClient';
import {useAppSelector} from '../../../app/hooks';
import hallCss from '../Hall/Hall.module.css';
import {useNavigate} from 'react-router-dom';
import {getDateForUser} from '../../../app/utils/getDateForUser';
import HandleFetchError from '../../HandleFetchError/HandleFetchError';
import {useEffect} from "react";

function Payment() {
  const filmTitle = useAppSelector(state => state.addTicket.titleFilm);
  const seats = useAppSelector(state => state.addTicket.seats);
  const hallName = useAppSelector(state => state.addTicket.hallName);
  const startTime = useAppSelector(state => state.addTicket.startTime);
  const price = useAppSelector(state => state.addTicket.price);
  const navigate = useNavigate();
  const date = useAppSelector(state => state.addTicket.dateForTicket);
  const isLoadingUpdateSession = useAppSelector(state => state.sessionUpdateCLient.isLoading);
  const isLoadingAddTicket = useAppSelector(state => state.addTicket.isLoading);
  const isLoadingBookSeats = useAppSelector(state => state.addTicket.isLoading);
  const isErrorFetchSesUpdate = useAppSelector(state => state.sessionUpdateCLient.isErroneousUpdateSession);
  const isFetchErrorAddTicket = useAppSelector(state => state.addTicket.isErroneousAddTicket);
  const isFetchErrorAddSeatsTicket = useAppSelector(state => state.ticketAddSeats.isErroneousAddTicketSeats);

  const dateTicket = getDateForUser(date);

  useEffect(() => {
    document.body.classList.add(`${hallCss.bodyHome}`)

    return () => {
      document.body.classList.remove(`${hallCss.bodyHome}`)
    }
  }, [])

  if (isLoadingUpdateSession || isLoadingAddTicket || isLoadingBookSeats) {
    return (
      <>
        <HeaderClient/>
        <main>
          <section className="ticket">

            <header className="tichet__check">
              <h2 className="ticket__check-title">Вы выбрали билеты:</h2>
            </header>
            <div style={{textAlign: "center", fontSize: "20px"}}><p>Информация загружается, пожалуйста, подождите.</p>
            </div>
          </section>
        </main>
      </>
    )
  }

  if (isErrorFetchSesUpdate || isFetchErrorAddTicket || isFetchErrorAddSeatsTicket) {
    return (
      <>
        <HeaderClient/>
        <HandleFetchError/>
      </>
    )
  }

  const handleClickGetTicketQR = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    navigate("/ticket");
  }

  return (
    <>
      <HeaderClient/>
      <main>
        <section className="ticket">

          <header className="tichet__check">
            <h2 className="ticket__check-title">Вы выбрали билеты:</h2>
          </header>

          <div className="ticket__info-wrapper">
            <p className="ticket__info">На фильм: <span className="ticket__details ticket__title"> {filmTitle}</span>
            </p>
            <p className="ticket__info">Места:
              <span
                className="ticket__details ticket__chairs"> {seats.map((seat) => ` Ряд: ${seat.row} Места: ${seat.col}. `)}
              </span>
            </p>
            <p className="ticket__info">В зале: <span className="ticket__details ticket__hall"> {hallName}</span></p>
            <p className="ticket__info">Дата сеанса: <span
              className="ticket__details ticket__start"> {dateTicket}</span>
            </p>
            <p className="ticket__info">Начало сеанса: <span
              className="ticket__details ticket__start"> {startTime}</span></p>
            <p className="ticket__info"> Стоимость: <span
              className="ticket__details ticket__cost"> {price}</span> рублей
            </p>

            <button className="acceptin-button" onClick={(e) => handleClickGetTicketQR(e)}>Получить код бронирования
            </button>

            <p className="ticket__hint">После оплаты билет будет доступен в этом окне, а также придёт вам на почту.
              Покажите QR-код нашему контроллёру у входа в зал.
            </p>
            <p className="ticket__hint">Приятного просмотра!</p>
          </div>
        </section>
      </main>
    </>
  )
}

export default Payment;
