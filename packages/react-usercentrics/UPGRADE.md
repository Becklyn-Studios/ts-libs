2.x to 3.0
==========

### Impementaion of usercentrics

In order to upgrade to 3.0 you need to update the script in the project you are working on to use the version of v3.
This implementation will look similar to this:

```html
    <script id="usercentrics-cmp" src="https://web.cmp.usercentrics.eu/ui/loader.js" data-settings-id="vrxXsPTmG" async></script>
```

Or if you are using NextJS:

```jsx
    <Script
        id="usercentrics-cmp"
        strategy="afterInteractive"
        src="https://web.cmp.usercentrics.eu/ui/loader.js"
        data-settings-id={process.env.NEXT_PUBLIC_USERCENTRICS_SETTINGS_ID}
        data-version={
            process.env.NEXT_PUBLIC_VERCEL_ENV !== "production"
                ? "preview"
                : undefined
        }
    />
```

### Usage of `showSecondLayer()`
*   `showSecondLayer()` no longer supports the `serviceId` as a parameter
*   You can use `showServiceDetails()` with `serviceId` as a parameter which shows the details of a specific service. __However unlike the old way of doing it with `showSecondLayer()` you don't get the option to accept that service in this window.__

### Usage of functions of `cmp`
All new `cmp` methods are now async. Apart from that `denyAllConsents()`, `acceptAllConsents()`, `updateServicesConsents()` and `updateTcfConsents()` will only update the consent status. In order to save consents, you need to call `saveConsents("EXPLICIT" | "IMPLICIT")` after updating consents.

When you are using `cmp` directly you will notice the following.

These functions don't exist anymore because they were removed by usercentrics: 
* `acceptService()`
* `areAllConsentsAccepted()`
* `denyAndCloseCcpa()`
* `rejectService()`
* `getServicesBaseInfo()`
* `getServicesFullInfo()`
* `restartCMP()`
* `restartEmbeddings()`
* `getSettings()`
* `getSettingsCore()`
* `getSettingsUI()`
* `getSettingsLabels()`
* `getTCFVendors()`

These functions were renamed but their functionality should be the same:
* `enableScriptsForServicesWithConsent()` is now `refreshScripts()`
* `clearStorage()` is now `clearUserSession()`

These functions were renamed and now work a bit differently than before:
* `acceptServices()` is now `updateServicesConsents()` and now takes `servicesConsents: ServicesConsents` as a parameter.
* `rejectServices()` is now `updateServicesConsents()` and now takes `servicesConsents: ServicesConsents` as a parameter.
* `updateChoicesForTcf()` is now `updateTcfConsents()` and now takes `decisions: TCFDecisions` as a parameter.


### Usage of `forceReload` in `<UsercentricsProvider />`
It was removed without replacement. If you want to reload data in your app use `[consentUpdate]` as your dependency in your `useEffect()`, `useMemo()` or `useCallback()` and update it in there.
