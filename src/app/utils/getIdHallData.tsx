function getIdHallData(e: EventTarget): [string, Element[]] {
  const parent = (e as HTMLElement).closest('.conf-step__wrapper');

  let idHall = '';
  let chairsArray: Element[] = [];

  if (parent) {
    const hallsArray = parent.querySelectorAll('.conf-step__radio');
    const chairsArrayWithDescription = parent.querySelectorAll('.conf-step__chair');
    chairsArray = Array.from(chairsArrayWithDescription).filter((chair) => chair.hasAttribute('data-id'));

    Array.from(hallsArray).forEach((hall) => {
      if (hall.hasAttribute('checked')) {
        idHall = hall.getAttribute('data-id') ?? '';
        return idHall;
      }
      return idHall;
    })
    return [idHall, chairsArray];
  }
  return [idHall, chairsArray];
}

export default getIdHallData;
