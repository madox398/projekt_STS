$(window).on("load",function (){
    let timeTemp = [];
    let timePress=[];
    let timeToPrevious=[];
    let timeToPreviousTemp=0;
    let firstKey=true;
    let keyDown=[];
    let keyDownTextLength=0;
    let endWriting=false;
    let percent;

    let charsToSend=[];
    let jsonedChars=[];

    const $textarea=$('#text');
    const $submit_button=$('#submit_button');
    const $roller=$(".lds-roller");


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
    });
    $textarea.keyup(function (event) {
        //Jeśli przycisk został puszczony przypisz false
        keyDown[event.which] = false;
        //Długość wciśnięcia
        timePress[event.which] = Date.now() - timeTemp[event.which];
        saveNameToSendLater(event);
        endWriting=false;
    });

    $submit_button.on("click",function (){
        sendTextToDatabase();
    });

    function saveNameToSendLater(key){
        let lastIndex = charsToSend.length;
        charsToSend[lastIndex] = JSON.stringify({
            "keyCode":key.which,
            "timePressed":timePress[key.which],
            "timeToNextChar":timeToPrevious[key.which]
        })
    }

    function sendTextToDatabase(){
        if(!endWriting) {

            jsonedChars =[];
            jsonedChars += "[";
            for (let i = 0; i < charsToSend.length; i++) {
                jsonedChars += "" + charsToSend[i] + ",";
            }
            if (jsonedChars.lastIndexOf(",") === jsonedChars.length - 1) {
                jsonedChars = jsonedChars.slice(0, jsonedChars.length - 1);
            }
            jsonedChars += "]";
            endWriting=true;
        }
        $roller.css("display","block");
        $.ajax({
            crossDomain: true,
            headers: {
                "accept": "application/json",
                "Access-Control-Allow-Origin":"*"
            },
            type: "POST",
            contentType: "application/json; charset:utf-8",
            url: "http://172.29.74.134:5000/",
            data: jsonedChars,
            success:function (payload) {
                if(payload["name_id"] !== null) {
                    getUserFromId(payload["name_id"]);
                    percent=payload["percent"];
                }
                $roller.css("display","none");
            },
            error: function (){
                $roller.css("display","none");
            }
        });
        return false;
    }
    function getUserFromId(id){
        $roller.css("display","block");
        $.ajax({
            type:"GET",
            contentType: "application.json; charset:utf-8",
            url: "http://172.29.74.134:8080/users/id/"+id,
            success:function (payload){
                if(payload["name"]){
                    $("#wynik").text("Mam pewność na "+ percent+"% że masz na imię "+payload["name"])
                        .css("font-size","25px")
                        .focus();
                }
                $roller.css("display","none");
            },
            error: function (){
                $roller.css("display","none");
            }
        })
    }
})


