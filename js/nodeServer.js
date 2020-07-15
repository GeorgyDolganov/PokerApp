var os = require("os");
var ifaces = os.networkInterfaces();
var ip;
var players = [];
var currentTurn = 0;
var turn = 0;

const socket = require("socket.io");
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const io = socket.listen(server);

Object.keys(ifaces).forEach(function (ifname) {
  var alias = 0;

  ifaces[ifname].forEach(function (iface) {
    if ("IPv4" !== iface.family || iface.internal !== false) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      return;
    }

    if (alias >= 1) {
      // this single interface has multiple ipv4 addresses
      console.log(ifname + ":" + alias, iface.address);
      ip = iface.address;
    } else {
      // this interface has only one ipv4 adress
      console.log(ifname, iface.address);
    }
    ++alias;
  });
});

class Deck {
  constructor() {
    this.deck = [];
    this.dealt_cards = [];
  }

  // generates a deck of cards
  generate_deck() {
    // creates card generator function
    let card = (suit, value) => {
      let name = value + "_of_" + suit;
      //returns key and values into each instance of the this.deck array
      return { name: name, suit: suit, value: value };
    };

    let values = [
      "two",
      "three",
      "four",
      "five",
      "six",
      "seven",
      "eight",
      "nine",
      "ten",
      "jack",
      "queen",
      "king",
      "ace"
    ];
    let suits = ["clubs", "diamonds", "spades", "hearts"];

    for (let s = 0; s < suits.length; s++) {
      for (let v = 0; v < values.length; v++) {
        this.deck.push(card(suits[s], values[v]));
      }
    }
  }

  // prints the deck of card objects
  print_deck() {
    if (this.deck.length === 0) {
      console.log(
        "Deck has not been generated. Call generate_deck() on deck object before continuing."
      );
    } else {
      for (let c = 0; c < this.deck.length; c++) {
        console.log(this.deck[c]);
      }
    }
  }

  // shuffle the deck
  shuffle() {
    for (let c = this.deck.length - 1; c >= 0; c--) {
      let tempval = this.deck[c];
      let randomindex = Math.floor(Math.random() * this.deck.length);

      //ensures that the randome index isn't the same as the current index. It runs the function again if this returns as true
      while (randomindex == c) {
        randomindex = Math.floor(Math.random() * this.deck.length);
      }
      this.deck[c] = this.deck[randomindex];
      this.deck[randomindex] = tempval;
    }
  }

  // deal a number cards
  deal(num_cards) {
    let cards = [];

    for (let c = 0; c < num_cards; c++) {
      let dealt_card = this.deck.shift();
      cards.push(dealt_card);
      this.dealt_cards.push(dealt_card);
    }

    return cards;
  }

  replace() {
    this.deck.unshift(this.dealt_cards.shift());
  }

  clear_deck() {
    this.deck = [];
  }
}

const StateMachine = require("javascript-state-machine");
var game = new StateMachine({
  init: "Idle",
  transitions: [
    { name: "start", from: "Idle", to: "FirstBet" },
    { name: "dealFlop", from: "FirstBet", to: "FlopCards" },
    { name: "dealTurn", from: "FlopCards", to: "TurnCard" },
    { name: "dealRiver", from: "TurnCard", to: "RiverCard" },
    { name: "showdown", from: "RiverCard", to: "Results" },
    { name: "nextGame", from: "Results", to: "FirstBet" }
  ],
  methods: {
    onStart: function () {
      io.of("/player").emit("startGame");
    },
    onDealFlop: function () {
      console.log("Flop started");
      io.of("/table").emit("dealFlop", deck.deal(3));
      io.of("/player").emit("text", "Флоп был выдан");
    },
    onDealTurn: function () {},
    onDealRiver: function () {},
    onShowdown: function () {},
    onNextGame: function () {}
  }
});

function nextTurn(lastBet) {
  turn = currentTurn++ % players.length;
  players[turn].emit("yourTurn", lastBet);
  console.log("next turn triggered ", lastBet);
}

io.of("/player").on("connection", socket => {
  socket.emit("text", "Игрок успешно подключился к серверу");
  console.log("player id=" + socket.id + " connected");
  players.push(socket);
  socket.on("disconnect", () => {
    console.log("player id=" + socket.id + " disconnected");
    players.splice(players.indexOf(socket), 1);
    turn--;
    console.log("A number of players now ", players.length);
  });
  socket.on("dealCardsServer", () => {
    socket.emit("dealCardsClient", deck.deal(2));
  });
  socket.on("passTurn", function (lastBet) {
    if (currentTurn != players.length) {
      if (players[turn] == socket) {
        nextTurn(lastBet);
      }
    } else {
      game.dealFlop();
      nextTurn(lastBet);
    }
  });
});
io.of("/table").on("connection", socket => {
  socket.emit("text", "Стол успешно подключился к серверу");
  console.log("table id=" + socket.id + " connected");
  socket.on("disconnect", () => {
    console.log("table id=" + socket.id + " disconnected");
  });
});

io.of("/admin").on("connection", socket => {
  socket.emit("text", "Администратор успешно подключился к серверу");
  console.log("admin id=" + socket.id + " connected");
  socket.on("disconnect", () => {
    console.log("admin id=" + socket.id + " disconnected");
  });
  deck = new Deck();
  deck.generate_deck();
  deck.shuffle();
  console.log(players);
  socket.on("start game", () => {
    console.log("game started");
    game.start();
    nextTurn();
  });
});

server.listen(3000, ip);
