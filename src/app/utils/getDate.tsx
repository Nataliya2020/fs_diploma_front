export function getDate() {
  const selectedDateLocStor = localStorage.getItem('selectedDay');
  let selectedDateParse: { dayNumber: string, dayName: string, dayDate: string } = {dayNumber: '', dayName: '', dayDate: ''};

  if (selectedDateLocStor) {
    try {
      selectedDateParse = JSON.parse(selectedDateLocStor);
    } catch (e) {
      throw new Error('Ошибка при извлечении данных');
    }
  }

  return selectedDateParse.dayDate;
}

