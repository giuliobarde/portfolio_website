# Fix timeline: real commits with correct dates on main

## Summary
The **tree** at `timeline-test` (eaff9dc) and current `main` (442d087) are **identical** — the commits after the squash were empty/merge-only. So we can make `main` use the `timeline-test` history and get the real commits (with correct dates and messages) without losing any code.

## What this does
- **Makes `main` point to the same commit as `timeline-test`** (eaff9dc).
- The history on `main` will then include the real commits: 7d966f6 (Full timeline test), 816a889 (Improved full timeline), 0eea84f / 1f8b13d (Fixed full timeline), etc., with their original author dates (Mar 7, 8, 14, 15).
- Your GitHub contribution graph will reflect those dates.

## Commands (run from repo root)

```bash
cd /Users/g/Desktop/Projects/Portfolio
git fetch origin

# Point main at timeline-test's history (same code, real commit dates)
git push origin origin/timeline-test:main --force-with-lease
```

Then update your local main to match:

```bash
git checkout main
git reset --hard origin/main
```

## If something goes wrong
To put `main` back to how it was before (same code, but squash history again):

```bash
git fetch origin
# You’d need to push the old main again; if you don’t have it, use the reflog on GitHub or a backup.
```

## Note
- `--force-with-lease` will refuse to push if someone else updated `main` in the meantime.
- If others use this repo, coordinate before rewriting `main`.
