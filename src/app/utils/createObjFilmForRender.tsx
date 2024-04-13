import {Sessions} from '../../store/slices/slicesClient/sessionAllForClientReducer';
import {Films} from '../../store/slices/slicesClient/filmAllForClientReducer';

type SessionItem = {
  film_id: number,
  hall_id: number,
  id: number,
  session_start_time: string,
};

type HallName = {
  name: string,
  sessions: string[]
}

type HallsForFilmRender = {
  [id: string]: HallName
}

type FilmForRender = {
  title: string | undefined,
  description: string | undefined,
  image: string | undefined,
  country_of_origin: string | undefined,
  movie_duration: number | undefined,
  halls: HallsForFilmRender[],
}

type RenderFilms = {
  [id: number]: FilmForRender
}

type SessionsWithUpdateAndCreated = Sessions & {
  created_at: string,
  updated_at: string | null,
}

type HallElem = {
  id: number,
  name: string,
  rows: number,
  chairs_in_row: number,
  total_chairs: number,
  blocked_chairs: string,
  number_standard_chairs: string,
  number_vip_chairs: string,
  created_at: string,
  updated_at: string | null,
  price_standart_chair: number,
  price_vip_chair: number,
  sessions: SessionsWithUpdateAndCreated[] | [],
  films: Films[] | []
}

function createObjFilmForRender(films: Films[], sessions: SessionItem[], halls: HallElem[]): {} {
  let filmsForSess: Films[] = [];
  let sessionsArray: SessionItem[][] = [];
  let idFilmForSes = 0;
  let filmsItemForRender: RenderFilms = {};
  let hallsWithSessions: HallElem[] = [];
  let sessionsArrayOneDimensional: SessionItem[] = [];

  films.forEach((film) => {

    if (sessions[0]?.id !== 0) {
      const filmArrayItem: SessionItem[] = sessions.filter((session) => film.id === session.film_id);
      filmArrayItem.length !== 0 && sessionsArray.push(filmArrayItem);
    }
  });

  sessionsArrayOneDimensional = sessionsArray.flat();

  halls.forEach((hall) => {
    sessionsArrayOneDimensional.forEach((ses) => {
      if (ses.hall_id === hall.id) {
        hallsWithSessions.push(hall);
      }
    })
  });

  sessionsArrayOneDimensional.forEach((sessionItem) => {
    films.forEach((film) => {
      if (film.id === sessionItem.film_id) {
        filmsForSess.push(film);
      }
    });

    idFilmForSes = sessionItem.film_id;

    filmsItemForRender[idFilmForSes] = {
      country_of_origin: '',
      description: '',
      halls: [{
        '': {
          name: '',
          sessions: []
        }
      }],
      image: '',
      movie_duration: 0,
      title: '',
    };

    filmsItemForRender[idFilmForSes]['title'] = films.find((film) => film.id === idFilmForSes)?.title;
    filmsItemForRender[idFilmForSes]['description'] = films.find((film) => film.id === idFilmForSes)?.description;
    filmsItemForRender[idFilmForSes]['image'] = films.find((film) => film.id === idFilmForSes)?.image;
    filmsItemForRender[idFilmForSes]['country_of_origin'] = films.find((film) => film.id === idFilmForSes)?.country_of_origin;
    filmsItemForRender[idFilmForSes]['movie_duration'] = films.find((film) => film.id === idFilmForSes)?.movie_duration;

    filmsItemForRender[idFilmForSes]['halls'] = [];
  });

  filmsForSess = Array.from(new Set(filmsForSess));

  filmsForSess.forEach((film) => {
    let filmId = film.id;

    sessionsArrayOneDimensional.forEach((ses) => {
      let hallForSesId = 0;
      let hallNameForSes = '';

      if (film.id === ses.film_id) {
        hallForSesId = ses.hall_id;
      }

      const hallFind = hallsWithSessions.find((hall) => hall.id === hallForSesId);

      if (hallFind !== undefined) {
        hallNameForSes = hallFind.name;
      }

      if (hallForSesId !== 0 && filmsItemForRender[filmId]['halls'].some((el) => el[hallForSesId]?.name === hallNameForSes) === false) {
        filmsItemForRender[filmId]['halls'].push({[hallForSesId]: {name: hallNameForSes, sessions: [ses.session_start_time]}});

      } else if (hallForSesId !== 0 && filmsItemForRender[filmId]['halls'].some((el) => el[hallForSesId]?.name === hallNameForSes)) {
        let hallIndex = filmsItemForRender[filmId]['halls'].findIndex((hall) => hall[hallForSesId]?.name === hallNameForSes);
        filmsItemForRender[filmId]['halls'][hallIndex][hallForSesId].sessions.push(ses.session_start_time);
      }
    });
  });

  return filmsItemForRender;
}

export default createObjFilmForRender;
