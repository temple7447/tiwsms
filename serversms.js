const express = require("express");
const app=  express()
const bodyparser = require('body-parser')
const ejs = require('ejs')
const socketio = require('socket.io')
const handlebars = require('express-handlebars').engine
const dotenv = require('dotenv')
dotenv.config({path:'./config/config.env'})
const path = require('path');
const { handle } = require("express/lib/router");
const twilio = require('twilio')


const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twiliophone = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid,authToken,{
    lazyLoading: true
})




app.use(express.static(path.join(__dirname + '/public')))


app.use(bodyparser.urlencoded({ extended:true}))
app.use(bodyparser.json())



app.engine("html", ejs.renderFile );
app.set("view engine", "html"); 





const PORT = process.env.PORT

// app.engine("handlebars", handlebars({ extname: "hbs", defaultLayout: false, layoutsDir: "views/layouts/", }) );
// app.set("view engine", "handlebars");


// app.engine("html", handlebars({ extname: "html", defaultLayout: false, layoutsDir: "views/layouts/", }) );
// app.set("view engine", "html");




app.get('/', (req,res)=>{
    res.render('index')
    // res.send('you are welcome')
    // res.render('main', {layout : 'index'});
})







app.post('/result',(req,res)=>{
    // res.send(req.body) 
    // res.send(`you message was successfully sent ${req.body.value}`)
    // console.log(req.body)
    const number = req.body.number
    const message = req.body.message

    client.messages.create({
       
        body: `${message}`,
        from: twiliophone,
        to: `+234${number}`},(errs,response)=>{
            if(errs){
                console.log(errs)
            }else{
                console.dir(response)

                const data = {
                    id:response.sid,
                    number:response.number
                }
                io.emit('smsStatus',data)

            }
        })
     .then(message => console.log(message.sid)
     ).catch(err => console.error(err));
    





});





const server = app.listen(PORT,()=>{
    console.log(`your server is running on port ${PORT}`);
});


const io = socketio(server,{
    cors:{
        origin: ["http://localhost:8080"],
    },
})


io.on('connection',(socket)=>{
    console.log( `we are connected ${socket}`)
    console.log(socket.id)
    io.on('disconnect',(discon)=>{
        console.log(`we are disconnected ${discon}`)
    })
})
