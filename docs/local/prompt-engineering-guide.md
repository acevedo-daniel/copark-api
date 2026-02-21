# Prompt Engineering Guide

> Write better prompts → Get better results. Fast reference for daily AI-assisted development.

---

## Core Principles

1. **Be specific** — Vague input = vague output
2. **Give context** — The AI doesn't know your project unless you tell it
3. **Define the output** — Format, language, length, constraints
4. **Iterate** — First result is a draft, refine from there

---

## Prompt Structure

Every effective prompt follows this pattern:

```
[ROLE] — Who the AI should act as
[CONTEXT] — Background about your project/problem
[TASK] — What you need done
[CONSTRAINTS] — Rules, limits, format requirements
[OUTPUT] — Expected format of the response
```

> You don't need all 5 every time. Use what's relevant.

---

## Templates

### 1. Code Generation

```
Act as a senior TypeScript backend developer.

Context: Express API using Prisma ORM with PostgreSQL, Zod validation,
and layered architecture (controller → service → repository).

Task: Create a [feature] with:
- Schema validation with Zod
- Repository with Prisma queries
- Service with business logic
- Controller with proper error handling

Constraints:
- Use async/await, no callbacks
- Return proper HTTP status codes
- Follow existing project patterns

Output: Separate code blocks per file.
```

### 2. Bug Fixing

```
I have a bug in [file/feature].

Current behavior: [what happens]
Expected behavior: [what should happen]
Error message: [paste error]

Relevant code:
[paste the minimal code needed]

Find the root cause and suggest a fix with explanation.
```

### 3. Code Review

```
Review this code for:
- Security vulnerabilities
- Performance issues
- TypeScript best practices
- Clean code violations

[paste code]

Provide specific fixes, not general advice.
```

### 4. Refactoring

```
Refactor this code to:
- [specific goal, e.g., "separate business logic from controller"]
- [another goal, e.g., "add proper error handling"]

Keep the same behavior. Show before/after.

[paste code]
```

### 5. Explaining Concepts

```
Explain [concept] as if I understand programming but haven't used it.

Include:
- What it solves
- When to use it
- A practical example with TypeScript
- Common mistakes to avoid

Keep it concise.
```

### 6. Architecture Decisions

```
Context: [describe your system/feature]

I need to decide between:
- Option A: [describe]
- Option B: [describe]

Compare them considering:
- Complexity for a small team
- Scalability
- Maintenance cost

Recommend one with reasoning.
```

### 7. Writing Tests

```
Write unit tests for this service using Vitest:

[paste service code]

Cover:
- Happy path
- Invalid input
- Edge cases (empty, null, duplicate)
- Error propagation

Mock the repository layer. Use describe/it blocks.
```

---

## Quick Patterns

For fast, everyday prompts when full templates are overkill:

| Need              | Prompt pattern                                              |
| ----------------- | ----------------------------------------------------------- |
| Fix an error      | `Fix this error: [error]. Code: [code]`                     |
| Type help         | `What TypeScript type should I use for [describe]?`         |
| Quick query       | `Write a Prisma query to [describe]. Include types.`        |
| Name things       | `Suggest clear names for a function that [describe action]` |
| Validate approach | `Is this the right approach for [goal]? [paste code]`       |
| Convert code      | `Convert this to async/await: [paste code]`                 |

---

## Modifiers

Add these to any prompt to control the output:

| Modifier                        | Effect                                |
| ------------------------------- | ------------------------------------- |
| `"Be concise"`                  | Shorter answers, no filler            |
| `"Show only the code"`          | Skip explanations                     |
| `"Explain your reasoning"`      | Step-by-step thought process          |
| `"Use my existing patterns"`    | + paste an example from your codebase |
| `"Production-ready"`            | Error handling, edge cases, types     |
| `"Compare alternatives"`        | Pros/cons of different approaches     |
| `"In Spanish"` / `"In English"` | Control response language             |

---

## Anti-Patterns — What NOT to Do

| ❌ Bad            | ✅ Better                                                                                         |
| ----------------- | ------------------------------------------------------------------------------------------------- |
| "Make my API"     | "Create a POST /bookings endpoint that validates plate number and parking lot capacity"           |
| "Fix it"          | "This returns 500 instead of 400 when email is missing. Here's the controller: [code]"            |
| "Is this good?"   | "Review this for N+1 queries and suggest fixes: [code]"                                           |
| "Write tests"     | "Write 5 unit tests for BookingService.checkIn covering success, invalid plate, and full parking" |
| Pasting 500 lines | Paste only the relevant function + its interface                                                  |
| No context at all | "Express + Prisma + TS project. Layered architecture. [then your question]"                       |

---

## Context Loading — How to Start a Session

When starting a conversation with an AI about your project, front-load context:

```
Project: CoPark — Parking management REST API
Stack: TypeScript, Express, Prisma, PostgreSQL, Zod, Docker
Architecture: Controller → Service → Repository (layered)
Auth: JWT with bcrypt
Docs: OpenAPI/Swagger auto-generated

Today I'm working on: [specific task]
```

> This single paragraph at the start of a session saves you from repeating context in every prompt.

---

## Iteration Loop

The best results come from iteration, not one-shot prompts:

```
1. Prompt → Get initial result
2. "Now add error handling for [specific case]"
3. "Refactor the validation into a separate function"
4. "Add types for the response object"
5. "Make it match this pattern: [paste example]"
```

Each follow-up is small and specific. This beats trying to get everything perfect in one prompt.

---

## File-Specific Prompts for Your Stack

### Prisma Schema

```
Add a [Model] to my Prisma schema with:
- Fields: [list fields with types]
- Relations: [describe relationships]
- Indexes: [if needed]

Follow this existing model as reference:
[paste one of your existing models]
```

### Zod Validation

```
Create Zod schemas for [feature]:
- createSchema: [required fields]
- updateSchema: [optional fields, partial]
- querySchema: [filters with coercion for pagination]

Include descriptive error messages. Use z.object, z.string, z.coerce.
```

### Express Middleware

```
Create an Express middleware that:
- [what it does]
- Handles errors with next(error)
- Is typed with Request, Response, NextFunction
- Follows this pattern: [paste existing middleware]
```

---

## Summary

```
Specific > Vague
Context > No context
Constraints > Open-ended
Iterate > One-shot
Minimal code paste > Entire file dump
```

> The AI is a tool. The quality of its output is directly proportional to the quality of your input.
