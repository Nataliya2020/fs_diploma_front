export function setLocStDayData(selectedDay: { dayNumber: string, dayName: string, dayDate: string }) {
  localStorage.setItem('selectedDay', JSON.stringify(selectedDay));
}
