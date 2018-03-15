<!DOCTYPE html>
<html lang="ja">
    <head>        
        <meta  http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>スクランブル生成</title>
    </head>
    <body>
        <!-- スクランブル生成ボタン -->
        <div id="divNewRoom" class="input-group">
            <select class="custom-select" id="selKind">
                <option selected>種目選択</option>
                <option value="3">333</option>
                <option value="4">444(未実装)</option>
                <option value="OH">333OH(未実装)</option>
            </select>
            <div class="input-group-append">
                <button id="btnScramble" class="btn btn-outline-success">スクランブル生成</button>
            </div>
        </div>
        </div>
        
        <script type="text/javascript" src="./js/jquery-3.2.1.min.js"></script>
        <script type="text/javascript" src="https://www.gstatic.com/firebasejs/4.8.2/firebase.js"></script>
        <script type="text/javascript" src="./js/accessFirebase.js"></script>
        <script type="text/javascript">
            // スクランブル情報
            var scrambleRef = firebase.database().ref("scramble/333/");
            // 333を1000個(仮
            var url = 'http://localhost:2014/scramble/.json?e=333*10';

            var xhr= new XMLHttpRequest();
            // ハンドラの登録.
            xhr.onreadystatechange = function() {
                switch ( xhr.readyState ) {
                    case 0:
                        // 未初期化状態.
                        console.log( 'uninitialized!' );
                        break;
                    case 1: // データ送信中.
                        console.log( 'loading...' );
                        break;
                    case 2: // 応答待ち.
                        console.log( 'loaded.' );
                        break;
                    case 3: // データ受信中.
                        console.log( 'interactive... '+xhr.responseText.length+' bytes.' );
                        break;
                    case 4: // データ受信完了.
                        if( xhr.status == 200 || xhr.status == 304 ) {
                            var data = xhr.responseText; // responseXML もあり
                            console.log( 'COMPLETE! :'+data );
                        } else {
                            console.log( 'Failed. HttpStatus: '+xhr.statusText );
                        }
                        break;
                }
            };
            
            var cnt = 1;
            $('#btnScramble').click(function() {
                xhr.open("GET", url);
                xhr.setRequestHeader("Content-Type" , "application/json");
                //xhr.addEventListener("progress",function(ev){
                //    cnt = 2;
                //});
                xhr.send();
                //scrambleRef.push({
                //  [cnt]: "B2 D' F2 D L2 U2 B2 L2 B2 R D2 B' U2 L U' B L D L'"
                //});
            });
        </script>
    </body>
</html>