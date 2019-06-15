var upload = require("./requestLocalServer");
var actionCode = "";
var status = "";
const { exec } = require('child_process');
var usb = "";
var system = {
  name: "",
  state1: "",
  state2: "",
  state3: "",
  state4: "",
  state5: "",
  state6: ""
};
exec('ls /dev/ttyUSB*', (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  usb = stdout;
  // console.log(usb);
});
function getEnviroment(){
  exec('cat ' + __dirname + '/conf.plc', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    // console.log(stdout);
    var o = stdout.split("***")
    for(i in o){
      var a = o[i].split("=");
      if(a.length == 2){
        system[a[0]] = a[1];
      } else {
        continue;
      }
    }
    // console.log(system);
  });
}

function setEnviroment(){
  var str = "";
  // console.log("SAVE: ",system);
  for(i in system){
    str += i + "=" + system[i] + "***";
  }
  // console.log('echo "' + str + "\" > " + __dirname + '/conf.plc');
  exec('echo ' + str + " > " + __dirname + '/conf.plc', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    // console.log("SAVE ENVIROMENT");
  });
}
var runWater;
var runLight;
var arrayrunning = [];
class PLC {
  sendpython(pin, mode, time){
    arrayrunning.push({
      pin: pin,
      mode: mode,
      time: time
    });    
  }
    runningPlcMan(pin, mode, time){
      if((usb.length != 12)){
        exec('ls /dev/ttyUSB*', (error, stdout, stderr) => {
          if (error) {
            console.error(`exec error: ${error}`);
            return;
          }
          usb = stdout;
          // console.log(usb[11]);
        });
      }
        // console.log('python ' + __dirname + "/plc-communicate/write.py " + pin + " " + mode + " " + usb[11]);
        exec('python ' + __dirname + "/plc-communicate/write.py " + pin + " " + mode + " " + usb[11], (error, stdout, stderr) =>{
            // console.log(stderr);
            // console.log(stdout);
        });
        try{
          if(mode == "true"){
            system["state" + pin[1]] = "ON";
          } else {
            system["state" + pin[1]] = "OFF";
          }
          setEnviroment();
        } catch(e){

        }
        if((time)&&(time>0)){
          console.log("SET TIMEOUT")
          var nextMode = "";
            var nTime = time*1000;
            if(mode == "false"){
              nextMode = "true";
            } else {
              nextMode = "false";
            }
          if(pin == "D1"){
            clearTimeout(runWater);
            runWater = setTimeout(()=>{
              this.sendpython("D1", nextMode);
            }, nTime);
          } else if (pin == "D2") {
            clearTimeout(runLight);
            runLight = setTimeout(()=>{
              this.sendpython("D2", nextMode);
            }, nTime);
          } else {
            console.log("LOGIC IN HERE");
          }
          
        } else {
          console.log("NOT SET TIMEOUT");
        }

    }

    searchUsb(){
        return usb;
    }
    getNamePLC(){
      // console.log("NAME PLC: ", system.name)
      return system.name;
    }
    setNamePLC(name){
      system.name = name;
      setEnviroment();
    }
    statePLC(){
      return system;
    }
}
/* WHEN STARTUP */
getEnviroment();
var p = new PLC();
setTimeout(()=>{

  var led = 1;
  var sLed = setInterval(()=>{
    if(system["state" + led.toString()] == "ON"){
      p.sendpython("D" + led.toString(), "true");
      
    } else {
      p.sendpython("D" + led.toString(), "false");      
    }
    led = led + 1;
    if(led == 7){
      clearInterval(sLed);
    }
  }, 200);  
}, 3000)

setInterval(()=>{
  if(arrayrunning.length > 0){
    p.runningPlcMan(arrayrunning[0].pin, arrayrunning[0].mode, arrayrunning[0].time);
    arrayrunning.splice(0,1);
  }
}, 200);
module.exports = PLC;