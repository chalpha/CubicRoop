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
    <meta charset="UTF-8">
    <title>永久立体</title>
    <link rel="stylesheet" href="./css/bootstrap.min.css">
    <link rel="stylesheet" href="./css/style.css">
    <script type="text/javascript" src="./js/jquery-3.2.1.min.js"></script>
    <script type="text/javascript">
        var roomId = "<?php echo($_POST['roomId']); ?>";
        var roomName = "<?php echo($_POST['roomName']); ?>";
        var leaderFlg = <?php echo($_POST['leaderFlg']); ?>;
        var kind = <?php echo($_POST['kind']); ?>;
        var debug;
        if ("<?php echo($_SESSION['debug']); ?>" === "1") {
            debug = true;
        } else {
            debug = false;
        }
    </script>
  </head>

  <body id="body">
    <main>
        <!-- container-fluid -->
        <div class="container-fluid">
            <div class="row">
                <!-- ページ名 -->
                <div id="titleRoom" class="col-sm-12"></div>
            </div><hr id="line">
            <div class="row" id="secRow">
                <div class="col-sm-8">
                    <div class="row">
                        <!-- スクランブル領域 -->
                        <div  class="col-sm-10">
                            <div id="scrambleText"></div>
                        </div>
                        <div  class="col-sm-2 tar">
                            <button id="btnNext" class="btn btn-outline-primary">次のスクランブル</button>
                        </div>
                        <!-- タイマー領域 -->
                        <div id="divTimer" class="col-sm-12">
                            <div id="timerText" class="timerText">0.000</div>
                        </div><hr>
                        <div class="col-sm-2 offset-sm-4 btnParity btn-group-toggle" data-toggle="buttons" style="display:none;">
                            <label id="lblPP" class="btn btn-outline-danger btn-sm">
                                <input id="btnPP" type="checkbox">PP
                            </label>
                        </div>
                        <div class="col-sm-2 btnParity btn-group-toggle" data-toggle="buttons" style="display:none;">
                            <label id="lblOP" class="btn btn-outline-danger btn-sm">
                                <input id="btnOP" type="checkbox">OP
                            </label>
                        </div><hr>
                        <div class="col-sm-2 offset-sm-4 btnTimer btn-group-toggle" data-toggle="buttons" style="display:none;">
                            <label id="lblPlusTwo" class="btn btn-outline-warning btn-sm">
                                <input id="btnPlusTwo" type="checkbox">+2
                            </label>
                        </div>
                        <div class="col-sm-2 btnTimer btn-group-toggle" data-toggle="buttons" style="display:none;">
                            <label id="lblDnf" class="btn btn-outline-warning btn-sm">
                                <input id="btnDnf" type="checkbox">DNF
                            </label>
                        </div>
                    </div><br>
                    <div class="row">
                        <!-- タイム一覧領域 -->
                        <div class="col-sm-12 table-responsive" id="divTimeTable">
                            <!-- TimeTable -->
                            <table class="table table-condensed table-bordered" id="timeTalbe">
                                <thead>
                                    <tr>
                                        <th id="thPlayer">参加者</th>
                                        <th id="thCount">回数</th>
                                    </tr>
                                </thead>
                                <tbody id="timeTableBody"></tbody>
                            </table>
                        </div>
                    </div>
                    <div class="row">
                        <!-- ボタン領域 -->
                        <div class="col-sm-4 offset-sm-8 tar">
                            <button id="btnChangeLeader" class="btn btn-outline-info btn-sm">リーダー変更</button>
                            <button id="btnRemove" class="btn btn-outline-warning btn-sm btnRemove">退室</button>
                            <button id="btnLogout" class="btn btn-outline-danger btn-sm btnRemove">ログアウト</button>
                        </div>
                    </div>
                </div>
                <!-- メッセージ領域 -->
                <div class="col-sm-4">
                    <nav class="navbar">
                        <div class="col-sm-12">
                            <input type="text" id="msgIn" class="form-control" placeholder="メッセージを入力+Enter" value="" required="required" pattern="" title="">
                        </div>
                    </nav>
                    <div id="divMsg"></div>
                </div>
            </div>
        </div>
    </main>
      
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
              未実装です アップデートされるまでお待ちください
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-dismiss="modal">閉じる</button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- リーダー譲渡(Modal) -->
    <div class="modal fade" id="changeLeaderDialog" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">リーダー譲渡</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">キャンセル</button>
            <button type="button" class="btn btn-primary" id="btnOk" data-dismiss="modal">決定</button>
          </div>
        </div>
      </div>
    </div>
    
    <input type="hidden" id="nameIn" value="<?php echo $_SESSION['name'] ?>">
    <input type="hidden" id="idIn" value="<?php echo $_SESSION['id'] ?>">
    <input type="hidden" id="iconIn" value="<?php echo $_SESSION['profile_image_url_https'] ?>">
    <script type="text/javascript" src="https://www.gstatic.com/firebasejs/4.8.2/firebase.js"></script>
    <script type="text/javascript" src="./js/bootstrap.min.js"></script>
    <script type="text/javascript" src="./js/accessFirebase.js"></script>
    <script type="text/javascript" src="./js/roomJS.js"></script>
    <script type="text/javascript" src="./js/chatJS.js"></script>
    <script type="text/javascript" src="./js/timerJS.js"></script>
  </body>
</html>


