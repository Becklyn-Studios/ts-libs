3.0.1
=====

*   (internal) Move export of "types" from root into "exports"-object
*   (internal) update github-actions-packages to newest version. Old ones were deprecated


3.0.0
=====

*   (bc) Compatibility for usercentrics v2 was removed.
*   (bc) Compatibility for usercentrics v3 was added instead.
*   (bc) Update all types.
*   (bc) `cmp` type changed from `UC` to `UCCmp`.
*   (bc) `showSecondLayer()` no longer supports the `serviceId` as a parameter.
*   (bc) removed `forceReload` from the props of `UsercentricsProvider`.
*   (feature) Add `showServiceDetails()` with `serviceId` as a parameter which shows the details of a specific service. However unlike the old way of doing it with `showSecondLayer()` you don't get the option to accept that service in this window. 
*   (improvement) Update version of @becklyn/prettier
*   (improvement) Add more debugging logs to `console` when `debug` is set to `true` in the props of `UsercentricsProvider` e.g.: `<UsercentricsProvider debug={true}></UsercentricsProvider>`.


2.1.1
=====

*   (bug) Fix `consentUpdate` to update it's value.
*   (internal) Update code owners.
*   (internal) Add additional node version to ci.


2.1.0
=====

*   (improvement) Add `@trivago/prettier-plugin-sort-imports` for import sorting.
*   (improvement) Add usercentrics types and events to window to improve autocompletion.
*   (feature) Add `consentUpdate` variable to track possible consent changes.


2.0.3
=====

*   (bug) Fix force reload.


2.0.2
=====

*   (bug) Export types.


2.0.1
=====

*   (bug) Fix types.


2.0.0
=====

*   (bc) Improve api.


1.1.2
=====

*   (improvement) Remove `@becklyn/prettier` from dependencies.
*   (improvement) Make react a peer dependency.


1.1.1
=====

*   (improvement) Make initialize true if debug.


1.1.0
=====

*   (feature) Always return service to be accepted if debug.


1.0.0
=====

*   (bc) Rename project.
*   (improvement) Also return cmp object from hook.


0.2.0
=====

*   (feature) Add debug mode.
*   (feature) Allow custom service IDs.


0.1.0
=====

*   (feature) Add hook.


0.0.2
=====

*   (improvement) Export from `index.ts`.


0.0.1
=====

*   (feature) Initial release.
