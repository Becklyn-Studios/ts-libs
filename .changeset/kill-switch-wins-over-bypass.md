---
"@becklyn/deployment-protection": patch
---

Honor `DEPLOYMENT_PROTECTION_ENABLED=false` even when `VERCEL_AUTOMATION_BYPASS_SECRET` is set, so the kill switch disables the entire gate (including automation bypass).
