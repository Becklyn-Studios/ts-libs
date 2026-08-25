---
"@becklyn/deployment-protection": patch
---

Set `__becklyn_dp_session` as `SameSite=None; Secure` on HTTPS so the session is sent when a preview is embedded in a third-party iframe (e.g. Contentful live preview). HTTP localhost stays `SameSite=Lax` because browsers reject `SameSite=None` without `Secure`. Also fix `appendSetCookie` so `sameSite: "none"` serializes as `SameSite=None` instead of `SameSite=Noneone`.
