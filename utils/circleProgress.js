function drawProgressBg(id) {
  wx.createSelectorQuery().select('#' + id).boundingClientRect(function(rect) {
    let radius = (rect.width - 20) / 2;
    let widthHalf = rect.width / 2;
    let ctx = wx.createCanvasContext(id);
    ctx.setLineWidth(10);
    ctx.setStrokeStyle('#ccc');
    ctx.setLineCap('round');
    ctx.beginPath();
    ctx.arc(widthHalf, widthHalf, radius, 0, 2 * Math.PI, false);
    ctx.stroke();
    ctx.draw();
  }).exec()
}

function drawProgress(id, rate, startColor, endColor) {
  wx.createSelectorQuery().select('#' + id).boundingClientRect(function(rect) {
    let radius = (rect.width - 20) / 2;
    let widthHalf = rect.width / 2;
    let context = wx.createCanvasContext(id);
    let gradient = context.createLinearGradient(widthHalf, 0, widthHalf, rect.width);
    gradient.addColorStop(0, startColor);
    gradient.addColorStop(1, endColor);
    context.setLineWidth(10);
    context.setStrokeStyle(gradient);
    context.setLineCap('round');
    context.beginPath();
    context.arc(widthHalf, widthHalf, radius, -Math.PI / 2, rate * 2 * Math.PI - (Math.PI / 2), false);
    context.stroke();
    context.draw()
  }).exec()
}

function runProgress(id, actualCount, totalCount, startColor, endColor) {
  let step = 0;
  let timer1 = setInterval(function() {
    step += 0.2;
    if (step > totalCount) {
      clearInterval(timer1);
      let timer2 = setInterval(function() {
        step -= 0.1;
        if (step < actualCount) {
          clearInterval(timer2);
        } else {
          drawProgress(id, step / totalCount, startColor, endColor);
        }
      }, 20)
    }
    drawProgress(id, step / totalCount, startColor, endColor);
  }, 20);
}

module.exports = {
  drawProgressBg: drawProgressBg,
  drawProgress: drawProgress,
  runProgress: runProgress
}