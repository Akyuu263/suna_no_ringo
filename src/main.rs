use suna_no_ringo::app;

#[tokio::main]
async fn main() {
    let listener = tokio::net::TcpListener::bind("127.0.0.1:3000")
        .await
        .unwrap();

    println!("服务已启动: http://127.0.0.1:3000");

    axum::serve(listener, app()).await.unwrap();
}
