$(document).ready(function () {
  const data = [
    {
      name: "php",
      img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/php-logo_1.png",
      id: 1,
    },
    {
      name: "css3",
      img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/css3-logo.png",
      id: 2,
    },
    {
      name: "html5",
      img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/html5-logo.png",
      id: 3,
    },
    {
      name: "jquery",
      img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/jquery-logo.png",
      id: 4,
    },
    {
      name: "javascript",
      img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/js-logo.png",
      id: 5,
    },
    {
      name: "node",
      img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/nodejs-logo.png",
      id: 6,
    },
    {
      name: "photoshop",
      img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/photoshop-logo.png",
      id: 7,
    },
    {
      name: "python",
      img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/python-logo.png",
      id: 8,
    },
    {
      name: "rails",
      img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/rails-logo.png",
      id: 9,
    },
    {
      name: "sass",
      img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/sass-logo.png",
      id: 10,
    },
    {
      name: "sublime",
      img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/sublime-logo.png",
      id: 11,
    },
    {
      name: "wordpress",
      img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/wordpress-logo.png",
      id: 12,
    },
  ];
  // **************************************
  // time and timer functions
  function currentTime() {
    let time = new Date();
    let currentHours = time.getHours();
    let currentMinutes = time.getMinutes();
    let currentTime = `${currentHours < 10 ? "0" : ""}${currentHours}:${
      currentMinutes < 10 ? "0" : ""
    }${currentMinutes}`;
    $("#nav-time").text(currentTime);
  }
  setInterval(currentTime, 1000);

  let startTime;
  function updateTime() {
    if (state.totalTime) {
      const currentTime = new Date().getTime();
      const elapsedTime = new Date(currentTime - startTime);
      const minutes = elapsedTime.getMinutes();
      const seconds = elapsedTime.getSeconds();

      const formattedTime = `${minutes < 10 ? "0" : ""}${minutes}:${
        seconds < 10 ? "0" : ""
      }${seconds}`;

      $("#play-time").text(`${formattedTime}`);
      setTimeout(updateTime, 1000);
    } else {
      $("#play-time").text("00:00");
    }
  }
  // flip counter change vale in html el
  const flips = () => {
    totalFlips.text(`FLIPS ${state.totalFlips}`);
  };
  // **************************************
  // selectors
  const gameWrapper = $(".game-wrapper");
  const totalFlips = $("#total-flips");
  const WinModal = $(".win-modal");

  // shuffle array from data
  const shuffle = (array) => {
    const newArray = [...array];

    for (let index = newArray.length - 1; index > 0; index--) {
      const randomIndex = Math.floor(Math.random() * index + 1);
      const original = newArray[index];

      newArray[index] = newArray[randomIndex];
      newArray[randomIndex] = original;
    }
    return newArray;
  };

  let shuffledData = shuffle([...data, ...data]);

  // use this for localStorage data
  let userResults = {
    nick: "",
    bestTime: null,
    bestResult: 0,
  };

  // states of game, use it for start/stop game, timer, flips count
  let state = {
    gameStarted: false,
    flippedCards: 0,
    totalFlips: 0,
    totalTime: false,
    guessed: 0,
  };
  // set and get data to/from localStorage (async)

  const setDataToLocalStorage = () => {
    const userJSON = JSON.stringify(userResults);
    localStorage.setItem("userResult", userJSON);
  };

  const getDataFromLocalStorage = () => {
    return new Promise((resolve, reject) => {
      const getUserResultJSON = localStorage.getItem("userResult");
      if (getUserResultJSON) {
        const user = JSON.parse(getUserResultJSON);
        resolve(user);
      } else {
        reject(alert('Nema objekata u localStorage pod kljucem "useResault".'));
      }
    });
  };

  const getData = async () => {
    try {
      const user = await getDataFromLocalStorage();
      userResults = user;
    } catch (error) {
      console.log(error);
    }
  };

  if (localStorage.getItem("userResult") !== null) {
    getData();
  } else {
    setDataToLocalStorage();
  }
  // **************************************

  // restet game use for restart game(delete cards, shuffle data again, and place new cards in el),stop timer
  const ResetGame = () => {
    state.totalTime = false;
    state.gameStarted = false;
    state.totalFlips = 0;
    state.guessed = 0;
    shuffledData = shuffle([...data, ...data]);
    gameWrapper.empty();
    renderCards(shuffledData);
    WinModal.remove();
    flips();
  };

  // buttons in nav
  $("#start-game").click(function () {
    if (!state.totalTime & !state.gameStarted) {
      state.totalTime = true;
      state.gameStarted = true;
      state.totalFlips = 0;
      startTime = new Date().getTime();
      updateTime();
      eventHandler();
    }
  });
  // stop-game btn use for restart game(delete cards, shuffle data again, and place new cards in el),stop timer
  $("#stop-game").click(function () {
    ResetGame();
  });
  // create and render cards in html
  const createCard = (item) => {
    return `<div class='card' data-key=${item.id}>
  <div class="card-front"></div>
  <div class="card-back"><img src=${item.img} alt="logo" /></div>
  </div>`;
  };

  const renderCards = (data) => {
    const cardsHtml = data.map(createCard).join("");
    gameWrapper.append(cardsHtml);
  };

  const checkForWin = () => {
    if (state.guessed === shuffledData.length) {
      state.gameStarted = false;
      state.totalTime = false;
      let score;

      if (userResults.bestResult === 0) {
        userResults.bestResult = state.totalFlips;
        setDataToLocalStorage();
      }
      if (state.totalFlips < userResults.bestResult) {
        score = state.totalFlips;
        userResults.bestResult = state.totalFlips;
        setDataToLocalStorage();
      } else if (state.totalFlips >= userResults.bestResult) {
        score = userResults.bestResult;
      }
      modalWin = $(`<div class="modal-win">
      <img src="icons/crowns.png" alt="crowns" />
      <h2>You won!</h2>
      <div class="mt-auto">
        <p id="best-score">best score: ${score}</p>
        
      </div>
    </div>`);
      gameWrapper.append(modalWin);
    }
  };

  // click handler, rotate card, check key value, add class if match
  const eventHandler = () => {
    let firstKey = null;
    $(".card").click(function (e) {
      if (state.flippedCards === 2) {
        return;
      }
      $(this).toggleClass("card--picked");
      state.flippedCards += 1;

      const currentKey = $(this).data("key");
      if (firstKey === null) {
        firstKey = currentKey;
      } else {
        if (firstKey === currentKey) {
          $(`.card.card--picked[data-key=${currentKey}]`).addClass("matched");
          state.flippedCards = 0;
          state.totalFlips += 1;
          state.guessed += 2;
          flips();
          checkForWin();
        } else {
          state.totalFlips += 1;
          flips();

          setTimeout(function () {
            $(".card:not(.matched)").removeClass("card--picked");
            state.flippedCards = 0;
          }, 1000);
        }
        firstKey = null;
      }
    });
  };
  renderCards(shuffledData);
});
