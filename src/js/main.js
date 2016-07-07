var cashTimer = {
  settings: {
    monthCash: "30000",
    dom: function() { return document.getElementById("cashTimer"); }
  },
  timing: {
    cashBeforeToday: 0,
    cashInDay: 0,
    cashToday: 0,
    cash: 0,
    oldDay: "",
    today: function () { return new Date(); }
  },
  functions: {
    getCashInDay: function (monthCash, monthLastDate) {
      cashTimer.timing.cashInDay = monthCash / monthLastDate;
    },
    getTodayCash: function (cashBeforeToday, cashInDay, today) {
      var mill = (today.getHours()*60*60*1000) + (today.getMinutes()*60*1000) + (today.getSeconds()*1000) + today.getMilliseconds(),
          cash = (cashInDay / 86400000) * mill;

      cashTimer.timing.cashToday = cash;
    },
    setOldDay: function () {
      cashTimer.timing.oldDay = cashTimer.timing.today();
    },
    getLastDate: function (date) {
      var dateMonth = date.getMonth() + 1,
          dateYear = date.getYear(),
          newDate = new Date(dateYear, dateMonth, 0);

      return newDate.getDate();
    },
    startCashTimer: function () {
      cashTimer.functions.getCashInDay(cashTimer.settings.monthCash, cashTimer.functions.getLastDate(cashTimer.timing.today()));
      cashTimer.functions.setOldDay();
      setInterval(function(){
        if (cashTimer.timing.today().getMonth() != cashTimer.timing.oldDay.getMonth()) {
          cashTimer.functions.setOldDay();
          cashTimer.functions.getCashInDay(cashTimer.settings.monthCash, cashTimer.functions.getLastDate(cashTimer.timing.today()));
        }

        cashTimer.functions.getTodayCash(cashTimer.timing.cashBeforeToday, cashTimer.timing.cashInDay, cashTimer.timing.today());
        cashTimer.timing.cash = cashTimer.timing.cashBeforeToday + cashTimer.timing.cashToday;
        
        cashTimer.settings.dom().innerHTML = cashTimer.timing.cash;
      },1);
    }
  }
};

