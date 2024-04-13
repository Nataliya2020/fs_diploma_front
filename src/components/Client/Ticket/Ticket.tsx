import * as React from 'react';
import {useAppSelector, useAppDispatch} from '../../../app/hooks';
import hallCss from '../Hall/Hall.module.css';
import HeaderClient from '../HeaderClient/HeaderClient';
import {fetchGetTicket} from '../../../store/slices/slicesClient/ticketGetReducer';
import {QRCodeSVG} from 'qrcode.react';
import {getDateForUser} from '../../../app/utils/getDateForUser';
import HandleFetchError from '../../HandleFetchError/HandleFetchError';
import {useEffect} from "react";

function Ticket() {
  const dispatch = useAppDispatch();
  const ticketId = useAppSelector(state => state.addTicket.ticketId);
  const ticket = useAppSelector(state => state.ticket.ticket);
  const isLoadingTicket = useAppSelector(state => state.ticket.isLoading);
  const isErroneousGetTicket = useAppSelector(state => state.ticket.isErroneousGetTicket);
  const errorMesageGetTicket = useAppSelector(state => state.ticket.errorMessage);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const data = {id: ticketId, signal: signal};

    document.body.classList.add(`${hallCss.bodyHome}`)
    dispatch(fetchGetTicket(data));

    return () => {
      controller.abort();
      document.body.classList.remove(`${hallCss.bodyHome}`)
    }
  }, [dispatch, ticketId])

  if (isLoadingTicket || errorMesageGetTicket) {
    return (
      <>
        <HeaderClient/>
        <main>
          <section className="ticket">
            <header className="tichet__check">
              <h2 className="ticket__check-title">Электронный билет</h2>
            </header>
            <div style={{fontSize: "20px", color: "black"}}>Информация загружается. Пожалуйста, подождите.</div>
          </section>
        </main>
      </>
    )
  }

  const date = getDateForUser(ticket.session_date);

  if (isErroneousGetTicket && errorMesageGetTicket !== 'The user aborted a request.') {
    return (
      <>
        <HeaderClient/>
        <HandleFetchError/>
      </>
    )
  }

  return (
    <>
      <HeaderClient/>
      <main>
        <section className="ticket">
          <header className="tichet__check">
            <h2 className="ticket__check-title">Электронный билет</h2>
          </header>
          <div className="ticket__info-wrapper">
            {
              isLoadingTicket ?
                <div><p>Информация загружается. Пожалуйста, подождите</p></div> :
                <>
                  <p className="ticket__info">На фильм:
                    <span className="ticket__details ticket__title"> {ticket.film_title}</span>
                  </p>
                  <p className="ticket__info">Место:
                    <span className="ticket__details ticket__chairs">{ticket.seats_ticket
                      .map((seat) => ` Ряд: ${seat.row} Места: ${seat.seats_numbers}.`)}
                    </span>
                  </p>
                  <p className="ticket__info">В зале:
                    <span className="ticket__details ticket__hall"> {ticket.hall_name}
                    </span>
                  </p>

                  <p className="ticket__info">Дата сеанса:
                    <span className="ticket__details ticket__start"> {date}
                    </span>
                  </p>
                  <p className="ticket__info">Начало сеанса:
                    <span className="ticket__details ticket__start"> {ticket.start_time}
                    </span>
                  </p>

                  <QRCodeSVG
                    className="ticket__info-qr"
                    value={'Фильм: ' + ticket.film_title + '. Зал: ' + ticket.hall_name + '. Место: ' + ticket.seats_ticket
                      .map((seat) => ' Ряд: ' + seat.row + ', Места: ' + seat.seats_numbers + '. ') + ' Дата: ' + date + '. Время начала: ' + ticket.start_time + '.'}
                  />,
                </>
            }
            <p className="ticket__hint">Покажите QR-код нашему контроллеру для подтверждения бронирования.</p>
            <p className="ticket__hint">Приятного просмотра!</p>
          </div>
        </section>
      </main>
    </>
  )
}

export default Ticket;
