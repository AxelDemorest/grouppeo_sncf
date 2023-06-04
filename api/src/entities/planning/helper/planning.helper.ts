import * as moment from 'moment';

export const diffHour = (firstHour, secondHour) => {
  const [h1, m1] = firstHour.split('H').map(Number);
  const [h2, m2] = secondHour.split('H').map(Number);
  const diff = (h2 - h1) * 60 + (m2 - m1);
  return diff >= 25;
};

export const setEndTime = (hour) => {
  const newHour = moment(hour.replace('H', ':'), 'H:mm')
    .add(7, 'hours')
    .add(45, 'minutes');
  return newHour.format('H:mm');
};
