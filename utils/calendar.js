let util = require("util.js");
let currentMonthDateLen = 0,
  preMonthDateLen = 0,
  currentYear = new Date().getFullYear(),
  currentMonth = new Date().getMonth() + 1,
  startX = "",
  endX = "",
  moveFlag = true

function getDateLen(year, month) {
  let actualMonth = month - 1;
  let timeDistance = +new Date(year, month) - +new Date(year, actualMonth);
  return timeDistance / (1000 * 60 * 60 * 24);
}

function getFirstDateWeek(year, month) {
  return new Date(year, month - 1, 1).getDay();
}

function preMonth(year, month) {
  if (month == 1) {
    return {
      year: --year,
      month: 12
    }
  } else {
    return {
      year: year,
      month: --month
    }
  }
}

function nextMonth(year, month) {
  if (month == 12) {
    return {
      year: ++year,
      month: 1
    }
  } else {
    return {
      year: year,
      month: ++month
    }
  }
}

function getCurrentArray() {
  currentMonthDateLen = getDateLen(currentYear, currentMonth);
  let currentMonthDateArray = [];
  if (currentMonthDateLen > 0) {
    for (let i = 1; i <= currentMonthDateLen; i++) {
      currentMonthDateArray.push({
        month: 'current',
        time: util.setTime(currentYear + "-" + currentMonth + "-" + i, 3),
        date: i
      })
    }
  }
  return currentMonthDateArray;
}

function getPreArray() {
  let that = this;
  preMonthDateLen = getFirstDateWeek(currentYear, currentMonth);
  let preMonthDateArray = [];
  if (preMonthDateLen > 0) {
    let {
      year,
      month
    } = preMonth(currentYear, currentMonth)
    let date = getDateLen(year, month)
    for (let i = 0; i < preMonthDateLen; i++) {
      preMonthDateArray.unshift({
        month: 'pre',
        time: util.setTime(year + "-" + month + "-" + date, 3),
        date: date
      })
      date--
    }
  }
  return preMonthDateArray;
}

function getNextArray() {
  let nextMonthDateLen = 35 - preMonthDateLen - currentMonthDateLen; // 下月多余天数
  let nextMonthDateArray = []; // 定义空数组
  if (nextMonthDateLen > 0) {
    let {
      year,
      month
    } = nextMonth(currentYear, currentMonth)
    for (let i = 1; i <= nextMonthDateLen; i++) {
      nextMonthDateArray.push({
        month: 'next', // 只是为了增加标识，区分当、上月
        time: util.setTime(year + "-" + month + "-" + i, 3),
        date: i
      })
    }
  }
  return nextMonthDateArray;
}

function getDateArray() {
  let preArray = getPreArray();
  let currentArray = getCurrentArray();
  let nextArray = getNextArray();
  let dateArray = preArray.concat(currentArray).concat(nextArray);
  for (let i = 0; i < dateArray.length; i++) {
    if (dateArray[i].month == "pre" || dateArray[i].month == "next") {
      dateArray[i].date = "";
      dateArray[i].time = "";
    }
  }
  let res = {
    currentYear: currentYear,
    currentMonth: currentMonth,
    dateArray: dateArray
  }
  return res;
}

function getWeekDateArray(selectCurrentDate) {
  let preArray = getPreArray();
  let currentArray = getCurrentArray();
  let nextArray = getNextArray();
  let dateArray = preArray.concat(currentArray).concat(nextArray);
  let weekDateArray = [];
  for (let i = 0; i < dateArray.length; i++) {
    if (selectCurrentDate == dateArray[i].time) {
      if (i >= 0 && i < 7) {
        for (let j = 0; j < 7; j++) {
          weekDateArray.push(dateArray[j]);
        }
      } else if (i >= 7 && i <= 13) {
        for (let j = 7; j < 14; j++) {
          weekDateArray.push(dateArray[j]);
        }
      } else if (i >= 14 && i <= 20) {
        for (let j = 14; j < 21; j++) {
          weekDateArray.push(dateArray[j]);
        }
      } else if (i >= 21 && i <= 27) {
        for (let j = 21; j < 28; j++) {
          weekDateArray.push(dateArray[j]);
        }
      } else if (i >= 28 && i <= 34) {
        for (let j = 28; j < 35; j++) {
          weekDateArray.push(dateArray[j]);
        }
      }
    }
  }
  return weekDateArray;
}

function gotoSelectMonth(selectCurrentDate) {
  currentYear = new Date(selectCurrentDate).getFullYear();
  currentMonth = new Date(selectCurrentDate).getMonth() + 1;
}

function gotoCurrentMonth() {
  currentYear = new Date().getFullYear();
  currentMonth = new Date().getMonth() + 1;
}

function gotoPreMonth() {
  let {
    year,
    month
  } = preMonth(currentYear, currentMonth)
  currentYear = year;
  currentMonth = month;
}

function gotoNextMonth() {
  let {
    year,
    month
  } = nextMonth(currentYear, currentMonth)
  currentYear = year;
  currentMonth = month;
}

function touchStart(e) {
  startX = e.touches[0].pageX;
  moveFlag = true;
}

// 触摸移动事件
function touchMove(e) {
  endX = e.touches[0].pageX;
  if (moveFlag) {
    if (endX - startX > 50) {
      gotoPreMonth();
      moveFlag = false;
    }
    if (startX - endX > 50) {
      gotoNextMonth();
      moveFlag = false;
    }
  }
}

function touchEnd() {
  let that = this;
  moveFlag = true
}

module.exports = {
  getDateArray: getDateArray,
  getWeekDateArray: getWeekDateArray,
  gotoSelectMonth: gotoSelectMonth,
  gotoCurrentMonth: gotoCurrentMonth,
  touchStart: touchStart,
  touchMove: touchMove,
  touchEnd: touchEnd
}