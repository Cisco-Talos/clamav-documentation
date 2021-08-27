# ClamAV Git Work Flow

ClamAV's Git work flow isn't very complicated, but it is more structured than most. It looks like this. Note that in the diagrams below, merged branches are regular merges and will add all of the commits from the source branch to the destination branch. The diagram doesn't show all the merged commits, for simplicity:

![Git Work Flow](../../images/new-git-workflow.png)

`main`:

the development branch. testing is done in pull-requests (PR's), so this branch should be stable, though we make no guarantees.

`rel/0.104`, `rel/1.0`:

Feature release branches. These always contain the latest stable patch versions for each feature release. When development on a feature release (E.g. `dev/0.104`) or a patch release (E.g. `dev/0.104.1`) is complete, they are merged here and tagged.

`dev/0.104.1`:

A development branch used to test hotfixes prior to a patch release

`sec/dev/0.104.1`:

A private development branch used to test security-related hotfixes prior to a patch release. This branch will be rebased like any feature branch as needed up until the release at which point it is merged into the `dev/0.104.1` branch and the `dev/0.104.1` branch is merged into the `rel/0.104` branch and tagged as "`clamav-0.104.1`".

`feature/blah`:

A long-running branch for adding a major feature. It may be rebased several times with the default branch before > it is ready to merge.

`CLAM-####-description`, `issue-####-description`, `bb####-description`:

A branch for working a JIRA task, GitHub issue, or Bugzilla Bug. These are typically only found in a personal > fork and appear as pull requests from the fork to the upstream `clamav` repository.
