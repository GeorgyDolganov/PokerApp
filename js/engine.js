Player = function (name) {
  this.name = name;
};

var game = new StateMachine({
  init: "Idle",
  transitions: [
    { name: "play", from: "Idle", to: "Start" },
    { name: "startFirst", from: "Start", to: "FirstBet" },
    { name: "dealFlop", from: "FirstBet", to: "FlopCards" },
    { name: "dealTurn", from: "FlopCards", to: "TurnCard" },
    { name: "dealRiver", from: "TurnCard", to: "RiverCard" },
    { name: "showdown", from: "RiverCard", to: "Results" },
    { name: "nextGame", from: "Results", to: "Start" }
  ],
  methods: {
    onPlay: function () {
      game.publish(EVENT.GAME_TABLE_DEAL_ALL);
    },
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
  GAME_TABLE_DEAL_ALL: 3,
  GAME_PLAYER_DEAL_ALL:4,
};

PubSub.enable(game);

game.subscribe(EVENT.PLAYER_FOLD, function (player) {});
game.subscribe(EVENT.PLAYER_CALL, function (player) {});
game.subscribe(EVENT.PLAYER_RAISE, function (player) {});
game.subscribe(EVENT.GAME_TABLE_DEAL_ALL, function () {
  let cards = deck.deal(5);
  cards.forEach((card)=>{
    let cardDraft = document.getElementById("table-draft")
    cardDraft.insertAdjacentHTML('beforeend', GUI.getCardHTML(card));
  })
});
game.subscribe(EVENT.GAME_PLAYER_DEAL_ALL, function () {
  let cards = deck.deal(2);
  cards.forEach((card)=>{
    let cardDraft = document.getElementById("hand-draft")
    cardDraft.insertAdjacentHTML('beforeend', GUI.getCardHTML(card));
  })
});

