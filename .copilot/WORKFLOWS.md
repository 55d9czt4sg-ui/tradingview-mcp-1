# Recommended Workflows for TradingView MCP Development

## 🚀 Quick-Start Scenarios

### Scenario 1: I Just Opened a PR
**Time: 5-10 minutes**

```bash
# 1. Self-review your code
@copilot gem-reviewer.agent

# 2. Paste the PR diff
# Agent will analyze for:
# - Logic errors
# - Performance issues
# - Security holes
# - Testing gaps

# 3. Follow recommendations, push fixes
# 4. No surprises in review!
```

---

### Scenario 2: Performance Issue Reported
**Time: 15-30 minutes**

```bash
# 1. Collect baseline
npm run test:unit
# Note the timing

# 2. Profile with Copilot
@copilot performance-review-writer

# 3. Provide:
# - Slow operation (e.g., "stream.js pollLoop")
# - Current metrics (e.g., "runs every 300ms, CPU 45%")
# - Target (e.g., "reduce CPU to <15%")

# 4. Agent recommends optimization pattern
# Follow recommendations + re-test
npm run test:unit  # Verify speed improvement
```

---

### Scenario 3: Bug Crash in Production
**Time: 10-20 minutes**

```bash
# 1. Capture error context
# - Error message
# - Stack trace
# - Reproduction steps

# 2. Use debug agent
@copilot debug.agent

# 3. Paste error + relevant code section
# Agent will:
# - Trace execution path
# - Identify root cause
# - Propose fix
# - Suggest test case

# 4. Implement fix, commit, deploy hotfix PR
```

---

### Scenario 4: Pre-Deployment Security Check
**Time: 20-30 minutes**

```bash
# 1. Run MCP security review
@copilot mcp-implementation-security-review

# 2. Scope: "Entire src/core/ module"
# Checks:
# - Expression injection vulnerabilities
# - CDP protocol misuse
# - Unvalidated user input
# - Credential leaks

# 3. Review findings + fix HIGH/CRITICAL items
# 4. Re-run security skill to confirm
# 5. Merge only after green light
```

---

### Scenario 5: Major Refactor (e.g., Extract Module)
**Time: 1-2 hours**

```bash
# 1. Outline refactor goal
# Example: "Extract src/core/drawing.js into separate concern"

# 2. Use architecture reviewer
@copilot se-system-architecture-reviewer.agent

# 3. Agent will:
# - Analyze current dependencies
# - Suggest boundary between modules
# - Identify what breaks if moved
# - Propose new directory structure

# 4. Use refactor skill for implementation
@copilot refactor

# 5. Run full test suite
npm run test:unit && npm run test:e2e

# 6. Commit with link to architecture decision
```

---

### Scenario 6: Adding a New Tool (MCP Feature)
**Time: 2-4 hours**

```bash
# 1. Read MCP guidance
cat .copilot/instructions/typescript-mcp-server.instructions.md

# 2. Plan schema & tests
# Create failing test first

# 3. Code the feature
# - src/core/<module>.js (business logic)
# - src/tools/<module>.js (MCP registration)
# - src/cli/commands/<module>.js (CLI command)

# 4. Test
npm run test:unit  # Unit tests
npm run test:e2e   # Live TradingView tests

# 5. Peer review
@copilot gem-reviewer.agent

# 6. Performance check
@copilot performance-review-writer

# 7. Security audit (if touching CDP)
@copilot mcp-implementation-security-review

# 8. Merge
```

---

## 📋 Decision Tree: Which Copilot Resource to Use?

```
START
  ├─ "I need to review code"
  │   └─→ gem-reviewer.agent + code-review-generic.instructions
  │
  ├─ "Performance is slow"
  │   └─→ performance-optimization.instructions + performance-review-writer
  │
  ├─ "I found a bug"
  │   ├─ "It crashes at runtime"
  │   │   └─→ debug.agent or gem-debugger.agent
  │   └─ "It's logic wrong"
  │       └─→ gem-reviewer.agent
  │
  ├─ "I need to refactor"
  │   ├─ "Single file/function"
  │   │   └─→ refactor skill
  │   └─ "Whole module"
  │       └─→ se-system-architecture-reviewer.agent → review-and-refactor
  │
  ├─ "Security concern"
  │   ├─ "MCP server"
  │   │   └─→ mcp-implementation-security-review
  │   └─ "General code"
  │       └─→ se-security-reviewer.agent
  │
  ├─ "Need to write tests"
  │   └─→ nodejs-javascript-vitest.instructions
  │
  └─ "Architecture question"
      └─→ se-system-architecture-reviewer.agent + dotnet-architecture-good-practices.instructions
```

