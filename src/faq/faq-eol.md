# End of Life Policy (EOL)

The naming convention for ClamAV releases uses three numbers (X.Y.Z) where the first two (X.Y) identify a feature release and the last one (Z) a patch release.

As of April, 2021, the latest feature release is 0.103.0 and the latest patch release is 0.103.2.

## ClamAV Versions Supported by the Official Signature Databases

Before releasing a signature database (CVD) update, we verify that it can be correctly loaded by the latest two feature releases of ClamAV and all the patch versions released after each of them.

We only check the CVD update for false positives using the latest patch release (or feature release, in case there has been no patch release after the last feature release).

**Disclaimer**: if this policy has to change due to a compatibility problem that prohibits the use of new detection technology, or impacts the stability of ClamAV infrastructure, we will announce the end of life for those versions four months before they become unsupported.

Currently, every version from ClamAV 0.99 and down, including all patch versions, are unsupported, and **are actively blocked from downloading new updates**.

## ClamAV Versions Receiving Back-ported Security Patches

Like all bugs, security patches are prepared for our upcoming feature release. Only security patches and other critical fixes or critical improvements are backported to previous feature releases. The ClamAV team is small and can't afford to port fixes back very far. To keep momentum making progress on new features, improvements, and minor bug fixes, our policy is to backport no further than 1 or 2 feature releases.

Our team also feels strongly that as a security product, newer ClamAV versions offer improved malware detection efficacy and that it is important for users to upgrade to newer ClamAV versions even on older long-term-support (LTS) Linux distributions. We ask that package maintainers make every effort to upgrade packages to newer ClamAV versions during the lifetime of an LTS distribution, unless you have reason to believe that upgrading users to the new ClamAV version would break things for your users.

### Situation 1: Security Patches Less than 6 Months After a Feature Release

If the non-disclosure / release date for a security patch falls within 6 months since the previous feature release was published, we will craft a security patch version for the future feature release, the current feature release, and the previous feature release.

As an example, let's say ClamAV 0.102.0 was just released and development begins on 0.103. But shortly after the release or as we're preparing for the release, it is discovered that 0.102.0 contains one or more security issues. We understand with such a recent release, not everyone has had time to verify that they can indeed upgrade without some other supporting changes to their system or product. In this situation, we would prepare a security patch version for the 0.102 feature version (eg. 0.102.1) and for the 0.101 feature version (eg. 0.101.5). Once both releases have been published, the same or equivalent fixes will be merged into the `main` branch for inclusion into the next feature release (0.103.0).

### Situation 2: Security Patches After a Breaking Change

On rare occasion we have made breaking changes the way that users or other software interact with ClamAV or libclamav. The 0.101.0 release was one such example where we made a breaking change to the libclamav programming API. When this happens, we will provide extra time for users to upgrade to a newer feature release before we discontinue support for the older feature release.

The amount of extra time before we discontinue support will vary depending on the severity of the breaking change and the level of difficulty to upgrade.

### Situation 3: Security Patches More than 6 Months After a Feature Release Has Been Available

If the non-disclosure / release date for a security patch falls after 6 months since the previous feature release was published, we will only craft a security patch version for the future feature release and the current feature release.

For example, if 0.102.0 was released in January and a security issue was found in May, but the non-disclosure agreement allowed for the bug to be patched after the standard 90 days, then a security patch release will likely be prepared for release in early August. This would exceed our 6-month policy, so we would publish the fix in 0.102.1 but would not publish a patch version for the 0.101 series.
