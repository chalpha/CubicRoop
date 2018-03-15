var roomRef = firebase.database().ref("room/");
var memberRef = firebase.database().ref("room/" + roomId + "/member/");
var leaderRef = firebase.database().ref("room/" + roomId + "/leader/");
var historyRef = firebase.database().ref("history/member/");

var id = $('#idIn').val();

// ルーム名表示
$('#titleRoom').text("計測・チャットルーム(" + decodeURI(roomName) + ")");

var memberList = new Array();

// 遷移先(デフォはルーム選択画面
var tranAddr = "select.php";

// 操作タイムアウトタイマー(10分で自動退室
var opeTimerId;
const TIMEOUT_TH = 600000;

// 入室時にメンバーを追加
memberRef.update({
    [id]: $('#nameIn').val()
});
// 入室時間を記録
var enterDate = new Date();
enterDate.setHours(enterDate.getHours() + 9);
historyRef.update({
    [id + "/enterDate"]: enterDate
});
updateOpeTime();

// 退室・ログアウトボタン押下時
$('.btnRemove').click(function(e) {
    if (e.target.id === "btnLogout") {
        tranAddr = 'logout.php';
        // 退室時間を記録
        var logoutDate = new Date();
        logoutDate.setHours(logoutDate.getHours() + 9);
        historyRef.update({
            [id + "/exitDate"]: logoutDate,
            [id + "/logoutDate"]: logoutDate
        });
    } else {
        // 退室時間を記録
        var exitDate = new Date();
        exitDate.setHours(exitDate.getHours() + 9);
        historyRef.update({
            [id + "/exitDate"]: exitDate
        });
    }
    // リーダーの場合は確認メッセージを表示して部屋を解散する
    if (leaderFlg) {
        $('#errorMsg .modal-body').text('リーダーが退室するため、部屋が破棄されます。');
        $('#errorMsg').modal('show');
    } else {
        // メンバーを削除
        memberRef.update({
          [id]: null
        });
        $('#timeTableBody #' + id).removeClass("stay");
        window.location.href = tranAddr;
    }
});

// リーダー退室時
roomRef.on('child_removed', function() {
    // 強制退室
    if (!leaderFlg) {
        $('#errorMsg .modal-body').text('リーダーが退室したため、部屋が破棄されます。');
        $('#errorMsg').modal('show');
    }
});
// リーダー変更時
leaderRef.on('child_added', function(ss) {
    // 自分がリーダーになった場合
    if (ss.key === id) {
        leaderFlg = true;
        changeLeader();
    }
});

// 退室確認メッセージ
$('#errorMsg').on('hidden.bs.modal', function (e) {
    if (leaderFlg) {
        // メンバーを削除
        roomRef.update({
          [roomId]: null
        });
    }
    window.location.href = tranAddr;
});

$(window).on("beforeunload",function(e){
    $('#btnRemove').click();
});

// 操作時間判定
function updateOpeTime() {
    // 操作時間を記録
    var operationDate = new Date();
    operationDate.setHours(operationDate.getHours() + 9);
    historyRef.update({
        [id + "/operationDate"]: operationDate
    });
    // タイマー作動
    clearInterval(opeTimerId);
    opeTimerId = setInterval(timeoutOperation, TIMEOUT_TH);
}

// タイムアウト
function timeoutOperation() {
    $('#btnRemove').click();
}

// メンバーのリアルタイム表示
memberRef.on('value', function(ss) {
    var msg = ss.val();
    memberList = new Array();
    for(var key in msg) {
        if ($('#' + key).length === 0) {
            $('#timeTableBody').append('<tr id="' + key + '"><td>' + msg[key] + '</td></tr>');
        }
        memberList.push({[key]: msg[key]});
    }
    $('#timeTableBody #' + id).addClass("stay");
});

changeLeader();
// リーダーの場合のみスクランブル、リーダー変更ボタン有効化
function changeLeader() {
    if (leaderFlg) {
        $('#btnNext')[0].hidden = false;
        $('#btnChangeLeader')[0].hidden = false;
    } else {
        $('#btnNext')[0].hidden = true;
        $('#btnChangeLeader')[0].hidden = true;
    }
}

// リーダー譲渡
$('#btnChangeLeader').click(function () {
    $('#changeLeaderDialog form div').remove();
    for (var name of memberList) {
       $('#changeLeaderDialog form')
                .append($('<div class="custom-control custom-radio">')
                .append('<input type="radio" id="rd' + Object.keys(name)[0] + '" name="customRadio" class="custom-control-input">')
                .append('<label class="custom-control-label" id="lbl' + Object.keys(name)[0] + '" for="rd' + Object.keys(name)[0] + '">' + name[Object.keys(name)[0]] + '</label>'));
    }
    $('#changeLeaderDialog').modal('show');
});

$('#btnOk').click(function () {
    var newLeaderId = $('#changeLeaderDialog input:checked')[0].id.substr(2);
    var newLeaderName = $('#lbl' + newLeaderId).text();
    leaderRef.set({
        [newLeaderId]: newLeaderName
    });
    if (id !== newLeaderId) {
        leaderFlg = false;
        changeLeader();
    }
});

