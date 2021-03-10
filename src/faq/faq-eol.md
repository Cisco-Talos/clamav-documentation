# End of Life Policy (EOL)

The naming convention for ClamAV releases uses three numbers (X.Y.Z) where the first two (X.Y) identify a feature release and the last one (Z) a patch release.

As of February, 2021, the latest feature release is 0.103.0 and the latest patch release is 0.103.1.

Before releasing a CVD update, we verify that it can be correctly loaded by the latest two feature releases of ClamAV and all the patch versions released after each of them.

We only check the CVD update for false positives using the latest patch release (or feature release, in case there has been no patch release after the last feature release).
We only release security fixes for the latest patch release (or feature release, in case there has been no patch release after the last feature release).

**Disclaimer**: if this policy has to change due to a compatibility problem that prohibits the use of new detection technology, or impacts the stability of ClamAV infrastructure, we will announce the end of life for those versions four months before they become unsupported.

Currently, every version from ClamAV 0.99 and down, including all patch versions, are unsupported, and **are actively blocked from downloading new updates**.
