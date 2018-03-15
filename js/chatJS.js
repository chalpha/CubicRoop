var messageRef = firebase.database().ref("room/" + roomId + "/message/");
// 発言処理
$('#msgIn').keypress(function (e) {
    if (e.keyCode === 13 && $('#msgIn').val() !== "") {
        messageRef.set({
          name: $('#nameIn').val(),
          text: $('#msgIn').val(),
          icon: $('#iconIn').val()
        });
        $('#msgIn').val('');
        updateOpeTime();
    }
});

// 発言時のリアルタイム表示
messageRef.on('value', function(ss) {
    var msg = ss.val();
    if (ss.val() === null) {
        return;
    }
    if ($('#nameIn').val() === msg.name) {
        // 自動リンク
        if (msg.text.lastIndexOf('http', 0) === 0) {
            $('#divMsg').append($('<div class="question_Box">')
                .append($('<div class="answer_image">').append('<figure><img src=' + msg.icon +'><legend>' + msg.name + '</legend></figure>'))
                .append($('<div class="arrow_answer"/>').append('<div><a href="' + msg.text + '" target="_blank">' + msg.text + '</a></div>')));
        } else {
            $('#divMsg').append($('<div class="question_Box">')
                .append($('<div class="answer_image">').append('<figure><img src=' + msg.icon +'><legend>' + msg.name + '</legend></figure>'))
                .append($('<div class="arrow_answer"/>').text(msg.text)));
        }
    } else {
        // 自動リンク
        if (msg.text.lastIndexOf('http', 0) === 0) {
            $('#divMsg').append($('<div class="question_Box">')
                .append($('<div class="question_image">').append('<figure><img src=' + msg.icon +'><legend>' + msg.name + '</legend></figure>'))
                .append($('<div class="arrow_question"/>').append('<div><a href="' + msg.text + '" target="_blank">' + msg.text + '</a></div>')));
        } else {
            $('#divMsg').append($('<div class="question_Box">')
                .append($('<div class="question_image">').append('<figure><img src=' + msg.icon +'><legend>' + msg.name + '</legend></figure>'))
                .append($('<div class="arrow_question"/>').text(msg.text)));
        }
    }
    // スクロールを一番下に
    $('#divMsg').animate({scrollTop : $('#divMsg')[0].scrollHeight});
});


