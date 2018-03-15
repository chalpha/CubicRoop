var timeRef = firebase.database().ref("room/" + roomId + "/time/");
var currentScrambleRef = firebase.database().ref("room/" + roomId + "/scramble/");
var scrambleRef = firebase.database().ref("scramble/" + kind + "/");
// タイマー用変数
var startTime = 0;
var stopTime = 0;
var timerId;
var startFlg = false;
var pushTime;
var currentMesureTime;

const INSPECTION_TIME = 15;
const FREEZING_TH = 1000;
const TOUCHING_TH = 550;
var touchTimer;
// 計測回数
var timerCnt = 1;
// 測定可能かどうか
var playable = false;

// タイマー動作
$('#body')
    .keyup(function(event) {
        if ((event.target.id !== "msgIn" && event.target.id !== "btnNext") && playable) {
            if (TOUCHING_TH > Date.now() - pushTime) {
                $('#timerText').removeClass("start");
                $('#timerText').removeClass("touch");
                clearInterval(touchTimer);
            } else if (FREEZING_TH < Date.now() - stopTime) {
                $('#timerText').removeClass("start");
                $('#timerText').removeClass("touch");
                if (!startFlg && event.keyCode === 32) {
                    startTime = new Date();
                    timerId = setInterval(updateTimerText, 1);
                    startFlg = true;
                    $('#scrambleText').text(timerCnt + "回目：測定中…");
                }
            }
        }
    })
    .bind('touchend',function(event) {
        if ((event.target.id !== "msgIn" && event.target.id !== "btnNext") && playable) {
            if (TOUCHING_TH > Date.now() - pushTime) {
                $('#timerText').removeClass("touch");
                $('#timerText').removeClass("start");
            } else if (FREEZING_TH < Date.now() - stopTime) {
                $('#timerText').removeClass("touch");
                $('#timerText').removeClass("start");
                if (!startFlg) {
                    startTime = new Date();
                    timerId = setInterval(updateTimerText, 1);
                    startFlg = true;
                    $('#scrambleText').text(timerCnt + "回目：測定中…");
                }
            }
        }
    })
    .keydown(function(event) {
        if (event.target.id !== "msgIn" && event.target.id !== "btnNext") {
            updateOpeTime();
            if (!playable) {
                return;
            }
            if (startFlg) {
                clearInterval(timerId);
                startFlg = false;
                addTimerList($('#timerText').text());
                playable = false;
                $('#btnNext')[0].disabled = false;
                if (leaderFlg) {
                    $('#scrambleText').text(timerCnt + "回目：測定完了 メンバーの測定が完了次第、次のスクランブルを発行してください");
                } else {
                    $('#scrambleText').text(timerCnt + "回目：測定完了 次スクランブルをお待ちください");
                }
                $('.btnTimer').show();
                if (kind === 444) {
                    $('.btnParity').show();
                }
            } else if (event.keyCode === 32) {
                if (!$('#timerText').hasClass("touch")) {
                    $('#timerText').addClass("touch");
                    pushTime = new Date();
                    touchTimer = setInterval(standbyStart, TOUCHING_TH);
                }
            }
        }
    });
    
$('#timeTableBody')
    .bind('touchstart', function(event) {
        updateOpeTime();
        if (!playable) {
            return;
        }
        if (startFlg) {
            clearInterval(timerId);
            startFlg = false;
            addTimerList($('#timerText').text());
            playable = false;
            $('#btnNext')[0].disabled = false;
            if (leaderFlg) {
                $('#scrambleText').text(timerCnt + "回目：測定完了 メンバーの測定が完了次第、次のスクランブルを発行してください");
            } else {
                $('#scrambleText').text(timerCnt + "回目：測定完了 次スクランブルをお待ちください");
            }
            $('.btnTimer').show();
            if (kind === 444) {
                $('.btnParity').show();
            }
        } else {
            $('#timerText').addClass("start");
        }
    });
    
// 長押し
function standbyStart() {
    $('#timerText').addClass("start");
    clearInterval(touchTimer);
}

// タイマー処理
function updateTimerText() {	
    stopTime = new Date();	// 経過時間を退避
    myTime = stopTime.getTime() - startTime.getTime();	// 通算ミリ秒計算

    $('#timerText').text(getTime(myTime));
}

// タイム整形
function getTime(myTime) {
    myH = Math.floor(myTime / (60 * 60 * 1000));	// '時間'取得
    time = "";
    if (myH !== 0) {
        time = myH + ":";
    }
    myTime = myTime-(myH * 60 * 60 * 1000);	
    myM = Math.floor(myTime / (60 * 1000));	// '分'取得
    if (myM !== 0) {
        if (myH !== 0) {
            time += ('00' + myH + ":").slice(-3);
        } else {
            time += myM + ":";
        }
    }
    myTime = myTime - (myM * 60 * 1000);
    if (myM !== 0) {
        myS = ('00' + Math.floor(myTime / 1000)).slice(-2);	// '秒'取得
    } else {
        myS = Math.floor(myTime / 1000);	// '秒'取得
    }
    myMS = ('000' + myTime%1000).slice(-3);	// 'ミリ秒'取得
    return time + myS + "." + myMS;
}


