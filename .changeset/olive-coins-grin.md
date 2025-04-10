---
"@becklyn/react-usercentrics": major
---

(bc) Compatibility for usercentrics v2 was removed.
(bc) Compatibility for usercentrics v3 was added instead.
(bc) Update all types.
(bc) `cmp` type changed from `UC` to `UCCmp`.
(bc) `showSecondLayer()` no longer supports the `serviceId` as a parameter.
(bc) removed `forceReload` from the props of `UsercentricsProvider`.
(feature) Add `showServiceDetails()` with `serviceId` as a parameter which shows the details of a specific service. However unlike the old way of doing it with `showSecondLayer()` you don't get the option to accept that service in this window.
(improvement) Update version of @becklyn/prettier
(improvement) Add more debugging logs to `console` when `debug` is set to `true` in the props of `UsercentricsProvider` e.g.: `<UsercentricsProvider debug={true}></UsercentricsProvider>`.
