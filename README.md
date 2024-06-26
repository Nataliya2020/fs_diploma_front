[![Build status](https://ci.appveyor.com/api/projects/status/9fin9nwqbxxfq7sa?svg=true)](https://ci.appveyor.com/project/Nataliya2020/fs-diploma-front)

# Дипломная работа

## Клиетская часть

Для написания использовались React ^18.2.0, Reduxjs/toolkit ^1.9.3, Typescript ^4.9.5

После клонирования репозитория нужно установить зависимости, выполнив команду npm install.

Для настройки окружения необходимо скопировать файл .env.example, сохранить его как .env и прописать нужный порт.

Запустить код для выполнения в браузере можно выполнив команду npm run start. 

### Часть для посетителей

По умолчанию откроется окно для посетителей с навигатором по дням недели и ошибкой "что-то пошло не так", если подключения к серверу нет и надписью "сеансов пока нет" или с фильмами, залами и сеансами, заданными по умолчанию, если подключение есть. 

По умолчанию устанавливаются три фильма, три зала, три сеанса.

Незарегистрированному пользователю расписание фильмов доступно только после нажатия администратором на кнопку "Открыть продажу билетов" и успешной проверки наличия данных для отображения.

Для просмотра выбранного зала и бронирования билетов необходимо нажать на блок со временем сеанса. Откроется окно с выбранным залом, его местами, ценами. Для выбора места необходимо кликнуть по нему.

После нажатия на кнопку забронировать появится информация о билете с указанием названия фильма, номера ряда, номеров мест в ряду, названием зала, даты сеанса, времени начала сеанса, общей стоимости билетов.

После нажатия на кнопку "получить код бронирования" откроется информация о билете с qr-кодом, в котором эта информация будет так же отображена.

### Часть для администратора

Чтобы попасть в часть администратора необходимо в адресной строке браузера после номера порта записать строку обращения к администраторской части "HomeAdmin". Появится окно с предложением ввести емейл и пароль. По умолчанию миграцией заполнен емейл ""testAdmin@testAdmin.test" , пароль "123456789", имя "admin".

После успешных аутентификации и авторизации при запущенной серверной части на странице администратора будет доступно создание залов, редактирование мест в залах, удаление залов, установка цен, добавление фильмов, добавление сеансов.

По умолчанию миграциями в базу добавлены три зала, три фильма, три сеанса.

Залы можно создавать и удалять.

Количество мест в залах и их принадлежность к вип или стандартныи местам сначала сохраняется предварительно, затем можно произвести сброс к начальному состоянию, нажав кнопку отмена, либо сохранить зал на сервер, нажав на кнопку "сохранить".

Чтобы сохранить отредактированные цены в залах, нужно нажать на кнопку "сохранить", для сброса редактирования нужно нажать кнопку "отмена".

Фильмы и сеансы добавляются сначала предварительно, чтобы это было заметно они полупрозрачны. При нажатии на кнопку "отмена" - предварительно добавленные сессии и фильмы удаляются. При нажатии на кнопку "сохранить" сохраняются на сервер все предварительно добавленные фильмы и предварительно добавленные сеансы того дня, который выбран в навигаторе. Чтобы добавить сеансы для других дней необходимо выбрать нужный день и произвести сохранение на нем.

По умолчанию на кнопке открытия продажи билетов надпись "Открыть продажу билетов", при этом залы недоступны для просмотра пользователями. 
Чтобы продажа была доступна, должен быть создан хотя бы один зал, добавлены места во все созданные залы, установлены цены для всех залов, добавлен хотя бы один фильм и хотя бы один сеанс на дату, выбранную в навигаторе. 

После нажатия на кнопку "открыть продажу билетов" и успешной проверки на все необходимые данные надпись на кнопке поменяется на "Приостановить продажу билетов", для незарегистрированных пользователей станет доступно расписание.
