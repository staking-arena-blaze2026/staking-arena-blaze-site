# Staking Arena — BCH Blaze 2026 website

Public native fork of [the original compiled website](https://github.com/scinklja/staking-arena-site).

- **Hackathon website:** https://staking-arena-blaze2026.github.io/staking-arena-blaze-site/
- **Hackathon source:** https://github.com/staking-arena-blaze2026/bch-staking-blaze2026/tree/blaze2026
- **Baseline and judging instructions:** https://github.com/staking-arena-blaze2026/bch-staking-blaze2026/blob/blaze2026/docs/BLAZE_2026_BASELINE.md
- **Original unchanged website:** https://scinklja.github.io/staking-arena-site/
- **Original compiled baseline:** `e685e6bd62381c3a587b3cb1d0c79d2affc0f459`, tag `pre-blaze-2026`.

`.github/workflows/deploy.yml` builds the public source fork's `blaze2026` branch with its original public chipnet configuration and this site's separate Pages base. It commits generated files here and deploys them to this repository's Pages using its own `GITHUB_TOKEN`; no cross-repository credentials are stored. `release.json` records the exact source commit, actual build time and asset hashes.

The workflow checks for source updates every five minutes (GitHub may delay scheduled runs). For an immediate rebuild after pushing frontend changes:

```bash
gh workflow run deploy.yml --repo staking-arena-blaze2026/staking-arena-blaze-site
```

Source code changes belong in the source fork. The compiled files here are generated. Browser wallet authorization remains experimental; the setup verification does not claim live signing or broadcasting. The original website and repositories remain frozen for judging.
