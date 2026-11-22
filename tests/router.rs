use axum::{
    body::{Body, to_bytes},
    http::{Request, StatusCode, header::CONTENT_TYPE},
};
use serde_json::{Value, json};
use suna_no_ringo::app;
use tower::ServiceExt;

#[tokio::test]
async fn root_returns_health_json() {
    let request = Request::get("/").body(Body::empty()).unwrap();
    let response = app().oneshot(request).await.unwrap();

    assert_eq!(response.status(), StatusCode::OK);
    assert_eq!(response.headers()[CONTENT_TYPE], "application/json");

    let body = to_bytes(response.into_body(), usize::MAX).await.unwrap();
    assert_eq!(
        serde_json::from_slice::<Value>(&body).unwrap(),
        json!({"status": "ok", "message": "漫画站后端已启动"})
    );
}
