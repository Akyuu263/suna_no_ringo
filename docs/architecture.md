# 系统架构

## 第一阶段已批准

- **交付范围**：先实现 Web 与基础 API，首个功能为使用固定示例数据的只读漫画列表。后续客户端共用公共 HTTP 契约。
- **仓库**：采用 Monorepo。现有 Rust 包保留在根目录，Web 工程位于 `web/`，公共契约位于 `contracts/`。
- **后端**：Rust + Axum，单一服务内按功能组织模块。首期直接提供示例数据，持久化边界待实际需求明确时设计。
- **Web**：使用 React、TypeScript、Vite 和 npm，提交 `package-lock.json`。组件使用独立的 CSS Modules 和 CSS 自定义属性，视觉设计由项目负责人维护。
- **接口**：手写维护的 [OpenAPI 文档](../contracts/openapi.yaml) 是公共 HTTP 接口的权威契约。接口行为、契约和相关测试同步变更。第一阶段手写客户端调用。
- **自动化检查**：使用 GitHub Actions。Router 测试、真实 HTTP 集成测试与前端组件测试的职责见[工程协作规范](../AGENTS.md)。

## 尚未决策

- 数据库与迁移方案
- 认证和会话机制
- 图片存储与分发
- 缓存与部署方案

上述事项由项目负责人另行决策。
