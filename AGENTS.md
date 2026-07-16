<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Claude Code Delegation

For simple or medium-difficulty coding tasks, prefer delegating bounded work to Claude Code through WSL2 when it is safe to do so.

Use this invocation pattern from Windows PowerShell:

```powershell
wsl.exe -e sh -lc "cd /mnt/d/mythrealms-shop && claude -p 'TASK_PROMPT'"
```

Keep complex architecture decisions, risky changes, final integration, and user-facing accountability in Codex. After Claude Code finishes, review its changes before finalizing.
