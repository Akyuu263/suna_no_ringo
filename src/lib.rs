mod catalog;
mod health;

use axum::{Router, routing::get};

pub fn app() -> Router {
    Router::new()
        .route("/", get(health::health))
        .route("/api/v1/comics", get(catalog::list_comics))
}
