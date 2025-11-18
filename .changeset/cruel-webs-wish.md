---
"@becklyn/react-usercentrics": major
---

- Compatibility for usercentrics v2 was removed.
- Compatibility for usercentrics v3 was added instead.
- Update all types.
- `cmp` type changed from `UC` to `UCCmp`.
- `showSecondLayer()` no longer supports the `serviceId` as a parameter.
- removed `forceReload` from the props of `UsercentricsProvider`.
- Add `showServiceDetails()` with `serviceId` as a parameter which shows the details of a specific service. However unlike the old way of doing it with `showSecondLayer()` you don't get the option to accept that service in this window. 
- Add more debugging logs to `console` when `debug` is set to `true` in the props of `UsercentricsProvider` e.g.: `<UsercentricsProvider debug={true}></UsercentricsProvider>`.

