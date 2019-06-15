function l(str){
    console.log(str);
}
var btn = [];
function ctrlDevice(ctrl,device,cb){
    $.post("/control",
    {
        identifier: "PLC-123",
        actionId: device,
        type: "NOTHING",
        on: ctrl,
        time: 9, //delay how much
    },
    function(data, status){
        // alert("Data: " + data + "\nStatus: " + status);
        l(data);
        if(data.on === "true"){
            $("#btn" + data.actionId).text(data.actionId+"-OFF");
            $("#btn" + data.actionId).removeClass("w3-green");
            $("#btn" + data.actionId).addClass("w3-red");
        } else {
            $("#btn" + data.actionId).text(data.actionId+"-ON");
            $("#btn" + data.actionId).removeClass("w3-red");
            $("#btn" + data.actionId).addClass("w3-green");
        }
    }); 
}

$(document).ready(function(){
    $("#btnAddDevice").click(()=>{
        
    });
    
    for(i = 0; i < 6; i++){
        $("#btnD" + (i+1).toString()).click(function(){
            var ctrl = $(this).text();
            if(ctrl.search("ON") > 0){
                ctrlDevice(true, ctrl.slice(0,2));
            } else {
                ctrlDevice(false, ctrl.slice(0,2));
            }
            
        });
    }
    
    $("#btnSearch").click(()=>{
    $.get('/searchUsb', (data)=>{
        var x = document.getElementById('slt');
        var option = document.createElement("option");
        option.text = data.data;
        x.add(option);
    });
    });

});

