document.addEventListener("deviceready", function () {
  var socket = io.connect("http://91.203.237.189:3000");
  socket.on("connect", function () {
    socket.on("text", function (text) {
      alert(text);
    });
  });
});

game.publish(EVENT.GAME_PLAYER_DEAL_ALL);