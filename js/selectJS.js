// ルーム情報
var roomRef = firebase.database().ref("room/");
var room;
// ルームボタンのリアルタイム表示
roomRef.on('value', function(ss) {
    $('#divRoomBtn button').remove();
    room = ss.val();
    for(var roomId in room){
        var memberCnt = 0;
        if (room[roomId].member !== undefined) {
            memberCnt = Object.keys(room[roomId].member).length;
        }
        // 0人のルームは削除
        if (memberCnt === 0) {
            roomRef.update({
                [roomId]: null
            });
            continue;
        }
        var divRoomBtn = $('<div class="col-sm-3">')
                .append('<button class="btn btn-outline-primary btnRoom" value="' + roomId + '"">' + "[" + room[roomId].kind + "]<br>" + room[roomId].name + '<br>' + memberCnt +  '人</button>');
        $('#divRoomBtn').append(divRoomBtn);

        // ルームボタン押下
        $('.btnRoom').click(function(e) {
            var roomId = e.target.value;
            var roomName = room[roomId].name;
            var kind = room[roomId].kind;
            var leaderFlg = false;
            var postData = {
                "roomId":roomId,
                "roomName":roomName,
                "kind":kind,
                "leaderFlg":leaderFlg
            };
            var form = $('<form/>', {'action': "room.php", 'method': 'post'});
            for(var key in postData) {
                form.append($('<input/>', {'type': 'hidden', 'name': key, 'value': postData[key]}));
            }
            form.appendTo(document.body);
            form.submit();
        });
    }
});

// ルーム作成ボタン押下
$('#newRoomForm').submit(function() {
    // ルーム名入力チェック
    if ($('#roomName').val() === "") {
        $('#errorMsg .modal-body').text('ルーム名を入力してください');
        $('#errorMsg').modal('show');
        return false;
    }
    // 種目入力チェック
    if ($('#selKind').val() !== "333" && $('#selKind').val() !== "444") {
        $('#errorMsg .modal-body').text('種目を選択してください 333、444以外は未実装です');
        $('#errorMsg').modal('show');
        return false;
    }
    var newRoomRef = roomRef.push({
        name: $('#roomName').val(),
        kind: $('#selKind').val(),
        password: $('#txPass').val(),
        time: {
            recordCnt: 0
        },
        member: {
            [$('#idIn').val()]: $('#nameIn').val()
        },
        leader: {
            [$('#idIn').val()]: $('#nameIn').val()
        }
    });
    $('#newRoomId').val(newRoomRef.key);
});

// パスワードチェック押下
$('#chkSecret').change(function(e) {
    if (e.target.checked) {
        $('#txPass')[0].disabled = false;
    } else {
        $('#txPass')[0].disabled = true;
        $('#txPass').val("");
    }
});