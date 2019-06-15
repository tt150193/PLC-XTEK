var username = "black";
var password = "a12345678";
var token = "";
var localSystem = require("./requestLocalServer");
function startupSystem(){
    if  (localSystem.checkLogin == "LOGIN") {
        localSystem.login(username, password, function(data){
            token = data;
        })
    } else if (localSystem.checkLogin == "NORMAL"){
        console.log("SERVER CONNTECTED");
    } else {
        console.log("SERVER CANNOT RUNNING WITH ERROR");
    }
}

startupSystem();
