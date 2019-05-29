let fcl = require("fontChangeLetter.js");

function mailList(dataList, seachName) {
  let that = this;
  let mailList = [];
  let pinYinValue = seachName.toUpperCase();
  let pinYinArray = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "#"];
  for (let i = 0; i < pinYinArray.length; i++) {
    let code = pinYinArray[i];
    let anchor = "";
    if (code == "#") {
      anchor = "noLetter";
    } else {
      anchor = code;
    }
    let obj = {
      code: code,
      anchor: anchor,
      childList: []
    }
    mailList.push(obj);
  }
  for (let i = 0; i < dataList.length; i++) {
    let pinYinName = fcl.getPinYinByName(dataList[i].name).toUpperCase();
    if (dataList[i].name.indexOf(seachName) > -1 || pinYinName.indexOf(pinYinValue) > -1) {
      let code = fcl.getPinYinByName(dataList[i].name).split("")[0];
      for (let j = 0; j < mailList.length; j++) {
        if (code == mailList[j].code) {
          mailList[j].childList.push(dataList[i]);
        } else if (isNaN(code) == false) {
          if (mailList[j].code == "#") {
            mailList[j].childList.push(dataList[i]);
            break;
          }
        }
      }
    }
  }
  return mailList;
}

module.exports = {
  mailList: mailList
}