const table = io.connect('http://192.168.1.101:3000/table')
table.on('connect', function() {
    table.on('text', function(text) {
        alert(text);
    });
    table.once("dealFlop", (cards) => {
        console.log("Отображение карт - " + cards);
        cards.forEach((card)=>{
            let cardDraft = document.getElementById("cardDraft")
            cardDraft.insertAdjacentHTML('beforeend', GUI.getCardHTML(card));
        })
    });
});
