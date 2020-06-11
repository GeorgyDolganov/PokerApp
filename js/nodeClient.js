$("#SendButton").click(function () {
  var msg = $("#messageText").val();

  socket.emit("message", { message: msg });
  return false;
});

socket.on("message", function (data) {
  var actualContent = $("#incomingMessages").html();
  var newMsgContent = "<li>" + data.message + "</li>";
  var content = actualContent + newMsgContent;
  $("#incomingMessages").html(content);
  $("#messageText").val("");
  var objDiv = document.getElementById("incomingMessages");
  objDiv.scrollTop = objDiv.scrollHeight;
});

document.addEventListener("deviceready", function () {
  var socket = io.connect("http://91.203.237.189:3000");
  socket.on("connect", function () {
    socket.on("text", function (text) {
      alert(text);
    });
  });
});
