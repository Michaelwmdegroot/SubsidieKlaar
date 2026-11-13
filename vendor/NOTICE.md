# Vendored dependency notices

Keep these license files and any existing notices inside the distributed bundles with redistributed builds.

| Component | Vendored files | License and attribution | Included license |
| --- | --- | --- | --- |
| [pdf-lib 1.17.1](https://github.com/Hopding/pdf-lib) | `pdf-lib-1.17.1.min.js` | MIT; copyright 2019 Andrew Dillon | [pdf-lib.LICENSE.md](pdf-lib.LICENSE.md) |
| [JSZip 3.10.1](https://github.com/Stuk/jszip) | `jszip-3.10.1.min.js` | **MIT option chosen** from the upstream MIT-or-GPLv3 dual license; Stuart Knightley, David Duponchel, Franz Buchinger and António Afonso | [jszip.LICENSE.md](jszip.LICENSE.md) |
| [Noto Sans Regular](https://github.com/notofonts/noto-fonts) | `NotoSans-Regular.ttf`, embedded copy in `noto-sans-font.js` | SIL Open Font License 1.1; Google. Copied from the system font package. | [NotoSans.LICENSE.txt](NotoSans.LICENSE.txt) |
| [@pdf-lib/fontkit 1.1.1](https://github.com/Hopding/fontkit) | `fontkit-1.1.1.min.js` | MIT; Andrew Dillon's fork of Fontkit by Devon Govett | [fontkit.LICENSE.txt](fontkit.LICENSE.txt) |

Fontkit's exact published 1.1.1 package metadata declares MIT. Its tarball lacks a standalone license file; the included notice preserves the original MIT text and copyright from the identified upstream `foliojs/fontkit` repository, with explicit fork attribution and source provenance. Verified on 13 November 2026.

The Noto copyright file also describes Debian packaging under separate terms. The bundled Noto font itself is identified there as **OFL-1.1**. Existing third-party notices inside the supplied JavaScript bundles remain in place.
