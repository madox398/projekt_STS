$(window).on('load', function(){
    let timeTemp=[];
    let timePress=[];
    let timeToPrevious=[];
    let timeToPreviousTemp=0;
    let firstKey=true;
    let personName;
    let keyDown=[];
    let keyDownTextLength=0;
    let userID;

    let charsToSend=[];
    let nameIsDone=false;

    const maxLengthOfText = 3000;

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
        let str = $name.val();
        if (str.length <= 1) {
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
    $name.keyup(function (event) {
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

    $name.on("blur", function () {
        if(!nameIsDone){
            nameIsDone = !nameIsDone;
            console.log("focusout");
            checkNameInDatabse();
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
        console.log("Klawisz: "+idKey.which+"["+idKey.code+"]["+idKey.which+"], Czas przytrzymania: "+timePress[idKey.which]+", Czas od poprzedniego znaku: "+timeToPrevious[idKey.which]);//TODO console.log

        $.ajax({
            type: "POST",
            contentType: "application/json; charset:utf-8",
            url:"http://localhost:8080/keys/add",
            data:JSON.stringify({
                "keyCode": idKey.which,
                "timePressed": timePress[idKey.which],
                "timeToNextChar": timeToPrevious[idKey.which],
                "nameId": userID
            }),
            success:function (payload) {
                $paragraphKeyId.css("display","block");
                $spanKeyId
                    .css("display","block")
                    .css("background-color","rgba(0,0,0,0)")
                    .text(payload["id"]);
                $("#dotConnectionStatus").css("background-color","#00ff00");
                $textArea.css("background-color","rgba(0,0,0,0)");

                if(payload["error"]){
                    $("#keyId")
                        .text(payload["error"])
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
        return false;
    }
    function sendOnlyNameToDatabase(){

        for (let i =0; i < charsToSend.length; i++) {
            let old = JSON.stringify(charsToSend[i]).replace('##', userID)
            charsToSend[i] = JSON.parse(old);
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
        let lastIndex = charsToSend.length;
        charsToSend[lastIndex] = JSON.stringify({
            "nameId":"##",
            "keyCode": key.which,
            "timePressed": timePress[key.which],
            "timeToNextChar": timeToPrevious[key.which]
        })
    }

    function checkNameInDatabse(){
        $.ajax({
            type: "GET",
            contentType: "application/json; charset:utf-8",
            url: "http://localhost:8080/users/name/"+personName,
            success: function(payload) {
                if (payload["id"]!==null) {
                    userID = payload["id"];
                    $textArea.removeAttr('disabled');
                    $textArea.focus();
                    nameIsDone=true;
                    sendOnlyNameToDatabase();
                }
                else {
                    $.ajax({
                        type: "POST",
                        contentType: "application/json; charset:utf-8",
                        url: "http://localhost:8080/users/add/name/"+personName,
                        success: function(payload) {
                            if (payload["id"]) {
                                userID = payload["id"];
                                sendOnlyNameToDatabase();
                                $textArea.focus();
                            }
                        }
                    })
                }
            },
            error:function (){
                $.ajax({
                    type: "POST",
                    contentType: "application/json; charset:utf-8",
                    url: "http://localhost:8080/users/add/name/"+personName,
                    success: function(payload) {
                        if (payload["id"]) {
                            userID = payload["id"];
                            $textArea.focus();
                            sendOnlyNameToDatabase();
                            $textArea.removeAttr('disabled');
                            nameIsDone=true;
                        }
                    }
                })
            }
        })
    }
})