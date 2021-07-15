const path = require("path")
const publicpath = path.join(__dirname,"/../public")
const SocketIO = require("socket.io")
const express = require("express")
const app = express()


const http = require("http")
const server = http.createServer(app)
const io = SocketIO(server)

app.use(express.static(publicpath))



var players={},
unmatched


const joingame=(socket)=>{
    players[socket.id] = {
        opponent:unmatched,
        symbol:"X",
        socket:socket
    }
    if(unmatched){
        players[socket.id].symbol="O"
        players[unmatched].opponent=socket.id
        unmatched=null
    }
    else{
        unmatched=socket.id
    }
}

const getopponent=(socket)=>{
    if(!players[socket.id].opponent){
        return
    }
    return players[players[socket.id].opponent].socket
}

io.on('connection',(socket)=>{
    joingame(socket)
    if(getopponent(socket)){
        socket.emit("Game Begin",{
            symbol:players[socket.id].symbol
        })
        getopponent(socket).emit("Game Begin",{
            symbol:players[getopponent(socket).id].symbol
        })
    }
    socket.on("Make Move",(data)=>{
        if(!getopponent(socket)){
            return
        }
        socket.emit("Move Made",data)
        getopponent(socket).emit("Move Made",data)
    })


    socket.on("disconnect",()=>{
        console.log("User was disconnected")
        if (getopponent(socket)) {
            getopponent(socket).emit("Opponent Left");
        }
    })
   
})






server.listen(process.env.PORT||3000,()=>{
    console.log(`Server is running on port 3000`)
})