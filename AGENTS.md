# Agent Instructions

## Project Context
Read docs/product.md and docs/architecture.md
before proposing significant changes.

## Workflow
1. Inspect existing code and documentation.
2. Propose a plan for non-trivial tasks.
3. Identify decisions requiring owner approval.
4. Implement only the approved scope.
5. Run relevant checks and tests.
6. Summarize changes and remaining risks.

## Constraints
- Do not change architecture without approval.
- Do not introduce production dependencies without approval.
- Do not modify unrelated code.
- Never commit secrets.
- Never access production services without approval.
- Never claim a test passed unless it was run.
- Do not push, merge, or deploy without approval.

## Frontend Ownership

The project owner controls visual design.

### Agent Responsibilities
- Implement React component behavior.
- Implement state management and API integration.
- Provide semantic and accessible markup.
- Maintain stable CSS class names.
- Implement essential functional layout when needed.

### Styling Rules
- Prefer CSS Modules and CSS custom properties.
- Keep visual styling separate from business logic.
- Do not introduce Tailwind or CSS-in-JS without approval.
- Do not hardcode visual styles in JSX.
- Do not redesign existing UI without approval.
- Do not modify owner-maintained styles without approval.

### Collaboration
For new UI components:
1. Define component structure and behavior.
2. Explain required CSS hooks.
3. Provide only minimal necessary styles.
4. Leave final visual styling to the project owner.
