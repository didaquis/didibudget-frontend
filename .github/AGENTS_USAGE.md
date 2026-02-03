# 🤖 Available Agents

This repository contains specialized GitHub Copilot agents to improve development productivity. Each agent has a specific role, understands the project tech stack, and has clear boundaries to prevent mistakes.

## 📋 Agents Summary

| Agent | Role | When to Use | Command |
|-------|------|------------|---------|
| **@test-agent** | React QA Engineer | Write/improve tests, increase coverage | `npm run test` |
| **@lint-agent** | Code Quality Specialist | Clean up style, auto-fix ESLint | `npm run lint` |

---

## ✅ @test-agent: Write Tests

**Specialty:** Write tests in Jest + React Testing Library for React components and GraphQL logic.

### When to Use
- You need to write unit tests or integration tests
- You want to improve test coverage
- You need tests for edge cases or error states
- You want someone to verify that tests pass

### Usage Examples

```
@test-agent
Write comprehensive tests for src/components/DateSelector.js using React Testing Library.
Include tests for:
- Rendering with correct value
- Callback on change
- Disabled state
- Label display

Run npm run test to verify they pass.
```

```
@test-agent
Create an integration test for AuthContext.js that tests:
- Login flow (providing isAuth token)
- Logout flow (clearing token)
- User data persistence in sessionStorage

Verify with npm run test -- --coverage
```

### What It Does

✅ **Yes:**
- Writes tests in `src/**/*.test.js` (collocated with source)
- Uses React Testing Library (queries by role, text, label)
- Includes happy path, edge cases, error states
- Verifies tests pass with `npm run test`

🚫 **Never:**
- Modifies source code in `src/`
- Removes failing tests (without authorization)
- Tests implementation details (useState internals)
- Uses shallow rendering

---

## 🧹 @lint-agent: Keep Code Clean

**Specialty:** ESLint auto-fix, consistent style, JavaScript best practices.

### When to Use
- Code has ESLint warnings
- You need to fix style: single quotes, no semicolons
- You want to apply the repo's custom `no-lenght` rule
- You need to verify imports are organized

### Usage Examples

```
@lint-agent
Run npm run lint -- --fix on src/ to auto-fix all style issues.
Then verify no logic was changed.
```

```
@lint-agent
Check and fix src/components/ for:
- Double quotes → single quotes
- Semicolons → remove
- .lenght typos → .length
- Import organization

Report what was fixed.
```

### What It Does

✅ **Yes:**
- Auto-fix with `npm run lint -- --fix`
- Respects custom rules: no semicolons, single quotes, no-lenght plugin
- Preserves all code logic (only touches style)
- Verifies imports are correct

🚫 **Never:**
- Changes code logic or behavior
- Disables ESLint rules
- Modifies ESLint configuration
- Deletes variables or imports

---

## 📂 Agent Structure

```
.github/
├── agents/
│   ├── test-agent.md       # @test-agent instructions
│   ├── lint-agent.md       # @lint-agent instructions
└── AGENTS_USAGE.md         # This file
```

---

## 🎯 Repository Tech Stack (For Reference)

Agents understand:

- **React 18.2.0** with React Router 6.26.2
- **GraphQL:** Apollo Client 3.14.0
- **Testing:** Jest + React Testing Library
- **Linting:** ESLint (custom rules: no semicolons, single quotes, `no-lenght` plugin)
- **Build:** craco, react-scripts
- **Style:** Single quotes, no semicolons, no unnecessary return-await

---

## 🚀 Recommended Workflow

### 1. Development + Testing
```
1. Write new code in src/
2. @test-agent: write tests (npm run test)
3. @lint-agent: clean up style (npm run lint -- --fix)
4. Commit when everything passes ✅
```

### 2. Quality Improvement
```
1. @lint-agent: review existing code style
2. @test-agent: increase coverage on untested components
```

---

## 📝 Tips for Using Agents Effectively

### ✅ DO
- **Be specific:** "Test the DateSelector component" is better than "write tests"
- **Give context:** Mention exact files, paths, expected behavior
- **Verify output:** Check that the agent did what you expected
- **Combine agents:** Lint → Test → Docs in sequence
- **Read instructions:** The agents.md files have important details

### 🚫 DON'T
- **Don't ask for things out of scope:** Don't ask @test-agent to refactor code (@lint-agent does that)
- **Don't allow logic changes:** If an agent changes code behavior, revert it
- **Don't ignore warnings:** If an agent asks "Are you sure?", it probably needs confirmation
- **Don't use agents for configuration:** Don't ask them to set up new tools

---

## 🔍 Troubleshooting

### Agent says "I can't do this"
It's probably out of scope. Check the boundaries in the agent's .md file.

### Agent modified something unexpected
Agents have clear boundaries but might miss edge cases. Check `git diff` to see exact changes.

### I need an agent to do something new
1. Open the corresponding `.github/agents/[agent].md`
2. Add specific instructions in the "When You Get Stuck" section
3. Or ask the agent to do it and then verify

### I want to create a new agent
Follow the pattern of the 3 existing ones:
1. Create `.github/agents/[name]-agent.md`
2. Define YAML frontmatter (name, description)
3. Include: role, tech stack, commands, examples, boundaries
4. Follow the format: ✅ Always Do, ⚠️ Ask First, 🚫 Never Do

---

## 📖 References

- **Official Blog:** [How to write a great agents.md](https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/)
- **React Testing Library:** https://testing-library.com/docs/react-testing-library/intro/
- **ESLint Config:** Check `package.json` → `eslintConfig`
- **Jest Docs:** https://jestjs.io/

