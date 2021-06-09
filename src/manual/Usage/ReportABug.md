# How to Report A Bug

> ## Warning Against Accidental Vulnerability Disclosure
>
> You may not realize it, but your bug could be a security issue. Please [review our Security Policy](https://github.com/Cisco-Talos/clamav/security) to determine if your bug is a security issue ***before*** you create a public ticket on GitHub issues.
>
> GitHub Issues are *public* reports and security issues **must** be reported in private.

## Steps Before You Report

If you find a bug in ClamAV, please do the following before you submit a bug report:

1. Verify if the bug exists in the most recent stable release or ideally check if the bug exists in the latest unreleased code in Git before reporting the issue.

2. Review [the open issues](https://github.com/Cisco-Talos/clamav/issues?q=is%3Aopen+is%3Aissue) to make sure someone else hasn't already reported the same issue.

   > _Tip_: Before switching to GitHub Issues, ClamAV used Bugzilla. You can also review [older open tickets from the Bugzilla archive](https://bugzilla.clamav.net/buglist.cgi?bug_status=UNCONFIRMED&bug_status=NEW&bug_status=ASSIGNED&bug_status=NEEDINFO&bug_status=REOPENED&classification=ClamAV&limit=0&list_id=162358&order=changeddate%20DESC%2Cbug_status%2Cpriority%2Cassigned_to%2Cbug_id&product=ClamAV&query_format=advanced&resolution=---).

3. Collect the required information, described below, to include with your report.

4. Create a [new ticket on GitHub](https://github.com/Cisco-Talos/clamav/issues/new).

Please do not submit bugs for third party software.

## Required Information

Please be sure to include all of the following information so that we can effectively address your bug:

+ __ClamAV version, settings, and system details:__

  On the command line, run:
  ```bash
  clamconf -n
  ```

  ClamConf will print out configuration information and some system information. The `-n` option prints out only non-default options. This information will help the team identify possible triggers for your bug.

+ __3rd party signatures:__

  Please tell us if you are using any unofficial signature databases, that is anything other than `main.cvd/cld`, `daily.cvd/cld`, and `bytecode.cvd/cld`

+ __How to reproduce the problem:__

  Include specific steps needed to reproduce the issue.

  If the issue is reproducible only when scanning a specific file, attach it to the ticket.

  *Large Files*: The maximum size for file attachments on GitHub Issues is 25MB and the maximum size for images is 10MB. If the file is too big to mail it, you can upload it to a password protected website and send us the URL and the credentials to access it.

  If your file must be kept confidential you can reach out on the [ClamAV Discord chat server](https://discord.gg/6vNAqWnVgw) to exchange email addresses and to share the zipped file or to share the zip password.

  > **CAUTION**: Don’t forget to encrypt it or you may cause damage to the mail servers between you and us!
  >
  > On the command line, run:
  > ```bash
  > zip -P virus -e file.zip file.ext
  > ```
