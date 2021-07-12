$(window).on('load', function(){
    var timeTemp=[];
    var timePress=[];
    var timeToPrevious=[];
    var timeToPreviousTemp=0;
    var firstKey=true;
    var personName;
    var keyDown=[];
    var keyDownTextLength=0;

    var charsToSend=[];
    var nameIsDone=false;

    const maxLengthOfText = 150;

    const $textArea = $("#text");
    const $spanKeyId=$("#keyId");
    const $paragraphKeyId=$("#p_keyId")
    const $name = $("#name");

    $textArea
        .prop("maxLength",maxLengthOfText)
        .prop("disabled",true)
        .on("cut copy paste",function(e) {
            e.preventDefault();
        });


    $name.on("input", (function () {
        var str = $name.val();
        if (str.length > 1) {
            $textArea.removeAttr('disabled');
            nameIsDone=true;
        } else {
            $textArea.attr('disabled', 'disabled');
            nameIsDone=false;
        }
    }));
    $name.keydown(function (event) {
        //określa liczbę znaków w polu tekstowym przed wpisaniem znaku
        keyDownTextLength=$textArea.val().length;
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
        .keyup(function (event) {
            if (keyDownTextLength < maxLengthOfText) {
                //Jeśli przycisk został puszczony przypisz false
                keyDown[event.which] = false;
                //Długość wciśnięcia
                timePress[event.which] = Date.now() - timeTemp[event.which];
                personName = $name.val();
                saveNameToSendLater(event);
            } else {
                $spanKeyId.text("Przekroczyłeś maksymalną liczbę znaków");
                $paragraphKeyId.css("display", "none");
            }
        })
    $textArea.on("focus", function () {
        if(nameIsDone){
            nameIsDone = !nameIsDone;
            sendOnlyNameToDatabase();
        }
    })
    $textArea.keydown(function (event) {
        //określa liczbę znaków w polu tekstowym przed wpisaniem znaku
        keyDownTextLength=$textArea.val().length;
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

    $textArea.keyup(function (event) {
        if (keyDownTextLength < maxLengthOfText) {
            //Jeśli przycisk został puszczony przypisz false
            keyDown[event.which] = false;
            //Długość wciśnięcia
            timePress[event.which] = Date.now() - timeTemp[event.which];
            personName = $name.val();
            sendToDatabase(event);
        } else {
            $spanKeyId.text("Przekroczyłeś maksymalną liczbę znaków");
            $paragraphKeyId.css("display", "none");
        }
    })

    function sendToDatabase(idKey)
    {
        console.log("Klawisz: "+idKey.which+"["+idKey.code+"], Czas przytrzymania: "+timePress[idKey.which]+", Czas od poprzedniego znaku: "+timeToPrevious[idKey.which]);//TODO console.log

        $.ajax({
            type: "POST",
            contentType: "application/json; charset:utf-8",
            url:"http://localhost:8080/keys/add",
            data:JSON.stringify({
                "name":personName,
                "keyCode": idKey.code,
                "timePressed": timePress[idKey.which],
                "timeToNextChar": timeToPrevious[idKey.which]
            }),
            success:function (d) {
                $paragraphKeyId.css("display","block");
                $spanKeyId
                    .css("display","block")
                    .css("background-color","rgba(0,0,0,0)")
                    .text(d.id);
                $("#dotConnectionStatus").css("background-color","#00ff00");
                $textArea.css("background-color","rgba(0,0,0,0)");

                if(d.error){
                    $("#keyId")
                        .text(d.error)
                        .css("background-color","#ff0000");
                    $textArea.css("background-color","rgba(255,0,0,0.05)");
                    $("#p_keyId").css("display","none");
                }
            },
            error:function () {
                $("#dotConnectionStatus").css("background-color","#ff0000");
                $textArea.css("background-color","rgba(255,0,0,0.05)");
                $paragraphKeyId.css("display","none");
                $spanKeyId.css("display","none");
            }
        })
        timePress[idKey]=0;
        personName="";
        return false;
    }
    function sendOnlyNameToDatabase(){
        var i =0;
        for (i; i < charsToSend.length; i++) {
            var old = JSON.stringify(charsToSend[i]).replace('##', personName)
            charsToSend[i] = JSON.parse(old);
            console.info(charsToSend[i]);
                $.ajax({
                    type: "POST",
                    contentType: "application/json; charset:utf-8",
                    url: "http://localhost:8080/keys/add",
                    data: charsToSend[i],
                    success: function(){
                        setTimeout(function() {
                        }, 2);
                    }
                })
        }
        return false;
    }

    function saveNameToSendLater(key){
        var lastIndex = charsToSend.length;
        console.log(lastIndex);
        charsToSend[lastIndex] = JSON.stringify({
            "name":"##",
            "keyCode": key.code,
            "timePressed": timePress[key.which],
            "timeToNextChar": timeToPrevious[key.which]
        })
    }
})