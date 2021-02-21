# ClamAV Overview

## `clamscan`

A command line program to scan files and directories that does not require the clamd daemon.

## `clamd`

A multi threaded daemon.

When `clamd` is running, use these tools to interact with it:

* `clamdtop`

  A command line GUI to monitor `clamd`.

* `clamdscan`

  A command line program to scan files and directories through `clamd`.

## `freshclam`

The signature database (cvd) update tool.

## `libclamav`

The ClamAV library - so you can build the ClamAV engine into your programs.

## `sigtool`

A signature database (cvd) manipulation tool - for malware analysts and signaure writers.

## `clambc`

Another signature manipulation tool specifically for bytecode signatures.

## `clamconf`

A tool to check or generate ClamAV configuration files and collect additional information that may be needed to help remotely debug issues.

## `clamav-config`

An additional tool for checking how ClamAV was compiled.
