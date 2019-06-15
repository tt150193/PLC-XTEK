const { exec } = require('child_process');

class E {
    save(obj, topic){
        var t = Math.round((new Date()).getTime()/1000);
        var str = obj.toString()
        exec('echo ' + str + " > err-"+ topic + t + ".txt", (error, stdout, stderr) => {
            if (error) {
              console.error(`exec error: ${error}`);
              return;
            }
            console.log("SAVELOG");
        });
    }
}
module.exports = E;