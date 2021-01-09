//dołączenie potrzebnych zależnośći

const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const port = process.env.PORT || 3000

app.use(express.static(__dirname + "/public")) //dzięki temu aplikacja będzie wiedziała, gdzie znajduje się index.html
let clients = 0

io.on('connection', function (socket) { //działanie aplikacji, jeśli istanieje połączenie
    socket.on("NewClient", function () {
        if (clients < 2) {
            if (clients == 1) {
                this.emit('CreatePeer')
            }
        }
        else //jeśli jest więcej niż 2 klientów to wyświetli komunikat
            this.emit('SessionActive')
        clients++;
    })
    //wywołanie funkcji dla konkretnych zdarzeń:
    socket.on('Offer', SendOffer)
    socket.on('Answer', SendAnswer)
    socket.on('disconnect', Disconnect)
})

function Disconnect() {
    if (clients > 0) {
        if (clients <= 2)
            this.broadcast.emit("Disconnect")
        clients--
    }
}

function SendOffer(offer) {
    this.broadcast.emit("BackOffer", offer)
}

function SendAnswer(data) {
    this.broadcast.emit("BackAnswer", data)
}
//nasłuhiwanie serwera na podanym porcie
http.listen(port, () => console.log(`Active on ${port} port`))



