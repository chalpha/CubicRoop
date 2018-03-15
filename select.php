<?php
    session_start();
    // セッションチェック
    if (!isset($_SESSION['access_token'])) {
	header('Location: index.php');
	exit();
    }
?>
<!DOCTYPE html>
<html lang="ja">
    <head>        
        <meta  http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <link rel="stylesheet" href="./css/style.css">
        <link rel="stylesheet" href="./css/bootstrap.min.css">
        <title>ルーム選択・作成</title>
    </head>

    <body>
        <input type="hidden" id="nameIn" value="<?php echo $_SESSION['name'] ?>">
        <input type="hidden" id="idIn" value="<?php echo $_SESSION['id'] ?>">
        <div class="container-fluid">
            <div class="row">
                <!-- ページ名 -->
                <div id="titleRoom" class="col-sm-12">ルーム選択・作成</div>
            </div><hr><br>
            <div class="row">
                <div class="col-sm-10 offset-sm-1">
                    <!-- ルームボタン -->
                    <div id="divRoomBtn" class="row">
                    </div>
                </div>
            </div><br>
            <form id="newRoomForm" action="room.php" method="POST">
            <div class="row form-group">
                <!-- 新規作成ボタン -->
                <div class="col-sm-6 offset-sm-3 input-group">
                    <select class="custom-select" id="selKind" name="kind">
                        <option>種目選択</option>
                        <option value="333" selected>333</option>
                        <option value="444">444</option>
                    </select>
                    <input id="roomName" name="roomName" type="text" class="form-control" placeholder="ルーム名を入力">
                    <div class="input-group-append">
                        <button type="submit" id="btnNew" class="btn btn-outline-success">新規作成</button>
                    </div>
                    <input type="hidden" name="roomId" id="newRoomId">
                    <input type="hidden" name="leaderFlg" value="true">
                </div>
                <div class="col-sm-6 offset-sm-3 input-group" style="display:none;">
                    <div class="input-group-prepend">
                      <span class="input-group-text">パスワード有ルームはチェック</span>
                    </div>
                    <div class="input-group-prepend">
                      <div class="input-group-text">
                        <input type="checkbox" id="chkSecret">
                      </div>
                    </div>
                    <input id="txPass" name="password" type="password" disabled class="form-control" placeholder="パスワード">
                </div>
            </div>
            </form><br>
            <!-- ログアウトボタン -->
            <div class="row">
                <div class="col-sm-1 offset-sm-8">
                    <button id="btnLogout" class="btn btn-outline-danger btn-sm" onclick="location.href='logout.php'">ログアウト</button>
                </div>
            </div>
        </div>
        
        <!-- エラーメッセージ(Modal) -->
        <div class="modal fade" id="errorMsg" tabindex="-1" role="dialog" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Information</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-primary" data-dismiss="modal">閉じる</button>
              </div>
            </div>
          </div>
        </div>
        
        <script type="text/javascript" src="https://www.gstatic.com/firebasejs/4.8.2/firebase.js"></script>
        <script type="text/javascript" src="./js/jquery-3.2.1.min.js"></script>
        <script type="text/javascript" src="./js/popper.min.js"></script>
        <script type="text/javascript" src="./js/bootstrap.min.js"></script>
        <script type="text/javascript" src="./js/accessFirebase.js"></script>
        <script type="text/javascript" src="./js/selectJS.js"></script>
        <script type="text/javascript">
            var arg = new Object;
            var pair = location.search.substring(1).split('&');
            for (var i = 0; pair[i]; i++) {
                var kv = pair[i].split('=');
                arg[kv[0]] = kv[1];
            }
            if (arg.login) {
                // ログインログ
                // 入室時間を記録
                var historyRef = firebase.database().ref("history/member/");
                var loginDate = new Date();
                loginDate.setHours(loginDate.getHours() + 9);
                historyRef.update({
                    [$('#idIn').val() + "/name"]: $('#nameIn').val(),
                    [$('#idIn').val() + "/loginDate"]: loginDate
                });
            }
        </script>
    </body>
</html>