---

## ⏱️ Time-to-Insight Estimates

| Task | Tool | Estimated Time |
|------|------|-----------------|
| Code review (80 line PR) | gem-reviewer | 3-5 min |
| Root-cause a crash | debug.agent | 5-10 min |
| Identify perf bottleneck | performance-review-writer | 10-15 min |
| Security audit (1 file) | mcp-implementation-security-review | 5-10 min |
| Refactor function | refactor skill | 10-20 min |
| Refactor module (500+ LOC) | se-system-architecture-reviewer | 30-60 min |
| Design new feature | typescript-mcp-server.instructions | 15-30 min |

---

## 🔄 Weekly Development Cycle

**Monday: Planning**
- Read `.copilot/instructions/typescript-mcp-server.instructions.md` for new features
- Use se-system-architecture-reviewer for sprint planning

**Tuesday-Thursday: Implementation**
- For each PR: gem-reviewer.agent before submission
- If performance issues arise: performance-review-writer workflow

**Friday: Quality Gates**
- Full test suite: `npm run test:all`
- Security audit: mcp-implementation-security-review
- Performance baseline: `npm run test:unit` + note timings
- Code cleanup: refactor skill on hot files

**Optional Quarterly: Architecture Review**
- se-system-architecture-reviewer.agent on entire codebase
- Refactor key modules
- Update ARCHITECTURE.md

---

## 🎯 Integration with CI/CD

### Pre-Commit (Local)
```bash
# Before git commit
npm run test:unit
@copilot gem-reviewer.agent  # Manual review
git commit -m "..."
```

### Pre-Push (Local)
```bash
# Before git push
npm run test:e2e  # Ensure live tests pass
@copilot performance-review-writer  # If touching hot paths
git push
```

### Pre-Merge (GitHub Actions)
```yaml
# .github/workflows/quality-gate.yml
- name: Code Review
  run: @copilot gem-reviewer.agent  # In CI context

- name: Performance
  run: npm run test:unit
  
- name: Security
  run: @copilot mcp-implementation-security-review
```

---

## 📊 Success Metrics

Track these weekly:

```
PR Cycle Time:
  Current: ____ days
  Target: <3 days
  Copilot benefit: gem-reviewer.agent saves ~1 day per cycle

Bug Escape Rate:
  Current: ____% of bugs found in prod
  Target: <5%
  Copilot benefit: debug.agent catches earlier

Performance Baseline:
  Unit test time: ____ ms (target: <500ms)
  E2E test time: ____ s (target: <30s)
  Copilot benefit: performance-review-writer prevents regressions

Test Coverage:
  Current: ____%
  Target: >80%
  Copilot benefit: Vitest instructions guide coverage
```

---

## 🚨 Anti-Patterns to Avoid

1. **Don't skip gem-reviewer.agent** before opening PR
   - It catches 60-70% of issues
   - Saves reviewer time

2. **Don't ignore performance-optimization.instructions**
   - Performance debt compounds
   - Fix at source, not with caching layers

3. **Don't manually debug without debug.agent**
   - Systematic approach beats random print statements
   - gem-debugger.agent finds root cause faster

4. **Don't deploy without security audit**
   - Use mcp-implementation-security-review every release
   - CDP access is high-risk; validate

5. **Don't refactor without se-system-architecture-reviewer**
   - Refactors often create coupling
   - Architect first, code second

---

## 🤝 Collaboration Tips

**For Code Reviews:**
- Pair gem-reviewer.agent output with manual review
- Agent catches logic; humans catch domain sense

**For Performance:**
- Share performance-review-writer output in PR comments
- Document speedup % for visibility

**For Debugging:**
- Use debug.agent to narrow scope before pairing
- Share trace output to sync understanding

**For Architecture:**
- se-system-architecture-reviewer.agent creates shared vocabulary
- Reference agent output in design docs

---

## 📞 Getting Help

If Copilot resource isn't resolving your question:
1. Check `.copilot/instructions/<relevant>.instructions.md` for gaps
2. Ask in `#copilot-help` channel (if team Slack)
3. Escalate to project lead with Copilot output + your analysis
4. File issue on awesome-copilot repo if resource is stale

---

**Next step:** Pick ONE scenario above and try it this week!
