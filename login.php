<?php
session_start();
 
define("Consumer_Key", "4ReyjLae6nqgN5y70BqeXQKTf");
define("Consumer_Secret", "lsZ5IMeYmkwIMVeRgcBztferP8Ae5qUmM5EIJ5Z1XaCbKPh1cR");
 
//Callback URL
define('Callback', 'http://cubic-roop.ice-cube.info/callback.php');
 
//ライブラリを読み込む
require "twitteroauth-master/autoload.php";
use Abraham\TwitterOAuth\TwitterOAuth;
 
//TwitterOAuthのインスタンスを生成し、Twitterからリクエストトークンを取得する
$connection = new TwitterOAuth(Consumer_Key, Consumer_Secret);
$request_token = $connection->oauth("oauth/request_token", array("oauth_callback" => Callback));
 
//リクエストトークンはcallback.phpでも利用するのでセッションに保存する
$_SESSION['oauth_token'] = $request_token['oauth_token'];
$_SESSION['oauth_token_secret'] = $request_token['oauth_token_secret'];
 
// Twitterの認証画面へリダイレクト
$url = $connection->url("oauth/authorize", array("oauth_token" => $request_token['oauth_token']));
header('Location: ' . $url);