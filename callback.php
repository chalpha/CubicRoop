<?php
session_start();
 
define("Consumer_Key", "4ReyjLae6nqgN5y70BqeXQKTf");
define("Consumer_Secret", "lsZ5IMeYmkwIMVeRgcBztferP8Ae5qUmM5EIJ5Z1XaCbKPh1cR");
 
//ライブラリを読み込む
require "twitteroauth-master/autoload.php";
use Abraham\TwitterOAuth\TwitterOAuth;
 
//oauth_tokenとoauth_verifierを取得
if($_SESSION['oauth_token'] == $_GET['oauth_token'] and $_GET['oauth_verifier']){

    //Twitterからアクセストークンを取得する
    $connection = new TwitterOAuth(Consumer_Key, Consumer_Secret, $_SESSION['oauth_token'], $_SESSION['oauth_token_secret']);
    $access_token = $connection->oauth('oauth/access_token', array('oauth_verifier' => $_GET['oauth_verifier'], 'oauth_token'=> $_GET['oauth_token']));

    //取得したアクセストークンでユーザ情報を取得
    $user_connection = new TwitterOAuth(Consumer_Key, Consumer_Secret, $access_token['oauth_token'], $access_token['oauth_token_secret']);
    $user_info = $user_connection->get('account/verify_credentials');	

    //ユーザ情報を取得
    $id = $user_info->id;
    $name = $user_info->name;
    $screen_name = $user_info->screen_name;
    $profile_image_url_https = $user_info->profile_image_url_https;
    $text = $user_info->status->text;

    //各値をセッションに入れる
    $_SESSION['access_token'] = $access_token;
    $_SESSION['id'] = $id;
    // 管理者権限付与
    $_SESSION['debug'] = ($id == '189893414');
    $_SESSION['name'] = $name;
    $_SESSION['screen_name'] = $screen_name;
    $_SESSION['text'] = $text;
    $_SESSION['profile_image_url_https'] = $profile_image_url_https;

    header('Location: select.php?login=true');
    exit();
}else{
    header('Location: index.php');
    exit();
}