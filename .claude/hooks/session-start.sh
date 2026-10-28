#!/usr/bin/env bash
# SessionStart hook for Claude Code cloud sessions.
#
# This project runs on exactly one Bun (see CLAUDE.md, "Bun 1.4.4, and only Bun 1.4.4")
# and the cloud image ships whichever Bun it was built with. A Bun older than 1.4.3
# has no type checker behind `bun check`, and a different Bun builds different bundle
# bytes, so a session on the wrong Bun can report a check that never ran.
# This installs the pinned version, then installs dependencies from the lockfile.
#
# The pin lives in .bun-version; change it there, in the four repositories together.
set -euo pipefail

# Only cloud sessions: installing a toolchain is not something to do on a laptop.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

project_dir="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)}"
want="$(tr -d '[:space:]' < "$project_dir/.bun-version")"
export PATH="$HOME/.bun/bin:$PATH"

have="$(bun --version 2>/dev/null || true)"
if [ "$have" != "$want" ]; then
  echo "session-start: Bun is '${have:-missing}', this project requires $want; installing" >&2
  installer="$(mktemp)"
  trap 'rm -f "$installer"' EXIT
  curl -fsSL https://bun.sh/install -o "$installer"
  bash "$installer" "bun-v$want" >&2
  have="$(bun --version 2>/dev/null || true)"
fi

if [ "$have" != "$want" ]; then
  echo "session-start: FAILED to get Bun $want (have '${have:-none}'). Do not run bun check or tests." >&2
  exit 1
fi

# Persist for every later command in the session.
if [ -n "${CLAUDE_ENV_FILE:-}" ]; then
  echo 'export PATH="$HOME/.bun/bin:$PATH"' >> "$CLAUDE_ENV_FILE"
fi

cd "$project_dir"
bun install --frozen-lockfile >&2
echo "session-start: Bun $have, dependencies installed" >&2
