var cashTimer = {
  settings: {
    startDate: new Date(2015,5,28),
    notWorkingDays: [0, 6],
    startTime: {
      hours: 7,
      minutes: 30
    },
    endTime: {
      hours: 18,
      minutes: 25
    },
    monthCash: "30000"
  },
  timing: {
    cash: 0,
    cashInDay: 0,
    today: new Date()
  }
};

function getAllDates(startDate, endDate) {
  var years  = endDate.getFullYear() - startDate.getFullYear(),
      months = 0,
      days   = 0,
      year   = startDate.getFullYear(),
      month  = startDate.getMonth(),
      day    = startDate.getDate(),
      dateArray = [],
      monthsArray = [];

  for (var y = startDate.getFullYear(); y <= endDate.getFullYear(); y++) {

    if (y == startDate.getFullYear()) {
      months = startDate.getMonth();
    }
    else if (y == endDate.getFullYear()) {
      months = endDate.getMonth();
    }
    else {
      months = 11;
    }

    for (var m = 0; m <= months; m++) {
      days = new Date(y,m,0).getDate();
      monthsArray.push(m);

      for (var d = 1; d <= days; d++) {
        dateArray.push(new Date(y,m,d));
      }
    }

  }

  return Object({dates: dateArray, months: monthsArray});
}

function countCash (monthsArray, notWorkingDays, monthCash, today) {
  var todays = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate(),
      todayMonthNotWorkingDays = 0,
      cash = (monthsArray.length - 1) * monthCash,
      workingDaysInMonth = countWorkingDaysInMonth(new Date(today.getFullYear(), today.getMonth() + 1, 1), new Date(today.getFullYear(), today.getMonth() + 1, 0), notWorkingDays),
      workingDaysInMonthBeforeToday = countWorkingDaysInMonth(new Date(today.getFullYear(), today.getMonth() + 1, 1), new Date(today.getFullYear(), today.getMonth() + 1, today.getDate() - 1), notWorkingDays);

  cashTimer.timing.cashInDay = monthCash / workingDaysInMonth;
  cash += workingDaysInMonthBeforeToday * cashTimer.timing.cashInDay;

  return cash;
}

function countWorkingDaysInMonth (startDate, endDate, notWorkingDays) {
  var countNotWorkingDays = 0;

  for (var d = startDate.getDate(); d <= endDate.getDate(); d++) {
    var date = new Date(startDate.getFullYear(), startDate.getMonth() + 1, d);

    notWorkingDays.map(function(day){
      if (day == date.getDay()) {
        countNotWorkingDays++;
      }
    });
  }
  if (startDate.getDate() == 1) {
    return endDate.getDate() - countNotWorkingDays;
  }
  return endDate.getDate() - startDate.getDate() - countNotWorkingDays;
}

function serchInArray (value, array) {
  for (var i = 0; i < array.length; i++) {
    if (value == array[i]) {
      return true;
    }

    return false;
  }
}

function countTodayCash(today, startTime, endTime, monthCash) {

  var cash = 0,
      todaySeconds = ((today.getHours() * 60) + today.getMinutes()) * 60,
      startTimeSeconds = ((startTime.hours * 60) + startTime.minutes) * 60,
      endTimeSeconds = ((endTime.hours * 60) + endTime.minutes) * 60,
      allDaySeconds = 24 * 60 * 60,
      cashInSecond = cashTimer.timing.cashInDay / (endTimeSeconds - startTimeSeconds);

  if (todaySeconds >= startTimeSeconds && todaySeconds <= endTimeSeconds) {
    cash = (todaySeconds - startTimeSeconds) * cashInSecond;
  }

  return cash;
}

window.addEventListener("DOMContentLoaded", function(){
  cashTimer.timing.cash=countCash(getAllDates(cashTimer.settings.startDate, cashTimer.timing.today).months, cashTimer.settings.notWorkingDays, cashTimer.settings.monthCash, cashTimer.timing.today);
  cashTimer.timing.cash+=countTodayCash(cashTimer.timing.today, cashTimer.settings.startTime, cashTimer.settings.endTime);
});
