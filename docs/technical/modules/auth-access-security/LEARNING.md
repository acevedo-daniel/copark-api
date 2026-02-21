# Auth And Access Security Module - Learning Notes

## What was learned

1. Security in auth is mostly about small defaults
- Pinning JWT algorithms and parsing headers strictly are small changes with high security value.
- Keeping claims explicit (`sub`) makes token behavior easier to reason about.

2. Correct HTTP behavior under concurrency matters
- A previous pre-check (`findByEmail`) is not enough by itself.
- Database constraints are the final source of truth; service layer should map DB constraint errors to domain HTTP errors.

3. DTO chains in Zod are order-sensitive
- Transformations such as `trim()` should happen before length constraints when validation must apply to sanitized values.

4. Hardening can stay simple
- No over-engineering was needed.
- Four focused edits fixed concrete risks without changing architecture.

## Practical checklist for future auth changes

1. If JWT settings change, update both signing and verification paths.
2. Keep auth errors generic enough to avoid credential leakage.
3. Any unique auth field must map DB conflicts to `409`, not `500`.
4. Keep login/register validation bounds consistent.
5. Add/adjust OpenAPI docs in the same PR when contracts change.

## Pending improvements (next iterations)

1. Add rate limiting for `/auth/login` and `/auth/register`.
2. Add auth integration tests for:
- register race condition (`P2002` -> `409`)
- malformed bearer header -> `401`
- unsupported/invalid JWT -> `401`
3. Evaluate refresh-token strategy if session duration requirements increase.
