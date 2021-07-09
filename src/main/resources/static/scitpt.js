// noinspection JSJQueryEfficiency

$(document).ready(function(){
    var timeTemp=[];
    var timePress=[];
    var timeToPrevious=[];
    var timeToPreviousTemp=0;
    var firstKey=true;
    var personName;
    var keyDown=[];
    var keyDownTextLength=0;

    var maxLengthOfText =150;

    $("#text").prop("disabled",true);

    $('#text').on("cut copy paste",function(e) {
        e.preventDefault();
    });

    $("#text").prop("maxLength",maxLengthOfText);


    $("#name").on("input", (function () {
        var str = $("#name").val();
        if (str.length > 1) {
            $("#text").removeAttr('disabled');
        } else {
            $("#text").attr('disabled', 'disabled');
        }
        $("#wynik").text(str);
    }));


        $("#text").keydown(function (event) {
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

        $("#text").keyup(function (event) {
            if(event.which!==9) {
                if (keyDownTextLength < maxLengthOfText) {
                    //Jeśli przycisk został puszczony przypisz false
                    keyDown[event.which] = false;
                    //Długość wciśnięcia
                    timePress[event.which] = Date.now() - timeTemp[event.which];
                    personName = $("#name").val();
                    toDatabase(event.which);
                } else {
                    $("#keyId").text("Przekroczyłeś maksymalną liczbę znaków");
                    $("#p_keyId").css("display", "none");

                }
            }
        })

    function toDatabase(idKey)
    {
        console.log("Klawisz: "+idKey+"["+String.fromCharCode(idKey)+"], Czas przytrzymania: "+timePress[idKey]+", Czas od poprzedniego znaku: "+timeToPrevious[idKey]);

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
                $("#p_keyId").css("display","block");
                $("#keyId").css("display","block");
                $("#dotConnectionStatus").css("background-color","#00ff00");
                $("#text").css("background-color","rgba(0,0,0,0)");
                $("#keyId").css("background-color","rgba(0,0,0,0)");
                $("#keyId").text(d.id);

                if(d.error){
                    $("#keyId").text(d.error);
                    $("#keyId").css("background-color","#ff0000");
                    $("#text").css("background-color","rgba(255,0,0,0.05)");
                    $("#p_keyId").css("display","none");
                }
            },
            error:function () {
                $("#dotConnectionStatus").css("background-color","#ff0000");
                $("#text").css("background-color","rgba(255,0,0,0.05)");
                $("#p_keyId").css("display","none");
                $("#keyId").css("display","none");
            }
        })
        timePress[idKey]=0;
        personName="";
    }
})