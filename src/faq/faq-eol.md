# End of Life (EOL) Policy

This document describes the End of Life (EOL) policy for Long Term Support (LTS) feature releases and for regular (non-LTS) feature releases.

Skip to our [Version Support Matrix](#version-support-matrix) to quickly check if your version is still supported.

> _Disclaimer_: If this policy has to change due to a compatibility problem that prohibits the use of new detection technology, or impacts the stability of ClamAV infrastructure, we will announce the end of life for those versions four months before they become unsupported.

## Long Term Support (LTS) Feature Releases

ClamAV ***1.4*** is the latest Long Term Support (LTS) feature release.

ClamAV ***1.0*** is the previous Long Term Support (LTS) feature release.

LTS feature releases will be supported for *at least* **three (3)** years from the initial publication date of that LTS feature version. In other words, support for the LTS release "X.Y" starts when version "X.Y.0" is published and ends three years after.

Each LTS feature release will be supported with critical patch versions for the duration of the three year support period.

Each LTS feature release will be supported with access to download signatures for the duration of the three year support period plus one additional year. The additional year is to allow package distributions to extend support by backporting security fixes after official support for patch versions has ended.

A new LTS feature release will be identified *approximately* every **two (2)** years.

*Users must stay up-to-date with the latest patch versions for continued support.*

## Regular (non-LTS) Feature Releases

Non-LTS feature releases will be supported with critical patch versions for *at least* **four (4) months** from the initial publication date of the ***next*** feature release or until the *next*-***next*** feature release is published.

Non-LTS feature releases will be allowed access to download signatures until at least four (4) months after the *next*-***next*** feature release is published.

## Definitions

- *"feature release"* -- A version starting with MAJOR.MINOR.0 to include all PATCH versions.

  For example: 1.0.0 and 1.0.1 are both "patch versions" within the same "feature release".

- *"patch version"* -- A specific MAJOR.MINOR.PATCH version.

  For example: 1.0.1 is a "patch version" in the 1.0 "feature release".

- *"end of life" (EOL)* -- The date after which the ClamAV Team will no longer support a feature version in any way.

  After this point, all patch versions of that release may be blocked from downloading official signature content.

- *"long term support (LTS) release"* -- A feature release that will get critical patch versions for an extended period.

  The latest patch version will continue to get access to download signature databases for the duration of the support period. See [above](#long-term-support-lts-feature-releases) for policy details.

- *"regular (non-LTS) release"* -- A feature release that will only be supported until a little after the next feature release.

  The latest patch version will continue to get access to download signature databases a little longer than that, but users are encouraged to upgrade and may be vulnerable if a security patch is only published for the next feature release and they fail to upgrade. See [above](#regular-non-lts-feature-releases) for policy details.

- *"support"* -- The ClamAV project defines "support" in several ways:

  1. *Critical patch support*:

     The ClamAV Team provides critical patch versions for supported feature releases([**](#additional-detail-about-critical-patch-support)).

     The Application Binary Interface (ABI) shall not change between patch versions within a given feature release. That is, the SONAMEs for the ClamAV libraries will remain the same and changes in a patch version will not break compatibility with older library versions.

     Users are responsible for updating to the latest patch version for continued support.

  2. *Signature Database (CVD) Access*:

     Supported releases are allowed free access to download the latest signature databases.

     Users must keep up-to-date with the latest patch version to maintain access to the official signature database content.

     We reserve the right to block older/problematic patch versions 4 months after the release of a newer patch version.

  3. *New-Signature Load/Functional Testing*:

     The ClamAV Team will load-test new sigantures for functional correctness on **all versions** that are allowed access to download the official signature databases.

  4. *New-Signature False Positive Testing*:

     The ClamAV Team will perform false positive testing for new signature content, but only using the latest patch version of the latest feature release. False positive testing requires scanning large data sets. It is more time consuming than functional testing.

  Cisco does not offer paid technical support or paid extended long term support for ClamAV.

## Version Support Matrix

| Feature release | First Published | Latest patch version | Expected End of Life (EOL)   | Signature load testing until | Signature FP testing until   | DB downloads allowed until   | Patch versions continue until                  |
| --------------- | --------------- | -------------------- | ---------------------------- | ---------------------------- | ---------------------------- | ---------------------------- | ---------------------------------------------- |
| 1.5             | TBD             | n/a                  | 1.7 + 4 months               | 1.7 + 4 months               | 1.6 published                | 1.7 + 4 months               | 1.6 + 4 months, or 1.7                         |
| **1.4  LTS**    | **Aug-15 2024** | **1.4.3**            | **Aug-15 2027** (3 years)    | **Aug-15 2027**  (3 years)   | **Aug-15 2027** (3 years)    | **Aug-15 2028**  (4 years)   | **Aug-15 2027**  (3 years)                     |
| 1.3             | Feb-7 2024      | 1.3.2                | 1.5 + 4 months               | 1.5 + 4 months               | Aug-15 2024 (1.4 published)  | 1.5 + 4 months               | 1.4 + 4 months, or 1.5                         |
| 1.2             | Aug-28 2023     | 1.2.3                | 1.4 + 4 months               | 1.4 + 4 months               | Feb-7 2024 (1.3 published)   | 1.4 + 4 months               | Jun-7 2024 or earlier (1.3 + 4 months, or 1.4) |
| 1.1             | May-1 2023      | 1.1.3                | Jun-7 2024 (1.3 + 4 months)  | Jun-7 2024 (1.3 + 4 months)  | Aug-28 2023 (1.2 published)  | Jun-7 2024 (1.3 + 4 months)  | Dec-28 2023 (1.2 + 4 months, or 1.3)           |
| **1.0 LTS**     | **Nov-28 2022** | **1.0.9**            | **Nov-28 2025** (3 years)    | **Nov-28 2025** (3 years)    | May-1 2023 (1.1 published)   | **Nov-28 2026** (4 years)    | **Nov-28 2025** (3 years)                      |
| 0.105           | May-4 2022      | 0.105.2              | Sep-1 2023 (1.1 + 4 months)  | Sep-1 2023 (1.1 + 4 months)  | Nov-28 2022 (1.0 published)  | Sep-1 2023 (1.1 + 4 months)  | Mar-28 2023 (1.0 + 4 months, or 1.1)           |
| 0.104           | Sep-3 2021      | 0.104.4              | Mar-28 2023 (1.0 + 4 months) | Mar-28 2023 (1.0 + 4 months) | May-4 2022 (0.105 published) | Mar-28 2023 (1.0 + 4 months) | Sep-4 2022 (0.105 + 4 months, or 1.0)          |
| **0.103 LTS**   | **Sep-14 2020** | **0.103.12**         | **Sep-14 2024** (3 years +1) | **Sep-14 2024** (3 years +1) | Sep-3 2021 (0.104 published) | **Sep-14 2025** (4 years +1) | **Sep-14 2024** (3 years +1)                   |
| 0.102           | Oct-2 2019      | 0.102.5              | Jan-3 2022 (0.104 + 4 mo.)   | Jan-3 2022                   |                              | Jan-3 2022                   |                                                |
| 0.101           | Dec-3 2018      | 0.101.5              | Jan-3 2022                   | Jan-3 2022                   |                              | Jan-3 2022                   |                                                |
| 0.100           | Apr-9 2018      | 0.100.3              | Oct-29 2021                  | Oct-29 2021                  |                              | Oct-29 2021                  |                                                |
| 0.99            | Dec-1 2015      | 0.99.4               | Mar-1 2021                   |                              |                              |                              |                                                |

Currently, every version from ClamAV 0.105 and down, including all patch versions, are unsupported, and **are actively blocked from downloading new updates**.

## Additional Detail About Critical Patch Support

Like all bugs, security patches are first prepared for our upcoming feature release. Only security patches and other critical fixes or critical improvements are backported to previous feature releases.

The ClamAV Team is small and can't afford to publish patch versions for every release. To keep up momentum crafting new features and other improvements, our policy is to backport no further than 1 or 2 of the latest feature releases plus the Long Term Support (LTS) feature releases.

### Critical Patches After a Breaking Change

On rare occasion we have made breaking changes to the way that users or other software interact with ClamAV or libclamav. The 0.101.0 release was one such example where we made a breaking change to the libclamav programming API. When this happens, we will provide extra time for users to upgrade to a newer feature release before we discontinue support for the older feature release.

The amount of extra time before we discontinue support will vary depending on the severity of the breaking change and the level of difficulty to upgrade.

### Examples

#### Security Patches Less than four (4) Months After a Feature Release

If the non-disclosure / release date for a security patch falls within four (4) months since the previous feature release was published, we will craft a security patch version for the future feature release, the current feature release, the previous feature release, and any LTS feature releases.

> *Example*: Let's say ClamAV 1.6.0 was just released and development begins on 1.7. But shortly after the release or as we're preparing for the release, a security issue is discovered that affects 1.6 and all prior versions.
>
> We understand with such a recent release, not everyone has had time to verify that they can indeed upgrade without some other supporting changes to their system or product.
>
> In this situation, we would prepare a security patch version for:
> - the 1.6 feature release (e.g., 1.6.1),
> - the 1.5 feature release (e.g., 1.5.2),
> - the 1.4 LTS feature release (e.g., 1.4.4),
> - and the 1.0 LTS feature release (e.g., 1.0.10).
>
> Once the critical patch versions have been published, the same or equivalent fixes will be merged into the `main` branch for inclusion into the next feature release (0.106.0).

#### Security Patches More than four (4) Months After a Feature Release Has Been Available

If the non-disclosure / release date for a security patch falls after four (4) months since the previous feature release was published, we will only craft a security patch version for the future feature release, the current feature release, and any LTS feature releases.

> *Example*: If 1.5.0 was released in January and a security issue was found in March, but the non-disclosure agreement allowed for the bug to be patched after the standard 90 days, then a security patch release will likely be prepared for release in early June.
>
> This would exceed our 4-month policy, so we would publish the fix:
> - in 1.6 (eg. 1.6.1),
> - the 1.4 LTS feature release (e.g., 1.4.4),
> - and the 1.0 LTS feature release (e.g., 1.0.10).
>
> ... but would not publish a patch version for the 1.5 feature release.
