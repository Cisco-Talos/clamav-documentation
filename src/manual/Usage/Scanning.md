# Scanning

Table Of Contents

- [Scanning](#scanning)
	- [Daemon](#daemon)
		- [ClamD](#clamd)
		- [ClamDScan](#clamdscan)
		- [ClamDTop](#clamdtop)
		- [On-Access Scanning](#on-access-scanning)
			- [ClamOnAcc (v0.102+)](#clamonacc-v0102)
		- [ClamD (v0.101)](#clamd-v0101)
	- [One-Time Scanning](#one-time-scanning)
		- [ClamScan](#clamscan)
			- [Some basic scans](#some-basic-scans)
	- [Disclaimers](#disclaimers)
	- [Windows-specific Issues](#windows-specific-issues)
		- [Globbing](#globbing)
		- [File paths](#file-paths)
			- [Socket and libclamav API Input](#socket-and-libclamav-api-input)

> _Tip_: The commands on Windows are generally the same, but you may need to add the `.exe` extension to run the ClamAV applications.

## Daemon

### ClamD

`clamd` is a multi-threaded daemon that uses *libclamav* to scan files for viruses. Scanning behavior can be fully configured to fit most needs by modifying `clamd.conf`.

As `clamd` requires a virus signature database to run, we recommend setting up ClamAV's official signatures before running `clamd` using `freshclam`.

The daemon works by listening for commands on the sockets specified in `clamd.conf`. Listening is supported over both unix local sockets and TCP sockets.

**IMPORTANT:** `clamd` does not currently protect or authenticate traffic coming over the TCP socket, meaning it will accept any and all of the following commands listed from *any* source. Thus, we strongly recommend following best networking practices when setting up your `clamd` instance. I.e. don't expose your TCP socket to the Internet.

Here is a quick list of the commands accepted by `clamd` over the socket.

- `PING`
- `VERSION`
- `RELOAD`
- `SHUTDOWN`
- `SCAN` *file/directory*
- `RAWSCAN` *file/directory*
- `CONTSCAN` *file/directory*
- `MULTISCAN` *file/directory*
- `ALLMATCHSCAN` *file/directory*
- `INSTREAM`
- `FILDES`
- `STATS`
- `IDSESSION, END`

As with most ClamAV tools, you can find out more about these by invoking the command:

```bash
man clamd
```

The daemon also handles the following signals as so:

- `SIGTERM` - perform a clean exit
- `SIGHUP` - reopen the log file
- `SIGUSR2` - reload the database

It should be noted that `clamd` should not be started using the shell operator `&` or other external tools which would start it as a background process. Instead, you should run `clamd` which will load the database and then daemonize itself (unless you have specified otherwise in `clamd.conf`). After that, clamd is ready to accept connections and perform file scanning.

Once you have set up your configuration to your liking, and understand how you will be sending commands to the daemon, running `clamd` itself is simple. Simply execute the command:

```bash
clamd
```

### ClamDScan

`clamdscan` is a `clamd` client, which greatly simplifies the task of scanning files with `clamd`. It sends commands to the `clamd` daemon across the socket specified in `clamd.conf` and generates a scan report after all requested scanning has been completed by the daemon.

Thus, **to run `clamdscan`, you must have an instance of `clamd` already running** as well.

Please keep in mind, that as a simple scanning client, `clamdscan` cannot change scanning and engine configurations. These are tied to the `clamd` instance and the configuration you set up in `clamd.conf`. Therefore, while `clamdscan` will accept many of the same commands as its sister tool `clamscan`, it will simply ignore most of them as (by design) no mechanism exists to make ClamAV engine configuration changes over the `clamd` socket.

Again, running `clamdscan`, once you have a working `clamd` instance, is simple:

```bash
clamdscan [*options*] [*file/directory/-*]
```

### ClamDTop

`clamdtop` is a tool to monitor one or multiple instances of `clamd`. It has a colorized *ncurses* interface, which shows each job queued, memory usage, and information about the loaded signature database for the connected `clamd` instance(s). By default it will attempt to connect to the local `clamd` as defined in `clamd.conf`. However, you can specify other `clamd` instances at the command line.

To learn more, use the commands

```bash
man clamdtop
```

or

```bash
clamdtop --help
```

### On-Access Scanning

The ClamOnAcc application provides On-Access Scanning for Linux systems. On-Access Scanning is a form of real-time protection that uses ClamD to scan files when they're accessed.

#### ClamOnAcc (v0.102+)

ClamAV's On-Access Scanning (`clamonacc`) is a client that runs in its own application alongside, but separately from the `clamd` instance. The On-Access Scanner is capable of preventing access to/from any malicious files it discovers--based on the verdict it receives from `clamd`--but by default it is configured to run in notify-only mode, which means it will simply alert the user if a malicious file is detected, then take any additional actions that the user may have specified at the command line, but it will not actively prevent processes from reading or writing to that file.

> **Disclaimer**: Enabling Prevention mode will seriously impact performance if used on commonly accessed directories.

> _Tip_: You can run ClamOnAcc multiple times simultaneously, each with a different config. If you want to enable Prevention-mode for one directory, while sticking to notify-only mode for any other monitored directories, that's an option!

On-Access Scanning is primarily set up [through `clamd.conf`](Configuration.md#on-access-scanning). However, you can learn more about all the configuration and command line options available to you by reading the [On-Access Scanning User Guide](../OnAccess.md).

Once you have set up the On-Access Scanner (and `clamd`) to your liking, you will first need to run `clamd` before you can start it. If your `clamd` instance is local, it is required you run clamd as a user that is excluded (via `OnAccessExcludeUname` or `OnAccessExcludeUID`) from On-Access scanning events (e.g.) to prevent `clamonacc` from triggering events endlessly as it sends scan requests to `clamd`:

```bash
su - clamav -c "/usr/local/bin/clamd
```

After the daemon is running, you can start the On-Access Scanner. `clamonacc` must be run as root in order to utilize its kernel event detection and intervention features:

```bash
sudo clamonacc
```

It will run a number of startup checks to test for a sane configuration, and ensure it can connect to `clamd`, and if everything checks out `clamonacc` will automatically fork to the background and begin monitoring your system for events.

### ClamD (v0.101)

In older versions, ClamAV's On-Access Scanner is a thread that runs within a `clamd` instance. The On-Access Scanner is capable of blocking access to/from any malicious files it discovers--based on the verdict it finds using the engine it shares with `clamd`--but by default it is configured to run in `notify-only` mode, which means it will simply alert the user if a malicious file is detected, but it will not actively prevent processes from reading or writing to that file.

On-Access Scanning is primarily set up [through `clamd.conf`](Configuration.md#on-access-scanning). However, you can learn more about all the configuration and command line options available to you by reading the [On-Access Scanning User Guide](../OnAccess.md).

Once you have set up the On-Access Scanner to your liking, you will need to run `clamd` will elevated permissions to start it.

```bash
sudo clamd
```

## One-Time Scanning

### ClamScan

`clamscan` is a command line tool which uses *libclamav* to scan files and/or directories for viruses. Unlike `clamdscan`, `clamscan` does *not* require a running `clamd` instance to function. Instead, `clamscan` will create a new engine and load in the virus database each time it is run. It will then scan the files and/or directories specified at the command line, create a scan report, and exit.

By default, when loading databases, `clamscan` will check the location to which `freshclam` installed the virus database signatures. This behavior, along with a myriad of other scanning and engine controls, can be modified by providing flags and other options at the command line.

There are too many options to list all of them here. So we'll only cover a few common and more interesting ones:

- `--log=FILE` - save scan report to FILE
- `--database=FILE/DIR` - load virus database from FILE or load all supported db files from DIR
- `--official-db-only[=yes/no(*)]` - only load official signatures
- `--max-filesize=#n` - files larger than this will be skipped and assumed clean
- `--max-scansize=#n` - the maximum amount of data to scan for each container file
- `--leave-temps[=yes/no(*)]`- do not remove temporary files
- `--file-list=FILE` - scan files from FILE
- `--quiet` - only output error messages
- `--bell` - sound bell on virus detection
- `--cross-fs[=yes(*)/no]` - scan files and directories on other filesystems
- `--move=DIRECTORY` - move infected files into DIRECTORY
- `--copy=DIRECTORY` - copy infected files into DIRECTORY
- `--bytecode-timeout=N` - set bytecode timeout (in milliseconds)
- `--heuristic-alerts[=yes(*)/no]` - toggles heuristic alerts
- `--alert-encrypted[=yes/no(*)]` - alert on encrypted archives and documents
- `--nocerts` - disable authenticode certificate chain verification in PE files
- `--disable-cache` - disable caching and cache checks for hash sums of scanned files

To learn more about the options available when using `clamscan` please reference:

```bash
man clamscan
```

and

```bash
clamscan --help
```

Otherwise, the general usage of clamscan is:

```bash
clamscan [options] [file/directory/-]
```

#### Some basic scans

Run this to scan the files in the current directory:

```bash
clamscan .
```

This will scan the current directory. At the end of the scan, it will display a summary. If you notice in the clamscan output, it only scanned something like 60 files, even though there are more files in subdirectories. By default, clamscan will only scan files in the current directory.

Run this to scan all the files in the current directory:

```bash
clamscan --recursive .
```

Run this to scan ALL the files on your system, it will take **quite** a while. Keep in mind that you can cancel it at any time by pressing `Ctrl-C`:

Linux/Unix:

```bash
clamscan.exe --recursive /
```

Windows:

```bash
clamscan.exe --recursive C:\
```

## Disclaimers

> **Disclaimer**: ClamAV doesn't have a "quick scan" mode. ClamAV is malware detection toolkit, not an endpoint security suite. It's up to you to decide what to scan. A full system scan is going to take a long time with ClamAV or with any anti-virus software.

> **Disclaimer 2**: ClamScan, ClamOnAcc, and ClamDScan each include `--remove` options for deleting any file which alerts during a scan. This is generally a terrible idea, unless your monitoring an upload/downloads directory. False positives happen! You do not want to have the wrong file accidentally deleted. Instead, consider using `--move` or perhaps just `--copy` and set up script with the ClamD `VirusEvent` feature to notify you when something has been detected.

## Windows-specific Issues

### Globbing

Since the Windows command prompt doesn't take care of wildcard expansion, minimal emulation of unix glob() is performed internally. It supports `*` and `?` only.

### File paths

Please always use the backslash as the path separator. SMB Network shares and UNC paths are supported.

#### Socket and libclamav API Input

The Windows version of ClamAV requires all the input to be UTF-8 encoded.

This affects:

- The API, notably the `cl_scanfile()` function
- ClamD socket input, e.g. the commands `SCAN`, `CONTSCAN`, `MUTLISCAN`, etc.
- ClamD socket output, i.e replies to the above queries

For legacy reasons ANSI (i.e. `CP_ACP`) input will still be accepted and processed as before, but with two important remarks:

1. Socket replies to ANSI queries will still be UTF-8 encoded.
2. ANSI sequences which are also valid UTF-8 sequences will be handled as UTF-8.

As a side note, console output (stdin and stderr) will always be OEM encoded, even when redirected to a file.
