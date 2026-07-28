---
"@becklyn/next": minor
---

Forward `data-tracking-*` attributes as additional keys on the `websiteClick` event.

`useDataEventForwarder` now walks up from the click target and collects every
`data-tracking-*` attribute it finds, camelCasing the remainder of the attribute name into
the pushed event. The nearest ancestor wins, so page-level context can live on `<html>`
while element-level context sits on the clicked element:

```html
<html data-tracking-page-type="location-details-page">
    <a href="tel:..." data-event="ga-button" data-tracking-service-type="workshop-service">
```

```js
{ event: "websiteClick", pageType: "location-details-page", serviceType: "workshop-service", ... }
```

The event is still only pushed for elements below a `[data-event]` ancestor, and the
existing `event`, `dataEvent`, `classList`, `className` and `text` keys always take
precedence.
