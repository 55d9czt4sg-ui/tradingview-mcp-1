# Copilot Resources for TradingView MCP Development

This directory contains curated instructions, skills, and agents from the GitHub Awesome Copilot collection, tailored for this Node.js/TypeScript MCP bridge project.

## 📋 Resource Inventory

### Instructions (6 files)
- **code-review-generic.instructions.md** — Generic code review best practices
- **typescript-mcp-server.instructions.md** — TypeScript MCP server development guidance
- **performance-optimization.instructions.md** — Performance optimization strategies
- **nodejs-javascript-vitest.instructions.md** — Node.js testing with Vitest
- **gilfoyle-code-review.instructions.md** — Gilfoyle code review framework
- **dotnet-architecture-good-practices.instructions.md** — Architecture patterns (adaptable to Node.js)

### Skills (4 directories)
- **mcp-implementation-security-review/** — Evaluate MCP server security posture
- **performance-review-writer/** — Analyze and document performance improvements
- **refactor/** — Refactor code for maintainability and performance
- **review-and-refactor/** — Combined code review + refactoring workflow

### Agents (5 files)
- **debug.agent.md** — Debugging assistant for runtime issues
- **gem-debugger.agent.md** — Specialized debugger for tracing execution
- **gem-reviewer.agent.md** — Code review agent
- **se-security-reviewer.agent.md** — Security audit agent
- **se-system-architecture-reviewer.agent.md** — Architecture review agent

## 🔄 App Development Workflows

### Workflow 1: Pre-Commit Quality Gate
**Goal:** Ensure code meets quality standards before pushing
```
1. Use: code-review-generic.instructions
2. Use: gem-reviewer.agent
3. Use: refactor skill
4. Outcome: Clean, maintainable code
```
**When to use:** Before opening PRs

---

### Workflow 2: Performance Analysis & Optimization
**Goal:** Identify and fix performance bottlenecks
```
1. Use: performance-optimization.instructions
2. Use: performance-review-writer skill
3. Use: debug agent (for profiling)
4. Outcome: 2-5× faster operations
```
**When to use:** When responding to performance issues or post-optimization validation

---

### Workflow 3: Runtime Debugging
**Goal:** Trace and fix runtime errors quickly
```
1. Use: debug.agent
2. Use: gem-debugger.agent
3. Use: typescript-mcp-server.instructions (for context)
4. Outcome: Root-cause analysis + fix
```
**When to use:** When handling exceptions, crashes, or wrong output

---

### Workflow 4: MCP Security Hardening
**Goal:** Validate MCP server security
```
1. Use: mcp-implementation-security-review skill
2. Use: se-security-reviewer.agent
3. Use: typescript-mcp-server.instructions
4. Outcome: Security vulnerabilities identified & remediated
```
**When to use:** Before production deployment, after code changes to CDP handlers

---

### Workflow 5: Architecture Review & Refactoring
**Goal:** Improve system design and maintainability
```
1. Use: se-system-architecture-reviewer.agent
2. Use: dotnet-architecture-good-practices.instructions (principles are language-agnostic)
3. Use: review-and-refactor skill
4. Outcome: Better separation of concerns, reduced coupling
```
**When to use:** During refactor sprints or when adding major features

---

### Workflow 6: Test-Driven Development
**Goal:** Ensure comprehensive test coverage
```
1. Use: nodejs-javascript-vitest.instructions
2. Run: npm run test:unit (unit tests)
3. Use: debug agent to inspect coverage gaps
4. Outcome: >80% code coverage
```
**When to use:** For new features, after critical bug fixes

---

## 🛠️ How to Use Each Resource

### Instructions (`.instructions.md` files)
**Purpose:** Provide domain-specific development guidance
**How to use:**
- Read the relevant instruction file when starting a task
- Follow the embedded guidelines and examples
- Reference during code reviews

**Example:**
```bash
# Before optimizing, read the performance guide
cat .copilot/instructions/performance-optimization.instructions.md | head -50
```

---

### Skills (in `.copilot/skills/*/SKILL.md`)
**Purpose:** Specialized capabilities invoked via Copilot skill interface
**How to use:**
- Invoke via Copilot with `/` command or skill name
- Skills guide you through structured workflows
- Each skill has specific input requirements

**Available skills:**
1. `mcp-implementation-security-review` — Audit MCP security
2. `performance-review-writer` — Document perf analysis
3. `refactor` — Refactor code systematically
4. `review-and-refactor` — Combined workflow

**Example:**
```
User: @copilot refactor stream.js to reduce CPU usage
```

---

### Agents (`.agent.md` files)
**Purpose:** Full-workflow problem-solving for complex tasks
**How to use:**
- Use agents for end-to-end tasks (debug, review, architect)
- Agents manage multiple steps and hand off between subtasks
- Provide context (error message, code snippet, requirements)

**Available agents:**
1. `debug.agent` — General debugging
2. `gem-debugger.agent` — Deep execution tracing
3. `gem-reviewer.agent` — Code review
4. `se-security-reviewer.agent` — Security audit
5. `se-system-architecture-reviewer.agent` — Architecture review

**Example:**
```
User: @copilot debug
Error: Expression timeout in src/core/connection.js:78
[Agent walks through execution, identifies the cause, proposes fix]
```

---

## 📌 Quick Reference by Task

| Task | Resource | Type |
|------|----------|------|
| Review my code | code-review-generic | instruction |
| Fix a bug | debug.agent | agent |
| Optimize performance | performance-optimization | instruction |
| Secure the MCP server | mcp-implementation-security-review | skill |
| Refactor module X | refactor skill | skill |
| Improve system design | se-system-architecture-reviewer | agent |
| Write tests for feature Y | nodejs-javascript-vitest | instruction |
| Analyze a slowdown | performance-review-writer | skill |
| Deep dive debugging | gem-debugger.agent | agent |

---

## 🔗 VS Code Installation Links

To install these as extensions or configurations in VS Code:

```
vscode-insiders://extension/GitHub.copilot-instructions
vscode-insiders://extension/GitHub.copilot-skills
vscode-insiders://extension/GitHub.copilot-agents
```

Then load these specific resources via:
- **Settings** → Copilot → Instructions/Skills/Agents
- **Command Palette** → `Copilot: Use Instruction` / `Copilot: Use Skill`

---

## 📊 Effectiveness Metrics

When using these resources, track:

| Metric | Target | How to measure |
|--------|--------|-----------------|
| Code review time | 50% reduction | `time_review_before` vs `time_review_after` |
| Performance gains | 2-5× faster | Benchmark before/after using perf tools |
| Bug escape rate | <5% | Bugs found in prod / bugs caught pre-ship |
| Test coverage | >80% | `npm run test:coverage` report |
| Security issues | 0 critical | `se-security-reviewer.agent` findings |
| Refactor quality | 0 regressions | `npm run test:e2e` pass rate |

---

## 💡 Recommendations for Project Success

1. **Establish Code Review Ritual**
   - Before opening PRs: run gem-reviewer.agent
   - Catch 70% of issues pre-submission

2. **Performance as First-Class Concern**
   - Profile every 2-week sprint
   - Use performance-review-writer to document gains
   - Set perf targets for each module

3. **Security Gates**
   - Run mcp-implementation-security-review before production
   - Quarterly se-security-reviewer.agent audit

4. **Testing Culture**
   - Use nodejs-javascript-vitest.instructions for TDD
   - Aim for >85% line coverage
   - Unit tests run on every commit (npm run test:unit)

5. **Debug Efficiently**
   - Use debug.agent for runtime errors
   - Use gem-debugger.agent for CPU/memory profiling
   - Keep CLAUDE.md custom instructions in sync with findings

6. **Architecture Evolution**
   - Quarterly se-system-architecture-reviewer.agent review
   - Use dotnet-architecture principles (SOLID, DDD patterns)
   - Document all refactors in ARCHITECTURE.md

---

## 📚 Additional Resources

- **Main project:** https://github.com/github/awesome-copilot
- **Skills directory:** `/tmp/awesome-copilot/skills/`
- **Instructions directory:** `/tmp/awesome-copilot/instructions/`
- **Agents directory:** `/tmp/awesome-copilot/agents/`

---

## ✅ Checklist: First Use

- [ ] Read `.copilot/instructions/typescript-mcp-server.instructions.md`
- [ ] Run `gem-reviewer.agent` on latest commit
- [ ] Profile with `performance-review-writer` on hottest path
- [ ] Audit with `mcp-implementation-security-review`
- [ ] Set up test watchers with `nodejs-javascript-vitest`
- [ ] Mark this section as complete in team docs

---

**Last updated:** 2025-09-07
**Maintained by:** TradingView MCP Team
