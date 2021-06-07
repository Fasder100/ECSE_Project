const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { Server } = require("net");
const server = require ("http").createServer(app);
const WebSocket = require("ws");
var cors = require('cors')


// const path = require("path");
// const router = express.Router();

// app.set("view engine", "pug");
// app.set("views", path.join(__dirname, "views"));

const wss = new WebSocket.Server({ server:server });


app.use(express.json());
app.use(cors())

mongoose.connect('mongodb+srv://User3:qazxsw123@cluster0.gu3mc.mongodb.net/Medical?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});


const Record = new mongoose.Schema({
patient_id: {
    type: String,
    required: true

},
temperature: {
    type: Number,
    required: true

},
position: {
    type: Number,
    required: true,

},
last_updated:{
    type: Date,
    default: Date.now(),
}


});

const Patient = new mongoose.Schema({
    patient_id: {
        type: String,
        required: true
    
    },
    f_name: {
        type: String,
        required: true
    
    },
    l_name:{
        type: String, 
        required: true,

    },
    age:{
        type: Number,
        required: true,
    }
    
    
    });


const suc_cess = {
	"success": true,
	"msg": "data saved in database successfully",
	"date": Date()
}


const r_Data = mongoose.model('Record', Record);
const p_Data = mongoose.model('Patient', Patient);
// app.get("/data", (req,res)=>{
//     Data.find( (err, value) =>{
//         if (err)res.status(400).json("Bad Request");
//         res.json(value);
//     }); 

// });

app.get("/", ()=> {
    return "/index.html"
});

wss.on ('connection', function connection (ws) {
    console.log('A new Client Connected');
    ws.send('Welcome');

    ws.on('message', function incoming(message){
        console.log('received' + message);
        ws.send('Got your message its '+ message);

});


});


app.get("/api/patient", (req, res) =>{

    p_Data.find({})
    .then((patients)=> {
    res.json(patients);        
    }).catch((err) => {
        res.status(400).json("Bad Request");
        console.error(err);
    });
});
app.post("/api/patient", (req,res) => {

        
    let newpData = new p_Data({
        patient_id: req.body.patient_id,
        f_name: req.body.f_name,
        l_name: req.body.l_name,
        age: req.body.age

    })

    

    newpData.save((err) => {

        if(err) res.status(400).json("Bad Request");
        res.json(suc_cess);


    });



});

app.post("/api/record", (req,res) => {

        
    let newrData = new r_Data({
        patient_id: req.body.patient_id,
        temperature: req.body.temperature,
        position: req.body.position,

    })

    wss.on('data', function data(){
        console.log(newrData.body.patient_id);
        wss.send(newrData); 

    });

    newrData.save((err, data) => {

        if(err) res.status(400).json("Bad Request");
        res.json(suc_cess);


    });



});


app.get("/api/patient/:id", (req,res)=> {

    let id = req.params.id;
     p_Data.find({patient_id: id}, (err, value) => {
    
        if(err) res.status(400).json("Bad Request");
        res.json(value);
     });
});
    


app.patch("/api/patient/:id", (req,res)=> {

let id = req.params.id;
 let update = req.body;

 p_Data.findOneAndUpdate({_id: id},update, (err, value)=> {

    if(err) res.status(400).json("Bad Request");
    res.json(value);
 });
});

app.delete("/api/patient/:id", (req,res) => {

    let id = req.params.id;
    p_Data.findOneAndDelete({_id: id}, (err) => {
            if(err) res.status(400).json("Bad Request");
            res.json({
                success: true,
            });

    });
});


app.listen(5000);
server.listen(3000);