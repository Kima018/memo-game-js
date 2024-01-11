$(document).ready(function () {
  let time = new Date();
  console.log(time);
  let currentHours = time.getHours();
  let currentMinutes = time.getMinutes();
  let currentTime = `${currentHours < 10 ? "0" : ""}${currentHours}:${
    currentMinutes < 10 ? "0" : ""
  }${currentMinutes}`;
  console.log(currentTime);

  $("#nav-time").text(currentTime);

  let startButton = $("#start-game").click(function () {
    start();
  });
  let stopButton = $("#stop-game").click(function () {
    stop();
  });

  let game = false;
  console.log(game);

  const start = () => {
    game = true;
    console.log(game);
  };
  const stop = () => {
    game = false;
    console.log(game);
  };
});
