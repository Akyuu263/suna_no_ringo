use axum::{Json, response::IntoResponse};
use serde::Serialize;

#[derive(Serialize)]
struct Health {
    status: &'static str,
    message: &'static str,
}

pub(super) async fn health() -> impl IntoResponse {
    Json(Health {
        status: "ok",
        message: "漫画站后端已启动",
    })
}
