// スクランブル情報
var scrambleRef = firebase.database().ref("scramble/333/");
// 333を1000個(仮
var url = 'http://localhost:2014/scramble/.json?e=333*1000';

var xhr= new XMLHttpRequest();

// ハンドラの登録.
xhr.onreadystatechange = function() {
    switch ( xhr.readyState ) {
    case 4: // データ受信完了.
        if( xhr.status == 200 || xhr.status == 304 ) {
            var scrambleList = JSON.parse(xhr.responseText)[0].scrambles; // responseXML もあり
            for (var i = 0; i < scrambleList.length; i++) {
                scrambleRef.push({
                    scramble : scrambleList[i]
                });
            }
        }
        break;
    }
};

$('#btnScramble').click(function() {
    xhr.open("GET", url);
    xhr.setRequestHeader("Content-Type" , "application/json");
    xhr.send();
});