use std::time::Duration;

use reqwest::{Client, StatusCode, header::CONTENT_TYPE};
use serde_json::{Value, json};
use suna_no_ringo::app;
use tokio::{net::TcpListener, sync::oneshot};

#[tokio::test]
async fn list_comics_returns_sample_over_http() {
    let listener = TcpListener::bind("127.0.0.1:0").await.unwrap();
    let address = listener.local_addr().unwrap();
    let (shutdown, stopped) = oneshot::channel::<()>();
    let server = tokio::spawn(async move {
        axum::serve(listener, app())
            .with_graceful_shutdown(async {
                let _ = stopped.await;
            })
            .await
    });

    let client = Client::builder()
        .no_proxy()
        .timeout(Duration::from_secs(5))
        .build()
        .unwrap();
    let response = client
        .get(format!("http://{address}/api/v1/comics"))
        .send()
        .await
        .unwrap();
    let status = response.status();
    let headers = response.headers().clone();
    let body = response.bytes().await.unwrap();

    shutdown.send(()).unwrap();
    server.await.unwrap().unwrap();

    assert_eq!(status, StatusCode::OK);
    assert_eq!(headers[CONTENT_TYPE], "application/json");
    assert_eq!(
        serde_json::from_slice::<Value>(&body).unwrap(),
        json!({"items": [{"id": "demo-001", "title": "示例漫画"}]})
    );
}
