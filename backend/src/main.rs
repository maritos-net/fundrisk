use reqwest::Client;
use serde_json::Value;
use proconio::input;

// asyncは非同期処理を行うことを示す。.awaitをつけることで実行するし、非同期処理の完了を待つ。
// awaitをつけるのは処理を記述した段階では実行（メモリ確保含む）を行わず、処理自体を指すawaitがあってから実行されることを示す。
#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {

    // ユーザーからの入力
    println!("入力してください（例: AAPL 2mo 1d）:");
    input! {
        symbol: String,
        range: String,
        interval: String,
    }

    //　URLのフォーマット
    let url = format!(
        "https://query1.finance.yahoo.com/v8/finance/chart/{}?range={}&interval={}",
        symbol, range, interval
    );

    println!("[debug] URL = {}", url);

    let url = "https://query1.finance.yahoo.com/v8/finance/chart/AAPL?range=2mo&interval=1d";

    // 現時点の理解としてはClientは架空のブラウザのようなもので、後述するユーザーエージェントのような性質を定義してHTTPリクエストを送信するためのもの
    // https://docs.rs/reqwest/latest/reqwest/
    let client = Client::new();
    let res = client
        .get(url)
        .header("User-Agent", "Mozilla/5.0") 
        .send()
        .await?;

    let status = res.status();
    // status.is_successが200系のステータスコードを返すかどうかを確認するメソッド。
    // 否定形にすることで、成功しなかった場合の処理を記述
    // https://docs.rs/http/latest/http/status/struct.StatusCode.html
    if !status.is_success() {
        println!("Request failed with status: {}", status);
        return Ok(());
    }
    // res.jsonは、その中にあるものをjsonとして解釈することを示す。
    // https://developer.mozilla.org/ja/docs/Web/API/Response/json
    let json: Value = res.json().await?;
    // todoエラーハンドル実装する
    println!("Pretty JSON:\n{}", serde_json::to_string_pretty(&json)?);
    // todoエラーハンドル実装する

    Ok(())
}
