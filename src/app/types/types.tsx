export type SaveAdminInputData = {
  id: string,
  title: string,
  movie_duration: number,
  description: string,
  country_of_origin: string,
  image: string,
  isAddedAdmin: boolean;
}

export type AddSessionData = {
  hall: number,
  start: number,
  end: number
}

export type SaveAdminInputSessions = {
  id: string,
  hall_id: number,
  film_id: number | string,
  session_start_time: string,
  isAddedAdmin: boolean,
  dateSession: string
}

export type Session = {
  film_id: number,
  hall_id: number,
  id: string,
  isAddedAdmin: boolean,
  session_start_time: string
}

export type UpdateSeats = {
  hall_id: number,
  seat_number: number,
  is_vip_chairs: boolean,
  is_standard_chairs: boolean
}

export type HallName = {
  name: string,
  sessions: string[]
}

export type HallsForFilmRender = {
  [id: string]: HallName
}

export type FilmForRender = {
  title: string | undefined,
  description: string | undefined,
  image: string | undefined,
  country_of_origin: string | undefined,
  movie_duration: number | undefined,
  halls: HallsForFilmRender[],
}

export type RenderFilms = {
  [id: number]: FilmForRender
}

export type Ticket = {
  film_title: string,
  hall_name: string,
  start_time: string,
  total_price: number,
  session_date: string
}

export type Seat = {
  row: number,
  col: string[]
}

export type TicketSeat = {
  ticket_id: number,
  seat: Seat[]
}
