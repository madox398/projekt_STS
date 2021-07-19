$(window).on("load",function (){
    var timeTemp=[];
    var timePress=[];
    var timeToPrevious=[];
    var timeToPreviousTemp=0;
    var firstKey=true;
    var keyDown=[];
    var keyDownTextLength=0;
    var endWriting=false;

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
        console.log(jsonedChars);
        console.log(JSON.parse(jsonedChars));
        $.ajax({
            type: "POST",
            contentType: "application/json; charset:utf-8",
            url: "http://localhost:5000/",
            data: JSON.parse(jsonedChars),
            success: function(){
                setTimeout(function() {
                }, 2);
            }
        })
        return false;
    }
})


