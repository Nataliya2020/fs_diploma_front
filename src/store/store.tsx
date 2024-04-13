import {configureStore} from '@reduxjs/toolkit';
import loginReducer from './slices/slicesAdmin/loginReducer';
import hallAllReducer from './slices/slicesAdmin/hallAllReducer';
import hallDeleteReducer from './slices/slicesAdmin/hallDeleteReducer';
import hallUpdateReducer from './slices/slicesAdmin/hallUpdateReducer';
import filmAllReducer from './slices/slicesAdmin/filmAllReducer';
import filmAddReducer from './slices/slicesAdmin/filmAddReducer';
import sessionAddReducer from './slices/slicesAdmin/sessionAddReducer';
import sessionDeleteReducer from './slices/slicesAdmin/sessionDeleteReducer';
import filmAllForClientReducer from './slices/slicesClient/filmAllForClientReducer';
import sessionAllForClientReducer from './slices/slicesClient/sessionAllForClientReducer';
import hallAllForClientReducer from './slices/slicesClient/hallAllForClientReducer';
import hallForClientReducer from './slices/slicesClient/hallForClientReducer';
import sessionsAllReducerAdmin from './slices/slicesAdmin/sessionsAllReducerAdmin';
import addTicketReducer from './slices/slicesClient/addTicketReducer';
import tooltipReducer from './slices/tooltipReducer';
import ticketSeatsAddReducer from './slices/slicesClient/ticketSeatsAddReducer';
import ticketGetReducer from './slices/slicesClient/ticketGetReducer';
import validationFormReducer from './slices/validationFormReducer';
import infoFinalActionCrud from './slices/infoFinalActionCrud';
import filmDeleteReducer from './slices/slicesAdmin/filmDeleteReducer';
import seatAddReducerAdmin from './slices/slicesAdmin/seatAddReducerAdmin';
import infoReducer from './slices/infoReducer';
import hallAddReducer from './slices/slicesAdmin/hallAddReducer';
import sessionUpdateReducer from './slices/slicesClient/sessionUpdateReducer';

const store = configureStore({
  reducer: {
    addFilm: filmAddReducer,
    addSession: sessionAddReducer,
    addTicket: addTicketReducer,
    clientHallItem: hallForClientReducer,
    clientHallAll: hallAllForClientReducer,
    clientFilmsAll: filmAllForClientReducer,
    clientSessionAll: sessionAllForClientReducer,
    deleteFilm: filmDeleteReducer,
    deleteHall: hallDeleteReducer,
    deleteSession: sessionDeleteReducer,
    infoFinalCrud: infoFinalActionCrud,
    infoReducer: infoReducer,
    filmsAll: filmAllReducer,
    hallsAll: hallAllReducer,
    hallAdd: hallAddReducer,
    login: loginReducer,
    sessionAllAdmin: sessionsAllReducerAdmin,
    sessionUpdateCLient: sessionUpdateReducer,
    seatsAdd: seatAddReducerAdmin,
    ticket: ticketGetReducer,
    ticketAddSeats: ticketSeatsAddReducer,
    tooltip: tooltipReducer,
    updateHall: hallUpdateReducer,
    validationForm: validationFormReducer,
  },
})

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
