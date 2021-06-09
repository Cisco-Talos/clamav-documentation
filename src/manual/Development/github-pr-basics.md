# GitHub Pull Request Basics

Like most projects on GitHub, we use a pull request (PR) work flow for contributions to the `clamav` Git repository. This is true both for contributions from the community as well as for those from the core development team here at Cisco.

Historically, our team PRs have been reviewed and merged on an internal upstream Git repository, though we are now migrating to do all work on GitHub directly, with a private backup fork of the project used exclusively for review of security-related fixes and in preparation of each security patch version release.

The general pattern for working with Pull Requests on GitHub is this:

1. You create a fork of the project repository on GitHub.

2. You clone (download) a copy of your fork on your computer.

3. In your local fork, you create a new branch for the feature or bug fix.

4. For each change, you create a Git commit. Your commits may include incomplete work as you're going, so you can save your work each day, in the end you should [edit or squash those commits down](https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History) so that each of your commits represent a single completed task and that the build is never broken for any given commit.

5. You push your commits to your remote fork on GitHub as needed, both to back up your work and to prepare for submitting a pull request for team review. If you've pushed commits and then edited or squashed those commits, you may have a conflict and may need to "force push" in order to update your remote fork.

6. When ready, submit a pull request, either by using the link provided by Git when you do a push, or by using the GitHub website. *Use the pull request description to include instructions for how to test your changes!*

7. There are also some automated tests that get run when you submit a pull request, but you may need to re-run them if something goes wrong with the test infrastructure. Review the test results and work with the other developers to fix any issues with your pull request so it can be approved and merged.

If you're new to all of this, have a look at [GitHub's flow guide](https://guides.github.com/introduction/flow/) for their general recommendations on a basic PR work flow. Then continue in the next section to learn about ClamAV's work flow.
