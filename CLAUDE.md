# Project Rules

## Version Control Setup
- This project follows the conventional version control setup from the global CLAUDE.md (decided 2026-11-18).
- Project root: this directory, the git root.
- Git and gh user: JessHamdaoui (git name Jesser Hamdaoui). Remote: github.com/JesserHamdaoui/medtech-virtual-lab.
- Existing project with history, working tree was clean, so no baseline commit was needed.
- Workspace rules: none found in parent directories.

## Secret Scan
- The gitleaks pre-commit hook is installed, pinned to `v8.30.1`, config in `.pre-commit-config.yaml`.
- Each fresh clone must run `pre-commit install`, because the hook is not committed.
- Never skip it: no `SKIP=` and no `--no-verify`.
- No baseline file.

## Project Notes
- The calorimetry lab is Next.js (React) plus a prebuilt Unity WebGL bench in `public/unity/calorimetry/`.
- The Unity project source is not in this repo. React owns all lab state and sends a snapshot to Unity (`unityState.ts`). Unity only draws it.
- Unity-side visuals, new 3D objects, new snapshot fields and new events need a Unity rebuild and cannot be changed here.

## Notes
