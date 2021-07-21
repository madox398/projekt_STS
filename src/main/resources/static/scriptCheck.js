$(window).on("load",function (){
    var timeTemp=[];
    var timePress=[];
    var timeToPrevious=[];
    var timeToPreviousTemp=0;
    var firstKey=true;
    var keyDown=[];
    var keyDownTextLength=0;
    var endWriting=false;
    var percent;

    var charsToSend=[];
    var jsonedChars=[];

    const $textarea=$('#text');
    const $submit_button=$('#submit_button');


    $textarea.on("cut copy paste",function(e) {
            e.preventDefault();
        });
    $textarea.keydown(function (event) {
        //określa liczbę znaków w polu tekstowym przed wpisaniem znaku
        keyDownTextLength=$textarea.val().length;
        //Czas od poprzedniego wciśnięcia klawisza zacznij liczyć
        //gdy zostanie wciśnięty pierwszy klawisz
        if (firstKey) {
            firstKey = !firstKey;
            timeToPreviousTemp = Date.now();
        }

        if (!keyDown[event.which]) {
            //Eliminuje problem długiego wciśnięcia przycisku
            keyDown[event.which] = true;
            //Zmienna tymczasowa do mierzenia czasu wciśnięcia
            timeTemp[event.which] = new Date();
            //Czas od poprzedniego klawisza
            timeToPrevious[event.which] = Date.now() - timeToPreviousTemp;
        }
        timeToPreviousTemp = Date.now();
    })
    $textarea.keyup(function (event) {
        //Jeśli przycisk został puszczony przypisz false
        keyDown[event.which] = false;
        //Długość wciśnięcia
        timePress[event.which] = Date.now() - timeTemp[event.which];
        saveNameToSendLater(event);
        endWriting=false;
    })

    $submit_button.on("click",function (){
        sendTextToDatabase();
    })

    function saveNameToSendLater(key){
        var lastIndex = charsToSend.length;
        charsToSend[lastIndex] = JSON.stringify({
            "keyCode":key.which,
            "timePressed":timePress[key.which],
            "timeToNextChar":timeToPrevious[key.which]
        })
    }

    function sendTextToDatabase(){
        if(!endWriting) {
            var i = 0;
            jsonedChars =[];
            jsonedChars += "[";
            for (i; i < charsToSend.length; i++) {
                jsonedChars += "" + charsToSend[i] + ",";
            }
            if (jsonedChars.lastIndexOf(",") === jsonedChars.length - 1) {
                jsonedChars = jsonedChars.slice(0, jsonedChars.length - 1);
            }
            jsonedChars += "]";
            endWriting=true;
        }
        $(".lds-roller").css("display","block");
        $.ajax({
            type: "POST",
            contentType: "application/json; charset:utf-8",
            url: "http://localhost:5000/",
            data: jsonedChars,
            success:function (d) {
                if(d.name_id !== null) {
                    getUserFromId(d.name_id);
                    percent=d.percent;
                }
                $(".lds-roller").css("display","none");
            },
            error: function (d){
                console.log(d.status);
                console.log("error: " + d);
                $(".lds-roller").css("display","none");
            }
        })
        return false;
    }
    function getUserFromId(id){
        $(".lds-roller").css("display","block");
        $.ajax({
            type:"GET",
            contentType: "application.json; charset:utf-8",
            url: "http://localhost:8080/users/id/"+id,
            success:function (d){
                if(d.name){
                    $("#wynik").text("Mam pewność na "+ percent+"% że masz na imię "+d.name)
                        .css("font-size","25px")
                        .focus();
                }
                $(".lds-roller").css("display","none");
            },
            error: function (d){
                console.log("error: " + d);
                $(".lds-roller").css("display","none");
            }
        })
    }
})


