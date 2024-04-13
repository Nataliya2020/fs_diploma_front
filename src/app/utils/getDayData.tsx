export function getDayData(listNavElems: NodeListOf<Element>, chosenInd: number): {
  dayNumber: string,
  dayName: string,
  dayDate: string
} {

  return {
    dayNumber: Array.from(listNavElems)[chosenInd]?.querySelector('.page-nav__day-number')?.textContent as string,
    dayName: Array.from(listNavElems)[chosenInd].querySelector('.page-nav__day-week')?.textContent as string,
    dayDate: Array.from(listNavElems)[chosenInd].getAttribute('data-date') as string
  }
}
