import {v4 as uuidv4} from 'uuid';
import {Link} from 'react-router-dom';
import * as React from 'react';
import {useAppSelector, useAppDispatch} from '../../app/hooks';
import createObjFilmForRender from '../../app/utils/createObjFilmForRender';
import {useNavigate} from 'react-router-dom';
import {RenderFilms} from '../../app/types/types';
import {setDateForTicket} from '../../store/slices/slicesClient/addTicketReducer';

function Main({date = ''}): JSX.Element {
  const dispatch = useAppDispatch();
  const sessions = useAppSelector(state => state.clientSessionAll.sessionsElems);
  const halls = useAppSelector(state => state.clientHallAll.hallElems);
  const films = useAppSelector(state => state.clientFilmsAll.filmElems);
  const navigate = useNavigate();
  const isLoadingSession = useAppSelector(state => state.clientSessionAll.isLoading);
  const isLoadingFilms = useAppSelector(state => state.clientFilmsAll.isLoading);
  const isLoadingHalls = useAppSelector(state => state.clientHallAll.isLoading);
  const errorMessageGetSessions = useAppSelector(state => state.clientSessionAll.errorMessage);

  let filmsItemForRender: RenderFilms = {};

  if (sessions.length !== 0) {
    filmsItemForRender = createObjFilmForRender(films, sessions, halls);
  }

  const handleClickLink = (e: React.MouseEvent<HTMLElement, MouseEvent>, id: number, ses: string) => {
    e.preventDefault();
    dispatch(setDateForTicket(date))
    let titleFilm: string | null = '';

    if (e.target instanceof HTMLElement) {
      const parent = e.target.closest('.movie');
      const titleEl = parent && parent.querySelector('.movie__title');
      const text = titleEl && titleEl.textContent;
      titleFilm = text && text;
    }
    navigate(`/hall/${id}`, {state: {filmTitle: titleFilm, time: ses}});
  }

  return (
    <>
      {
        isLoadingFilms || isLoadingHalls || isLoadingSession || errorMessageGetSessions === "The user aborted a request." ?
          <main>
            <div><p>Сеансы загружаются. Пожалуйста, подождите</p></div>
          </main> :
          <main>
            {
              ((sessions.length === 0 || halls.length === 0 || halls[0].is_active === 0) && errorMessageGetSessions !== "The user aborted a request.") ?
                <div style={{fontSize: "20px", color: "white", textAlign: "center"}}>Сеансов пока нет.</div> :
                Object.keys(filmsItemForRender).length === 0 ? null : Object.keys(filmsItemForRender).map((film) => {
                  return (
                    <section className="movie" key={film}>
                      <div className="movie__info">
                        <div className="movie__poster">
                          <img className="movie__poster-image" alt={filmsItemForRender[Number(film)].title + " постер"}
                               src={filmsItemForRender[Number(film)].image}
                          />
                        </div>
                        <div className="movie__description">
                          <h2 className="movie__title">{filmsItemForRender[Number(film)].title}</h2>
                          <p className="movie__synopsis">{filmsItemForRender[Number(film)].description}</p>
                          <p className="movie__data">
                            <span
                              className="movie__data-duration">{`${filmsItemForRender[Number(film)].movie_duration} минут `}
                            </span>
                            <span
                              className="movie__data-origin">{filmsItemForRender[Number(film)].country_of_origin}
                            </span>
                          </p>
                        </div>
                      </div>

                      {
                        filmsItemForRender[Number(film)].halls.length === 0 ? null : filmsItemForRender[Number(film)].halls.map((hall) => {
                            const hallAndSessionJsx = Object.keys(hall).map((idHall) => {
                              const numberIdHall = Number(idHall);

                              return (
                                <div className="movie-seances__hall" key={uuidv4()}>
                                  <h3 className="movie-seances__hall-title">{hall[numberIdHall].name}</h3>

                                  <ul className="movie-seances__list">
                                    {
                                      hall[numberIdHall].sessions.sort((a, b) => a.localeCompare(b)).map((ses) => {
                                          return (
                                            <li className="movie-seances__time-block" key={uuidv4()}
                                                onClick={(e) => handleClickLink(e, numberIdHall, ses)}>
                                              <Link to="#" className="movie-seances__time"
                                                    onContextMenu={(e) => e.preventDefault()}>{ses}</Link>
                                            </li>
                                          )
                                        }
                                      )
                                    }
                                  </ul>
                                </div>
                              )
                            })
                            return (
                              <React.Fragment key={uuidv4()}>
                                {hallAndSessionJsx}
                              </React.Fragment>
                            )
                          }
                        )}
                    </section>
                  )
                })
            }
          </main>
      }
    </>
  )
}

export default Main;