// タイム登録
function addTimerList(time) {
    var timeRef2 = firebase.database().ref("room/" + roomId + "/time/" + timerCnt + "/");
    currentMesureTime = time;
    timeRef2.update({
        [id] : currentMesureTime
    });
}
// タイムのリアルタイム表示
timeRef.on('value', function(ss) {
    var msg = ss.val();
    if (msg[1] !== undefined)
    {
        $('#timeTableBody tr').remove();
    }
    // 測定回数分ループ
    for(var count in msg){
        // count が回数
        if (isNaN(count)) {
            continue;
        } else if ($('#count').length === 0) {
            $('#timeTableBody').append('<tr id="count"><td></td><td>' + count + '</td></tr>');
        } else {
            $('#count').append('<td>' + count + '</td>');
        }
        // メンバーリスト分ループ
        for (var name of memberList) {
            // nameはid:名前
            // msg[count][key]はタイム
            var key = Object.keys(name)[0];
            let time = msg[count][key] === undefined ? "" : msg[count][key];
            if ($('#' + key + '').length === 0) {
                $('#timeTableBody').append('<tr id="' + key + '"><td>' + name[key] + '</td><td>' + time + '</td></tr>');
            } else {
                $('#' + key + '').append('<td>' + time + '</td>');
            }
        }
    }
    timerCnt = msg.recordCnt;
    $('#thCount')[0].colSpan = timerCnt;
    $('#timeTableBody #' + id).addClass("stay");
    // スクロールを一番右に
    $('#divTimeTable').animate({scrollLeft : $('#divTimeTable')[0].scrollWidth});
});


// 次のスクランブルボタン押下
$('#btnNext').click(function () {
    // 測定回数のカウントアップ
    timeRef.update({
        recordCnt: ++timerCnt
    });
    scrambleRef.once('value').then(function(ss) {
        var msg = ss.val();
        var key;
        for(key in msg){
            // 現スクランブルデータ更新
            currentScrambleRef.update({
              [roomId]: msg[key].scramble
            });
            break;
        }
        // 取得したスクランブルを削除
        firebase.database().ref("scramble/" + kind + "/" + key).remove();
    });
    // ボタン非活性
    $('#btnNext')[0].disabled = true;
});

// スクランブル表示
currentScrambleRef.on('value', function(ss) {
    for(var key in ss.val()){
        // スクランブル表示
        $('#scrambleText').text(timerCnt + "回目：" + ss.val()[key]);
        playable = true;
    }
    $('#timerText').text("0.000");
    $('#lblPlusTwo').removeClass("active");
    $('#lblDnf').removeClass("active");
    $('#lblPP').removeClass("active");
    $('#lblOP').removeClass("active");
    $('.btnTimer').hide();
    $('.btnParity').hide();
});

// +2ボタン押下
$('#btnPlusTwo').change(function(e) {
    if (e.target.checked) {
        var d = new Date();
        var plusTwoTime;
        // 分なし
        if ($('#timerText').text().indexOf(":") === -1) {
            d.setSeconds(d.getSeconds() + Number($('#timerText').text().split(".")[0]) + 2);
            d.setMilliseconds(d.getMilliseconds() + Number($('#timerText').text().split(".")[1]));
        // 分あり
        } else {
            d.setMinutes(d.getMinutes() + Number($('#timerText').text().split(":")[0]));
            d.setSeconds(d.getSeconds() + Number(($('#timerText').text().split(":"))[1].split(".")[0]) + 2);
            d.setMilliseconds(d.getMilliseconds() + Number($('#timerText').text().split(".")[1]));
        }
        // 差分取得
        var diff = d.getTime() - (new Date()).getTime();
        plusTwoTime = getTime(diff);
        addTimerList(plusTwoTime + "+");
        $('#lblDnf').removeClass("active");
    } else {
        addTimerList($('#timerText').text());
    }
});
// DNFボタン押下
$('#btnDnf').change(function(e) {
    if (e.target.checked) {
        addTimerList("DNF");
        $('#lblPlusTwo').removeClass("active");
    } else {
        addTimerList($('#timerText').text());
    }
});

// PPボタン押下
$('#btnPP').change(function(e) {
    currentMesureTime = currentMesureTime.split("(")[0];
    if (e.target.checked && $('#lblOP').hasClass("active")) {
        addTimerList(currentMesureTime + "(DP)");
    } else if (e.target.checked) {
        addTimerList(currentMesureTime + "(PP)");
    } else if ($('#lblOP').hasClass("active")) {
        addTimerList(currentMesureTime + "(OP)");
    } else {
        addTimerList(currentMesureTime);
    }
});

// OPボタン押下
$('#btnOP').change(function(e) {
    currentMesureTime = currentMesureTime.split("(")[0];
    if (e.target.checked && $('#lblPP').hasClass("active")) {
        addTimerList(currentMesureTime + "(DP)");
    } else if (e.target.checked) {
        addTimerList(currentMesureTime + "(OP)");
    } else if ($('#lblPP').hasClass("active")) {
        addTimerList(currentMesureTime + "(PP)");
    } else {
        addTimerList(currentMesureTime);
    }
});
