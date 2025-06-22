use axum::{
    routing::post,Json, Router ,
    http::StatusCode
};
use reqwest::Client;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use tower_http::cors::{CorsLayer, Any};

// asyncは非同期処理を行うことを示す。.awaitをつけることで実行するし、非同期処理の完了を待つ。
// awaitをつけるのは処理を記述した段階では実行（メモリ確保含む）を行わず、処理自体を指すawaitがあってから実行されることを示す。

// https://serde.rs/derive.html
// 入力用の構造体
#[derive(Deserialize)]
struct FetchRequest {
    symbol: String,
    range: String,
    interval: String,
}

// 出力用の構造体（必要に応じて整形）
#[derive(Serialize)]
struct FetchResponse {
    status: String,
    data: Value,
}

#[tokio::main]
async fn main() {

    let cors = CorsLayer::new()
        .allow_origin(Any)    // Access-Control-Allow-Origin: *
        .allow_methods(Any)   // Access-Control-Allow-Methods: *
        .allow_headers(Any);  // Access-Control-Allow-Headers: *
        // todo 本番構築前にアクセス制限をかける

    // /fetchというエンドポイントにPOSTリクエストを受け付ける
    let app = Router::new()
        .route("/fetch", post(fetch_handler))
        .layer(cors);

    // サーバ起動
    // https://docs.rs/axum-server/latest/axum_server/fn.bind.html
    let addr = "127.0.0.1:3001".parse().unwrap();
    println!("Listening on http://{}", addr);
    axum::Server::bind(&addr).
        serve(app.into_make_service())
        .await
        .unwrap(); // unwrapは、Result型の値を取り出すためのメソッド。エラーが起きた場合にはpanicする。
    // エラーハンドル
}

// 元の処理をラップ
async fn fetch_handler(
    Json(payload): Json<FetchRequest>,
) -> Result<Json<FetchResponse>, (axum::http::StatusCode, String)> {
    let FetchRequest {
        symbol,
        range,
        interval,
    } = payload;
    //　URLのフォーマット
    let url = format!(
        "https://query1.finance.yahoo.com/v8/finance/chart/{}?range={}&interval={}",
        symbol, range, interval
    );

    println!("[debug] URL = {}", url);
    
    // 現時点の理解としてはClientは架空のブラウザのようなもので、後述するユーザーエージェントのような性質を定義してHTTPリクエストを送信するためのもの
    // https://docs.rs/reqwest/latest/reqwest/
    let client = Client::new();
    let res = client
        .get(url)
        .header("User-Agent", "Mozilla/5.0")
        .send()
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let status = res.status();
    // status.is_successが200系のステータスコードを返すかどうかを確認するメソッド。
    // 否定形にすることで、成功しなかった場合の処理を記述
    // https://docs.rs/http/latest/http/status/struct.StatusCode.html
    if !status.is_success() {
        // エラーが起きた場合には、エラーコードとメッセージを返す
        return Err((
            axum::http::StatusCode::BAD_GATEWAY,
            format!("Yahoo API error: status = {}", status),
        ));
    }
    // res.jsonは、その中にあるものをjsonとして解釈することを示す。
    // https://developer.mozilla.org/ja/docs/Web/API/Response/json
    let json: Value = res.json().await.map_err(|e| {
        (
            axum::http::StatusCode::INTERNAL_SERVER_ERROR,
            format!("Failed to parse JSON: {}", e),
        )})?;
        // エラーが起きた場合には、エラーコードとメッセージを返す
    //　戻り値
    Ok(Json(FetchResponse {
        status: "ok".into(),
        data: json,
    }))
}
