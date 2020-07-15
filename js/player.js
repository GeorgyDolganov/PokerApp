const player = io.connect("http://192.168.1.101:3000/player");
var User = {
    name: "Игрок",
    cash: 10000,
    cards: null,
    active: true
  },
  slider = document.getElementById("slider");

player.on("connect", function () {
  User.name = prompt("Введите своё имя", "Игрок");
  document.getElementById("player-name").textContent = User.name;
  document.getElementById("player-cash").textContent = User.cash + "₽";
  player.on("text", function (text) {
    alert(text);
  });

  player.once("dealCardsClient", cards => {
    console.log("Отображение карт - " + cards);
    User.cards = cards;
    cards.forEach(card => {
      let cardDraft = document.getElementById("cardDraft");
      cardDraft.insertAdjacentHTML("beforeend", GUI.getCardHTML(card));
    });
  });

  player.on("startGame", () => {
    console.log("Выдача карт");
    player.emit("dealCardsServer");
    document.getElementById("bottom-panel").insertAdjacentHTML(
      "beforeend",
      `<div class="row" id="btn-row">
      <div class="btn" id="btn-accept" onclick="call();">Принять ставку</div>
      <div class="btn" id="btn-double" onclick="double();">Удвоить ставку</div>
      <div class="btn" id="btn-submit" onclick="raise();">Повысить ставку</div>
      <div class="btn" id="btn-fold">Сложить карты</div>
    </div>`
    );
    noUiSlider.create(slider, {
      start: [20],
      step: 10,
      connect: "lower",
      tooltips: [wNumb({ decimals: 0 })],
      range: {
        min: 0,
        max: User.cash
      },
      pips: {
        mode: "values",
        values: [
          0,
          (User.cash / 100) * 75,
          (User.cash / 100) * 50,
          (User.cash / 100) * 25,
          User.cash
        ],
        density: 1,
        format: wNumb({
          suffix: "₽"
        })
      }
    });
  });

  player.on("yourTurn", (getLastBet) => {
    lastBet = getLastBet;
    alert("Твой ход");
    if (lastBet != null) {
      document.getElementById("player-lastbet").textContent =
        "Последняя ставка " + lastBet + "₽";
    }
  });
});

call = () => {
  slider.noUiSlider.set(lastBet);
  alert("Ставка равна " + lastBet);
  player.emit("passTurn", slider.noUiSlider.get());
};

double = () => {
  slider.noUiSlider.set(lastBet * 2);
  player.emit("passTurn", slider.noUiSlider.get());
};

raise = () => {
  alert("Ставка равна " + slider.noUiSlider.get());
  player.emit("passTurn", slider.noUiSlider.get());
};

fold = () => {};
