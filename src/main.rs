use axum::{routing::get, Json, Router};
use serde::Serialize;

#[derive(Serialize)]
struct Health {
    status: &'static str,
    message: &'static str,
}

async fn health() -> Json<Health> {
    Json(Health {
        status: "ok",
        message: "漫画站后端已启动",
    })
}

#[tokio::main]
async fn main() {
    let app = Router::new().route("/", get(health));

    let listener = tokio::net::TcpListener::bind("127.0.0.1:3000")
        .await
        .unwrap();

    println!("服务已启动: http://127.0.0.1:3000");

    axum::serve(listener, app).await.unwrap();
}
