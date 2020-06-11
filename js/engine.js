Player = function (name) {
  this.name = name;
};

var game = new StateMachine({
  init: "Idle",
  transitions: [
    { name: "Play", from: "Idle", to: "Start" },
    { name: "StartFirst", from: "Start", to: "FirstBet" },
    { name: "DealFlop", from: "FirstBet", to: "FlopCards" },
    { name: "DealTurn", from: "FlopCards", to: "TurnCard" },
    { name: "DealRiver", from: "TurnCard", to: "RiverCard" },
    { name: "Showdown", from: "RiverCard", to: "Results" },
    { name: "NextGame", from: "Results", to: "Start" }
  ],
  methods: {
    onPlay: function () {},
    onStartFirst: function () {},
    onDealFlop: function () {},
    onDealTurn: function () {},
    onDealRiver: function () {},
    onShowdown: function () {},
    onNextGame: function () {}
  }
});

var EVENT = {
  PLAYER_FOLD: 0,
  PLAYER_CALL: 1,
  PLAYER_RAISE: 2,
  GAME_DEAL_ALL: 3,
};

PubSub.enable(game);

game.subscribe(EVENT.PLAYER_FOLD, function (player) {});
game.subscribe(EVENT.PLAYER_CALL, function (player) {});
game.subscribe(EVENT.PLAYER_RAISE, function (player) {});
game.subscribe(EVENT.GAME_DEAL_ALL, function (table) {
  let cards = deck.deal(5);
  cards.forEach((card)=>{
    let cardDraft = document.getElementById("card-draft")
    cardDraft.insertAdjacentHTML('beforeend', GUI.getCardHTML(card));
  })
});

