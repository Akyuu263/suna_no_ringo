use axum::{Json, response::IntoResponse};
use serde::Serialize;

#[derive(Serialize)]
struct ComicSummary {
    id: &'static str,
    title: &'static str,
}

#[derive(Serialize)]
struct ComicList {
    items: &'static [ComicSummary],
}

pub(super) async fn list_comics() -> impl IntoResponse {
    Json(ComicList {
        items: &[ComicSummary {
            id: "demo-001",
            title: "示例漫画",
        }],
    })
}
