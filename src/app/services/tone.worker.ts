/// <reference lib="webworker" />

let timerID = null;
let interval = 100;

addEventListener('message', async ({ data }) => {
  if (data == 'start') {
    timerID = setInterval(function () {
      postMessage('tick');
    }, interval);
  } else if (data.interval) {
    interval = data.interval;
    if (timerID) {
      clearInterval(timerID);
      timerID = setInterval(function () {
        postMessage('tick');
      }, interval);
    }
  } else if (data == 'stop') {
    clearInterval(timerID);
    timerID = null;
  }
});
