function getIdHallId(e: EventTarget): string {
  const parent = (e as HTMLElement).closest('.conf-step__wrapper');

  let idHall = '';

  if (parent) {
    const hallsArray = parent.querySelectorAll('[name="prices-hall"]');

    Array.from(hallsArray).forEach((hall) => {
      if (hall.hasAttribute('checked')) {
        idHall = hall.getAttribute('id') ?? '';
        return idHall;
      }
      return idHall;
    })
    return idHall;
  }
  return idHall;
}

export default getIdHallId;
