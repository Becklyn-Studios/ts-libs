---
"@becklyn/next": minor
---

Move `sass` from `dependencies` to an optional `peerDependency` (`^1.23.0`). As a dependency it pulled `sass > @parcel/watcher > picomatch` into every consumer's production graph, which fails `pnpm audit --prod` because of GHSA-fc5q-39xc-vjpf (picomatch ReDoS, no patched version). The shipped JS never imports sass; it is only needed to compile the `./scss/*` exports, which Next does with the consumer's own sass. If you use the scss exports, keep `sass` as a devDependency in your project.
