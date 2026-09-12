# Copilot Quick Reference Card

Print this or keep in a tab for fast lookup.

## 🎯 What's My Immediate Problem?

| Problem | Copilot Resource | Command |
|---------|------------------|---------|
| **"Code smells in my PR"** | gem-reviewer.agent | `@copilot gem-reviewer.agent` |
| **"App is slow"** | performance-review-writer | `@copilot performance-review-writer` |
| **"Crash happening"** | debug.agent | `@copilot debug.agent` |
| **"Security concern"** | mcp-implementation-security-review | `@copilot mcp-implementation-security-review` |
| **"Need to refactor"** | refactor skill | `@copilot refactor` |
| **"Need tests"** | nodejs-javascript-vitest.instructions | Read: `.copilot/instructions/nodejs-javascript-vitest.instructions.md` |
| **"Bad architecture"** | se-system-architecture-reviewer.agent | `@copilot se-system-architecture-reviewer.agent` |

---

## 📂 File Locations

```
.copilot/
├── README.md ........................... Overview of all resources
├── WORKFLOWS.md ........................ Detailed workflow scenarios
├── QUICK-REFERENCE.md ................. This file!
├── instructions/ ....................... 6 guides
│   ├── code-review-generic.instructions.md
│   ├── typescript-mcp-server.instructions.md
│   ├── performance-optimization.instructions.md
│   ├── nodejs-javascript-vitest.instructions.md
│   ├── gilfoyle-code-review.instructions.md
│   └── dotnet-architecture-good-practices.instructions.md
├── skills/ ............................. 4 specialized workflows
│   ├── mcp-implementation-security-review/SKILL.md
│   ├── performance-review-writer/SKILL.md
│   ├── refactor/SKILL.md
│   └── review-and-refactor/SKILL.md
└── agents/ ............................. 5 end-to-end solvers
    ├── debug.agent.md
    ├── gem-debugger.agent.md
    ├── gem-reviewer.agent.md
    ├── se-security-reviewer.agent.md
    └── se-system-architecture-reviewer.agent.md
```

---

## ⚡ One-Line Workflows

### Before Committing
```bash
npm run test:unit && @copilot gem-reviewer.agent && git commit
```

### Before Pushing
```bash
npm run test:e2e && @copilot performance-review-writer && git push
```

### Before Merging (in PR)
```bash
@copilot mcp-implementation-security-review  # If touching src/core/
```

### Weekly Friday Ritual
```bash
npm run test:all && @copilot se-system-architecture-reviewer.agent
```

---

## 💾 Copy-Paste Templates

### PR Self-Review Checklist
```
@copilot gem-reviewer.agent

Files changed: src/core/data.js
Lines: ~50
Description: Optimized OHLCV summary calculation

Please review for:
- Logic correctness
- Performance impact
- Test coverage
- Security issues
```

### Performance Issue Report
```
@copilot performance-review-writer

Module: src/core/stream.js, function: pollLoop
Current: 300ms interval, CPU 45%
Target: 100ms interval, CPU <15%
Context: Real-time chart streaming
```

### Bug Investigation
```
@copilot debug.agent

Error: "Expression timeout at src/core/connection.js:78"
Steps to reproduce:
1. Open chart with >50 indicators
2. Wait 5 seconds
3. Error appears in console

Environment: macOS, Node 18, Chrome 120
```

---

## 🚨 Common Gotchas

| Gotcha | Solution |
|--------|----------|
| Agent seems stuck | Provide 1-2 relevant code snippets, not entire files |
| Instruction too generic | Read WORKFLOWS.md for project-specific scenarios |
| Skill not responding | Check `.copilot/skills/<name>/SKILL.md` for prerequisites |
| Agent says "I don't understand" | Rephrase as concrete task, provide error message or code |
| Performance review is vague | Include current timings, target timings, and operation name |

---

## 📊 Success Metrics (Track Weekly)

```
[ ] PR self-reviewed with gem-reviewer before submission
[ ] Unit tests passing (npm run test:unit)
[ ] No performance regressions (benchmark vs baseline)
[ ] Zero CRITICAL security findings
[ ] Test coverage >80%
[ ] Code review time <1 day
```

---

## 🔗 Extensions to Install

In VS Code Insiders:
```
Copilot: 
  - GitHub Copilot (core)
  - GitHub Copilot Extensions (for agents/skills)
  - GitHub Copilot Chat (for @copilot commands)
```

In Settings → Copilot:
- Enable: "Copilot: Enable" ✓
- Enable: "Copilot Completions" ✓
- Enable: "Copilot Chat" ✓

---

## ❓ FAQ

**Q: Can I use these offline?**
A: Instructions are local files. Agents/skills require Copilot connection.

**Q: Which resource should I use first?**
A: Start with `gem-reviewer.agent` on your current PR. Then add others as needed.

**Q: How often should I run security audits?**
A: Before every production deployment, at minimum quarterly for internal.

**Q: Can I chain multiple agents?**
A: Not automatically, but you can run one, implement fixes, then run another.

**Q: What if the agent gives bad advice?**
A: That's useful feedback! It means the resource needs context. Provide more detail and retry.

**Q: Do these resources expire?**
A: Check GitHub awesome-copilot repo periodically for updates (~monthly).

---

## 🤖 Real-World Examples

### Example 1: 50-line PR Review
```
Time: 2 minutes
User: Here's my PR that adds a new chart scroll feature
User: [pastes diff]
Agent: Found 3 issues:
  1. ✓ Missing await on async call (line 25)
  2. ✓ Memory leak in event listener (line 42)
  3. ✓ No test for edge case (empty chart)
User: Fixes issues, re-runs agent, all green
Result: PR merged in <30 min instead of 2-day cycle
```

### Example 2: Performance Debugging
```
Time: 15 minutes
User: Polling endpoint is slow, 500ms per cycle
User: @copilot performance-review-writer
Agent: Identifies JSON.stringify bottleneck
Agent: Suggests caching or simpler key format
User: Implements fix, benchmarks show 2-3× speedup
Result: Real-time lag eliminated
```

### Example 3: Security Before Deployment
```
Time: 10 minutes
User: Ready to deploy v2.0
User: @copilot mcp-implementation-security-review
Agent: Found unvalidated expression string in line 78
Agent: Risk: Expression injection vulnerability
User: Adds sanitization check, re-runs, all clear
Result: Production deployment is secure
```

---

**Updated:** 2025-09-07
**Keep handy!** Bookmark or print this for reference.
