```markdown
# pg-manager-pro Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches the core development patterns and conventions used in the `pg-manager-pro` repository, a TypeScript React application. You'll learn about file naming, import/export styles, commit message conventions, and how to write and organize tests. This guide is ideal for onboarding new contributors or maintaining consistency across the codebase.

## Coding Conventions

### File Naming
- **Pattern:** PascalCase
- **Example:**  
  - `UserProfile.tsx`
  - `DatabaseManager.ts`

### Import Style
- **Pattern:** Alias imports are preferred.
- **Example:**
  ```typescript
  import { DatabaseService } from '@services/DatabaseService';
  import { UserProfile } from '@components/UserProfile';
  ```

### Export Style
- **Pattern:** Mixed (both default and named exports are used).
- **Example:**
  ```typescript
  // Named export
  export function connectDatabase() { ... }

  // Default export
  export default DatabaseManager;
  ```

### Commit Message Conventions
- **Type:** Conventional Commits
- **Prefix:** `feat`
- **Average Length:** ~60 characters
- **Example:**
  ```
  feat: add user authentication to database connection modal
  ```

## Workflows

_No automated workflows detected in this repository._

## Testing Patterns

- **Framework:** Unknown (not detected)
- **File Pattern:** Test files use the `*.test.*` naming convention.
- **Example:**
  - `DatabaseManager.test.ts`
  - `UserProfile.test.tsx`

- **Typical Test File Structure:**
  ```typescript
  import { render } from '@testing-library/react';
  import UserProfile from './UserProfile';

  test('renders user profile', () => {
    render(<UserProfile />);
    // assertions here
  });
  ```

## Commands
| Command | Purpose |
|---------|---------|
| /conventions | Show coding conventions for pg-manager-pro |
| /test-patterns | Show test file naming and structure |
| /commit-guidelines | Show commit message guidelines |
```