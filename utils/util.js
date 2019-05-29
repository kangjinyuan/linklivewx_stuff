function setTime(time, flag) {
  if (typeof(time) == "string") {
    time = time.substring(0, 19);
    time = time.replace(/-/g, '/');
  } else {
    time = time;
  }
  let date = new Date(time);
  let Y = date.getFullYear();
  let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  let D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
  let h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours());
  let m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes());
  let s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
  if (flag == 0) {
    return Y + "-" + M + "-" + D + " " + h + ":" + m + ":" + s;
  } else if (flag == 1) {
    return Y + "-" + M + "-" + D + " " + h + ":" + m;
  } else if (flag == 2) {
    return Y + "-" + M + "-" + D + " " + h;
  } else if (flag == 3) {
    return Y + "-" + M + "-" + D;
  } else if (flag == 4) {
    return Y + "-" + M;
  } else if (flag == 5) {
    return Y;
  }
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  setTime: setTime
}