const socket =io()
var symbol


    socket.on("connect",()=>{
        console.log("Connected to server")
    })

    socket.on("disconnect",()=>{
        console.log("Disconnected from server")
    })
 
    const messagecreate = document.getElementById("message")
    const messageopponent = document.getElementById("opponent")

    const append=(message)=>{
        messagecreate.innerHTML=message
    }
    const appendopponent=(message)=>{
        messageopponent.innerHTML=message
    }

const name = prompt("Enter your name to join");
append(`${name} joined`);
socket.emit('new-user-joined', name);
socket.on('user-joined', name=>{
    appendopponent(`Opponent : ${name} joined`)
})

const makeMove=(e)=>{
    e.preventDefault()

    console.log(e.currentTarget)
    if(!myTurn){
        return
    }
    if (e.currentTarget.innerHTML.length) {
        return;
      }
      socket.emit("Make Move", {
        symbol: symbol,
        position: e.currentTarget.getAttribute("id")
      })
    
}



const getboardstate=()=>{
    var obj={}
    var elem = document.getElementsByClassName("button")
    for(var i=0;i<elem.length;i++){
        obj[elem[i].getAttribute("id")]= elem[i].innerHTML || ""
    }
    return obj
}


const gameTied=()=>{
    var state = getboardstate()
    console.log(state)
    if (
      state.a !== "" &&
      state.b !== "" &&
      state.c !== "" &&
      state.d !== "" &&
      state.e !== "" &&
      state.f !== "" &&
      state.g !== "" &&
      state.h !== "" &&
      state.i !== "" 
    ) {
      return true
    }
}


const isGameOver=() =>{
    var state = getboardstate(),
      
      matches = ["XXX", "OOO"],
      rows = [
        state.a + state.b + state.c,
        state.d + state.e + state.f,
        state.g + state.h + state.i,
        state.a + state.e + state.i,
        state.c + state.e + state.g,
        state.a + state.d + state.g,
        state.b + state.e + state.h,
        state.c + state.f + state.i
      ]
  
    for (var i = 0; i < rows.length; i++) {
      if (rows[i] === matches[0] || rows[i] === matches[1]) {
        return true
      }
    }
}


const renderTurnMessage=()=> {
    if (!myTurn) {
      document.getElementById("messages").innerHTML="Your opponent's turn"
    } else {
      document.getElementById("messages").innerHTML="Your turn."
    }
}



   
    console.log(document.getElementById("messages").innerText)
    var Icon =document.getElementsByClassName("button")
    for(let i=0;i<Icon.length;i++){
        Icon[i].addEventListener("click", makeMove);
    }

    socket.on("Move Made",(data)=>{
        console.log(data.position)
        document.getElementById(data.position).innerHTML=data.symbol


        myTurn=data.symbol !== symbol

        if(!isGameOver()){
            if(gameTied()){
                document.getElementById("messages").innerHTML="Game Tied"
            }
            else{
                renderTurnMessage()
            }
        }
        else{
            if(myTurn){
                document.getElementById("messages").innerHTML="Game Over. You lost!!!"
            }
            else{
                document.getElementById("messages").innerHTML="Game Over. You won!!!"
              
            }
        for(let i=0;i<Icon.length;i++){
            Icon[i].removeEventListener("click", makeMove);
        }
        }
    })
    socket.on("Game Begin",(data)=>{
        symbol= data.symbol
        myTurn=symbol==="X"
        renderTurnMessage()
    })

    socket.on("Opponent Left",()=>{
        document.getElementById("messages").innerHTML="Your opponent has left the game!!"
    })

















