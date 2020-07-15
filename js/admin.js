document.addEventListener('deviceready', function() {
    var admin = io.connect('http://192.168.1.101:3000/admin');
    admin.on('connect', function() {
        admin.on('text', function(text) {
            alert(text);
        });
        startGame = (btn) =>{
            admin.emit('start game');
            document.getElementById(btn).remove();
        }
    });
});