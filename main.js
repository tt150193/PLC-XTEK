var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');

// var mqtt = require("./route/mqttStrigger");
var PLC = require("./route/ctrlPlc");
var plc = new PLC();
plc.sendpython();


var app = express();
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views','./views');

app.get("/", function(req, res){
    res.render("index");
});

var objSensor = {
    identifier: "",
    actionId: "",
    type: "",           //WATERING or LIGHTING
    on: "",             //true of false
    time: ""
}

var objReport = {
    identifier: "",
    actionId: "", 
    status: ""          //SUCCESS or FAILURE
}

app.post("/sensor", function(req, res){
    
});

var objControl = {
    identifier: "",
    actionId: "",
    type: "",           //WATERING or LIGHTING
    on: "",             //true of false
    time: ""
}

var objReport = {
    identifier: "",
    actionId: "", 
    status: ""          //SUCCESS or FAILURE
}

app.post('/device', function(req, res){
    var a = req.body;
    for (i in objControl){
        if(a[i] == undefined) {
            objReport.identifier = a.identifier;
            objReport.actionId = a.actionId;
            objReport.status = "FAILURE";
            objReport.error = "JSON CONTROL NOT MATCH DEFINE"
            res.send(objReport)
            return;
        } else {
            continue;
        }
    }

    if(a.identifier != plc.getNamePLC()){
        objReport.identifier = a.identifier;
        objReport.actionId = a.actionId;
        objReport.status = "FAILURE";
        objReport.error = "IDENTIFIER NOT MATCH"
        res.send(objReport)
        return;
    }
    
    var pin = "";
    if(a.type == "WATERING"){
        pin = "D1";
    } else if (a.type == "LIGHTING"){
        pin = "D2";
    } else {
        objReport.identifier = a.identifier;
        objReport.actionId = a.actionId;
        objReport.status = "FAILURE";
        objReport.error = "TYPE NOT DEFINE: WATERING or LIGHTING"
        res.send(objReport)
        return;
    }
    var time = parseInt(a.time);

    if((time > 0) || (time == 0)) {

    } else {
        objReport.identifier = a.identifier;
        objReport.actionId = a.actionId;
        objReport.status = "FAILURE";
        objReport.error = "TIME CANNOT PARSE to INT"
        res.send(objReport)
        return;   
    }
    if(a.on == "true"){
        plc.sendpython(pin, "true", time);
    } else if (a.on == "false"){
        plc.sendpython(pin, "false", time);
    } else {
        objReport.identifier = a.identifier;
        objReport.actionId = a.actionId;
        objReport.status = "FAILURE";
        objReport.error = "CONTROL with ON true/false"
        res.send(objReport)
        return;
    }
    objReport.identifier = a.identifier;
    objReport.actionId = a.actionId;
    objReport.status = "SUCCESS";
    objReport.error = ""
    res.send(objReport)    
});

app.get('/plc', function(req, res){
   res.render('plc');
});

app.get('/stateplc', function(req, res){
    res.render(plc.statePLC());
})

app.get("/searchUsb", function(req, res){
    console.log("SEARCH");
    res.send({data: plc.searchUsb()});
});

app.post("/control", function(req, res){
    var a = req.body;
    console.log(a);
    plc.sendpython(a.actionId, a.on);
    var b = {
        actionId: a.actionId,
        type: 1,
        on: a.on, 
        time: a.time
    }
    res.send(b);
})
app.listen(3000);