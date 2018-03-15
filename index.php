<?php session_start(); ?>
<!DOCTYPE html>
<html lang="ja">
    <head>
        <meta charset="UTF-8">
        <link rel="stylesheet" href="./css/style.css">
        <link rel="stylesheet" href="./css/bootstrap.min.css">
        <title>永久立体</title> 
    </head>

    <body>
        <div class="container-fluid">
            <div class="row">
                <!-- タイトルロゴ -->
                <div id="title" class="col-sm-12">CubicRoop</div>
            </div><hr>
            <div class="row">
                <!-- メッセージ領域 -->
                <div id="divAlert" class="alert alert-warning alert-dismissible col-sm-4 offset-sm-4" role="alert" style="display: block;">
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <div id="divAlertMsg">現在、Chromeでのみ動作確認を行っています</div>
                </div>
                
            </div>
            <div class="row">
                <!-- ログインボタン -->
                <div class="col-sm-2 offset-sm-5">
                    <button class="btn btn-outline-dark" onclick="location.href='login.php'">Twitterアカウントで<br>ログイン</button>
                </div>
            </div><br>
            <div class="row" style="display: none;">
                <!-- 障害情報 -->
                <div class="alert alert-danger col-sm-6 offset-sm-3" role="alert">
                    <h4 class="alert-heading">障害情報</h4>
                    <hr>
                    <p>特にありません、何かありましたら連絡をお願いします。</p>
                </div>
            </div><br>
            <div class="row">
                <div class="col-sm-4 offset-sm-2">
                    <!-- 機能概要 -->
                    <ul class="list-group">
                        <li class="list-group-item"><b>機能概要</b></li>
                        <li class="list-group-item">Twitterアカウントでログインできます、連携を有効化してご使用下さい。</li>
                        <li class="list-group-item">ルーム選択画面では既存のルームに入室するか、新規ルームの作成が可能です。</li>
                        <li class="list-group-item">タイム測定画面ではチャット・測定が可能です。<br>タイマーのスタート・ストップはスペースキーのみになっています。</li>
                    </ul>
                </div>
                <div class="col-sm-3 offset-sm-1">
                    <!-- 改版履歴 -->
                    <ul class="list-group">
                        <li class="list-group-item"><b>改善予定</b></li>
                        <li class="list-group-item">インスペクションタイム追加</li>
                        <li class="list-group-item">鍵ルーム作成</li>
                        <li class="list-group-item">平均タイム記載</li>
                    </ul><br>
                    <!-- 改版履歴 -->
                    <ul class="list-group">
                        <li class="list-group-item"><b>改版履歴</b></li>
                        <li class="list-group-item">2018/02/02：リーダー譲渡機能追加</li>
                        <li class="list-group-item">2018/01/31：444追加</li>
                        <li class="list-group-item">2018/01/30：本番リリースver0.1</li>
                    </ul>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-2 offset-sm-10">
                    <div>created by <a href="https://twitter.com/chalpha28">chalpha28</a><br>CubicRoop v0.1</div>
                </div>
            </div>
        </div>
        <script type="text/javascript" src="./js/jquery-3.2.1.min.js"></script>
        <script type="text/javascript" src="./js/bootstrap.min.js"></script>
        <script type="text/javascript">
            var arg = new Object;
            var pair = location.search.substring(1).split('&');
            for (var i = 0; pair[i]; i++) {
                var kv = pair[i].split('=');
                arg[kv[0]] = kv[1];
            }
            if (arg.logout) {
                $('#divAlertMsg').text("ログアウトしました");
                $('#divAlert').css( 'display', 'block' );
            }
        </script>
    </body>
</html>
