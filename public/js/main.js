// ES6 import or TypeScript
// import { io } from "socket.io-client";
// CommonJS
// const io = require("socket.io-client");

const numberInput = document.querySelector('.number')
const  messageInput = document.querySelector('.message')
const   btn = document.querySelector('.btn')
const  response = document.querySelector('.response')






btn.addEventListener('click', sent,false)


const socket = io('http://localhost:3000');
socket.on('smsStatus', function(data){
    response.innerHTML = '<h1>text message sent to '+ data.number + ' </h1>'
})


function sent(e){
    e.preventDefault()
    const number = numberInput.value.replace(/\D/g, '');
    const message = messageInput.value;
    


    fetch('/result',{
        method:'POST',
        headers:{
            'content-type':'application/json'
        },
        body:
            JSON.stringify(
                 { 
                     number:number,
                      message:message  
                })
        
    })
    .then((res)=>{
        console.log(res)
    }).catch((err)=>{
        console.log(err)
    })
}