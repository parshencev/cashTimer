var cashTimer = {
  settings: {
    startDate: new Date(2015,5,28),
    notWorkingDays: [0, 6],
    startTime: {
      hours: 0,
      minutes: 20
    },
    endTime: {
      hours: 18,
      minutes: 25
    },
    monthCash: "30000"
  },
  timing: {
    cashBeforeToday: 0,
    cashInDay: 0,
    cashToday: 0,
    cash: 0,
    today: function () { return new Date(); }
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
  cashTimer.timing.lastRecalculationDay = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
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

function countTodayCash(today, startTime, endTime) {

  var cash = 0,
      todaySeconds = ((today.getHours() * 60) + today.getMinutes()) * 60 + today.getSeconds(),
      startTimeSeconds = ((startTime.hours * 60) + startTime.minutes) * 60,
      endTimeSeconds = ((endTime.hours * 60) + endTime.minutes) * 60,
      allDaySeconds = 24 * 60 * 60,
      cashInSecond = cashTimer.timing.cashInDay / (endTimeSeconds - startTimeSeconds);

  if (todaySeconds >= startTimeSeconds && todaySeconds <= endTimeSeconds) {
    cash = (todaySeconds - startTimeSeconds) * cashInSecond;
  }
  else {
    cash = cashTimer.timing.cashInDay;
  }

  return cash;
}

function startCashTimer () {
  setInterval(function(){
    var cash = cashTimer.timing.cashToday;

    if (cashTimer.timing.today().getFullYear() != cashTimer.timing.lastRecalculationDay.getFullYear() && cashTimer.timing.today().getMonth() != cashTimer.timing.lastRecalculationDay.getMonth() && cashTimer.timing.today().getDate() != cashTimer.timing.lastRecalculationDay.getDate()) {
      cashTimer.timing.cashBeforeToday=countCash(getAllDates(cashTimer.settings.startDate, cashTimer.timing.today()).months, cashTimer.settings.notWorkingDays, cashTimer.settings.monthCash, cashTimer.timing.today());
    }

    cashTimer.timing.cashToday = countTodayCash(cashTimer.timing.today(), cashTimer.settings.startTime, cashTimer.settings.endTime);

    if (cashTimer.timing.cashToday != cash) {
      cashTimer.timing.cash = cashTimer.timing.cashBeforeToday + cashTimer.timing.cashToday;
    }
    console.log(cashTimer.timing.cash);
  },1000);
}

window.addEventListener("DOMContentLoaded", function(){
  cashTimer.timing.cashBeforeToday=countCash(getAllDates(cashTimer.settings.startDate, cashTimer.timing.today()).months, cashTimer.settings.notWorkingDays, cashTimer.settings.monthCash, cashTimer.timing.today());
  startCashTimer();
});
