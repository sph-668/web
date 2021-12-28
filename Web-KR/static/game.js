var socket = io();

var movement = {
    x_prev: null,
    y_prev: null,
    x_cur: null,
    y_cur: null,
    color: "#000",
    thick: null,
    cl: false
}
let prevX = null
let prevY = null
let draw = false

var canvas = document.getElementById('canvas');
canvas.width = innerWidth;
canvas.height = innerHeight * 0.83;
var context = canvas.getContext('2d');
//context.lineWidth = 2



let clrs = document.querySelectorAll(".clr")
// Converting NodeList to Array
let clearBtn = document.querySelector(".clear")

let color = "#000"
// Set draw to true when mouse is pressed
window.addEventListener("mousedown", (e) => draw = true)
// Set draw to false when mouse is released
window.addEventListener("mouseup", (e) => draw = false)
window.addEventListener("mousemove", (e) => {
    // if draw is false then we won't draw
    if (prevX == null || prevY == null || !draw) {
        prevX = e.clientX
        prevY = e.clientY
        return
    }
    clrs = Array.from(clrs)
    clrs.forEach(clr => {
        clr.addEventListener("click", () => {
            color = clr.dataset.clr
        })
    })
    currentX = e.clientX
    currentY = e.clientY
    movement.x_cur = e.clientX
    movement.y_cur = e.clientY
    movement.x_prev = prevX
    movement.y_prev = prevY
    movement.color = color
    if (color == "#fff")
        movement.thick = 15
    else
        movement.thick = 2
    context.lineWidth = movement.thick
    movement.cl = false
    clearBtn.addEventListener("click", () => {
        // Clearning the entire canvas
        movement.cl = true;
        context.clearRect(0, 0, canvas.width, canvas.height)
    })
    prevX = currentX
    prevY = currentY
    context.beginPath()
    context.moveTo(movement.x_prev, movement.y_prev)
    context.lineTo(movement.x_cur, movement.y_cur)
    context.strokeStyle = color
    context.stroke()
    socket.emit('movement', movement);
})

socket.emit('new player');




socket.on('state', function (players) {
    console.log(players);
    for (var id in players) {
        var player = players[id];
        context.beginPath()
        context.moveTo(player.x_prev, player.y_prev)
        context.lineTo(player.x_cur, player.y_cur)
        context.strokeStyle = player.color
        context.lineWidth = player.thick
        if (player.cl == true)
            context.clearRect(0, 0, canvas.width, canvas.height)
        context.stroke()

    }
});


