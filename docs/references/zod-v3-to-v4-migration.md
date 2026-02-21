# Migration Guide: Zod v3 → v4

This migration guide lists the **breaking changes in Zod 4**, ordered from highest to lowest impact. Many behaviors and APIs were redesigned to be more intuitive and cohesive. Most breaking changes are quality-of-life improvements.

> **Note**: Zod 3 exported several undocumented quasi-internal utilities that were never part of the public API. Changes to those are not documented here.

**Unofficial codemod**: Community-maintained codemod `zod-v3-to-v4` is available.

---

## Installation

```bash
npm install zod@^4.0.0
```

---

## Error Customization

Zod 4 standardizes error customization under a **single `error` parameter**.

### Deprecates `message` parameter

**Zod 4**

```ts
z.string().min(5, { error: 'Too short.' });
```

**Zod 3**

```ts
z.string().min(5, { message: 'Too short.' });
```

---

### Drops `invalid_type_error` and `required_error`

These were removed due to inconsistencies and incompatibility with `errorMap`.

**Zod 4**

```ts
z.string({
  error: (issue) => (issue.input === undefined ? 'This field is required' : 'Not a string'),
});
```

**Zod 3**

```ts
z.string({
  required_error: 'This field is required',
  invalid_type_error: 'Not a string',
});
```

---

### Drops `errorMap` → renamed to `error`

Error maps may now:

- Return a plain string
- Return `undefined` to defer to the next error map

**Zod 4**

```ts
z.string().min(5, {
  error: (issue) => {
    if (issue.code === 'too_small') {
      return `Value must be >${issue.minimum}`;
    }
  },
});
```

**Zod 3**

```ts
z.string({
  errorMap: (issue, ctx) => {
    if (issue.code === 'too_small') {
      return { message: `Value must be >${issue.minimum}` };
    }
    return { message: ctx.defaultError };
  },
});
```

---

## ZodError

### Updated Issue Formats

**Zod 4 issue types** live under `z.core`:

```ts
import * as z from 'zod';

type IssueFormats =
  | z.core.$ZodIssueInvalidType
  | z.core.$ZodIssueTooBig
  | z.core.$ZodIssueTooSmall
  | z.core.$ZodIssueInvalidStringFormat
  | z.core.$ZodIssueNotMultipleOf
  | z.core.$ZodIssueUnrecognizedKeys
  | z.core.$ZodIssueInvalidValue
  | z.core.$ZodIssueInvalidUnion
  | z.core.$ZodIssueInvalidKey
  | z.core.$ZodIssueInvalidElement
  | z.core.$ZodIssueCustom;
```

All issues still conform to the same base interface:

```ts
export interface $ZodIssueBase {
  readonly code?: string;
  readonly input?: unknown;
  readonly path: PropertyKey[];
  readonly message: string;
}
```

---

### Error Map Precedence Change

Schema-level error maps now **override** parse-level maps.

```ts
const mySchema = z.string({ error: () => 'Schema-level error' });

// Zod 4
mySchema.parse(12, { error: () => 'Contextual error' });
// → "Schema-level error"
```

---

### Deprecated APIs

- `ZodError.format()` → use `z.treeifyError()`
- `ZodError.flatten()` → use `z.treeifyError()`
- `.formErrors` → removed
- `.addIssue()` / `.addIssues()` → push directly to `error.issues`

---

## z.number()

- Infinite values are no longer allowed
- `.safe()` behaves like `.int()` and no longer accepts floats
- `.int()` only allows **safe integers**

Use `z.int()` instead.

---

## z.string() Updates

### Format validators moved to top-level

```ts
z.email();
z.uuid();
z.url();
z.base64();
z.base64url();
z.ipv4();
z.ipv6();
z.iso.date();
z.iso.datetime();
```

Method forms like `z.string().email()` still work but are **deprecated**.

---

### UUID Validation

- `z.uuid()` → strict RFC 4122 / 9562
- `z.guid()` → permissive UUID-like

---

### Removed APIs

- `z.string().ip()` → use `z.ipv4()` / `z.ipv6()`
- `z.string().cidr()` → use `z.cidrv4()` / `z.cidrv6()`

---

## z.coerce

Input type is now `unknown`:

```ts
z.input<typeof z.coerce.string()>; // unknown
```

---

## .default() Behavior Change

Defaults now **short-circuit parsing** and must match the **output type**.

```ts
z.string()
  .transform((v) => v.length)
  .default(0);
```

Use `.prefault()` to replicate Zod 3 behavior.

---

## z.object()

### Defaults apply inside optional fields

```ts
z.object({
  a: z.string().default('tuna').optional(),
}).parse({});
// Zod 4 → { a: 'tuna' }
```

---

### Deprecated Object APIs

- `.strict()` → `z.strictObject()`
- `.passthrough()` → `z.looseObject()`
- `.strip()` → unnecessary
- `.nonstrict()` → removed
- `.deepPartial()` → removed

---

### unknown / any no longer optional

```ts
// Zod 4
{
  a: any;
  b: unknown;
}
```

---

### `.merge()` deprecated

Use `.extend()` or object spread instead.

---

## Enums

- `z.nativeEnum()` deprecated
- `z.enum()` now accepts enum objects

```ts
z.enum(Color);
```

Removed:

- `.Enum`
- `.Values`

---

## z.array()

`.nonempty()` no longer narrows tuple types.

Use `z.tuple()` for `[T, ...T[]]` semantics.

---

## z.promise() Deprecated

Just `await` before parsing.

---

## z.function()

Now a **function factory**, not a schema.

```ts
const fn = z.function({
  input: [z.object({ name: z.string() })],
  output: z.string(),
});
```

Use `.implementAsync()` for async functions.

---

## refine() Changes

- Type predicates no longer narrow inferred types
- `ctx.path` removed
- Function overload removed

---

## Other Removed APIs

- `z.ostring()`, `z.onumber()`, etc
- `z.literal(Symbol)`
- `ZodType.create()` factories

---

## z.record()

- Single-argument usage removed
- Enum keys are now **required by default**

Use `z.partialRecord()` for optional keys.

---

## z.intersection()

Unmergeable intersections now throw a **regular Error**, not a ZodError.

---

## Internal Changes (Advanced)

- `ZodType<Output, Input>` generics simplified
- `z.ZodTypeAny` removed
- New `z.core` namespace
- `._def` moved to `._zod.def`
- `ZodEffects`, `ZodPreprocess`, `ZodBranded` removed
- New `ZodTransform` and `ZodPipe`

---

## Summary

Zod 4 is faster, more consistent, and more explicit. Most breaking changes improve correctness, type-safety, and long-term maintainability.
