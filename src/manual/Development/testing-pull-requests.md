# Reviewing & Testing Pull Requests

The tools available on GitHub are fantastic for reviewing code changes, but less so for checking out those code changes on your local machine to build and test them.

With a simple tweak to your `.git/config` file in a clone of the `Cisco-Talos/clamav` repository, you can simply check out another developer's pull request as a branch to build and test it.

First, if you don't already have a clone of the upstream repository, do this:

```bash
git clone https://github.com/Cisco-Talos/clamav.git
```

Then, in your favorite text editor, open `.git/config` and add the following line at the end of the `[remote "origin"]` section.  Don't delete or replace anything, just add the following line:

```
fetch = +refs/pull/*/head:refs/remotes/origin/PR-*
```

> _Tip_: The above works for GitHub Cloud and GitHub Enterprise servers. If you happen to work with GitLab or BitBucket, you can do this instead for the same effect:
>
> For BitBucket repos:
> ```
> fetch = +refs/pull-requests/*/from:refs/remotes/origin/PR-*
> ```
>
> For GitLab repos:
> ```
> fetch = +refs/merge-requests/*/head:refs/remotes/origin/PR-*
> ```

Now you may run the following to test the pull request. Substitute `#` with the pull request number found on the website:
```bash
git fetch
git checkout PR-#
```

At this point, you should find yourself in a branch containing the PR contributor's changes.
