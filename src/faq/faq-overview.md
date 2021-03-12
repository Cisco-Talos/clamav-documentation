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

* `clamav-milter`

  A daemon that performs email filter scannning through `clamd`.

* `clamonacc` (Linux-only)

  A daemon that receives on-access events from the kernel for real-time protection scanning through `clamd`.

## `freshclam`

The signature database (cvd) update tool.

## `libclamav`

The ClamAV library - so you can build the ClamAV engine into your programs.

## `libfreshclam`

The Freshclam library - so you can build the signature update update features into your programs.

## `sigtool`

A signature database (cvd) manipulation tool - for malware analysts and signaure writers.

## `clambc`

Another signature manipulation tool specifically for bytecode signatures.

## `clamconf`

A tool to check or generate ClamAV configuration files and collect additional information that may be needed to help remotely debug issues.

## `clamav-config`

A script for checking how ClamAV was compiled.

## `clamav-bytecode-compiler`

A compiler for the bytecode executable signature plugins.

> _Note_: This tool shipped separately. See the [ClamAV Bytecode Compiler project on Github](https://github.com/Cisco-Talos/clamav-bytecode-compiler).
