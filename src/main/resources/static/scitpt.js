$(window).on('load', function(){
    var timeTemp=[];
    var timePress=[];
    var timeToPrevious=[];
    var timeToPreviousTemp=0;
    var firstKey=true;
    var personName;
    var keyDown=[];
    var keyDownTextLength=0;

    var maxLengthOfText = 150;

    var $textArea = $("#text");
    var $spanKeyId=$("#keyId");
    var $paragraphKeyId=$("#p_keyId")

    $textArea
        .prop("maxLength",maxLengthOfText)
        .prop("disabled",true)
        .on("cut copy paste",function(e) {
            e.preventDefault();
        });


    $("#name").on("input", (function () {
        var str = $("#name").val();
        if (str.length > 1) {
            $("#text").removeAttr('disabled');
        } else {
            $("#text").attr('disabled', 'disabled');
        }
    }));

    $textArea.keydown(function (event) {
        //określa liczbę znaków w polu tekstowym przed wpisaniem znaku
        keyDownTextLength=$('#text').val().length;
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
        if(event.which!==9) {
            if (keyDownTextLength < maxLengthOfText) {
                //Jeśli przycisk został puszczony przypisz false
                keyDown[event.which] = false;
                //Długość wciśnięcia
                timePress[event.which] = Date.now() - timeTemp[event.which];
                personName = $("#name").val();
                toDatabase(event.which);
            } else {
                $spanKeyId.text("Przekroczyłeś maksymalną liczbę znaków");
                $paragraphKeyId.css("display", "none");
            }
        }
    })

    function toDatabase(idKey)
    {
        console.log("Klawisz: "+idKey+"["+String.fromCharCode(idKey)+"], Czas przytrzymania: "+timePress[idKey]+", Czas od poprzedniego znaku: "+timeToPrevious[idKey]);//TODO console.log

        $.ajax({
            type: "POST",
            contentType: "application/json; charset:utf-8",
            url:"http://localhost:8080/keys/add",
            data:JSON.stringify({
                "name":personName,
                "charCode": idKey,
                "timePressed": timePress[idKey],
                "timeToNextChar": timeToPrevious[idKey]
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
})