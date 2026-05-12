# ClamD Protocol

Table Of Contents

- [ClamD Protocol](#clamd-protocol)
  - [Overview](#overview)
  - [Socket Types](#socket-types)
  - [Command Framing](#command-framing)
  - [Scan Commands](#scan-commands)
    - [SCAN path](#scan-path)
    - [CONTSCAN path](#contscan-path)
    - [MULTISCAN path](#multiscan-path)
    - [ALLMATCHSCAN path](#allmatchscan-path)
    - [INSTREAM](#instream)
    - [FILDES](#fildes)
    - [Legacy STREAM](#legacy-stream)
  - [Other Commands](#other-commands)
    - [PING](#ping)
    - [VERSION](#version)
    - [VERSIONCOMMANDS](#versioncommands)
    - [RELOAD](#reload)
    - [SELFCHECK](#selfcheck)
    - [SHUTDOWN](#shutdown)
    - [STATS](#stats)
  - [Reading Replies](#reading-replies)
  - [IDSESSION](#idsession)
    - [Using IDSESSION for parallel scanning](#using-idsession-for-parallel-scanning)
    - [Commands accepted inside IDSESSION](#commands-accepted-inside-idsession)
    - [IDSESSION replies](#idsession-replies)
    - [Avoiding IDSESSION deadlocks](#avoiding-idsession-deadlocks)
  - [Protocol Limits](#protocol-limits)
  - [Examples](#examples)
    - [Basic checks](#basic-checks)
    - [INSTREAM example](#instream-example)
    - [FILDES example](#fildes-example)
    - [IDSESSION example](#idsession-example)
  - [ClamDScan Behavior](#clamdscan-behavior)
    - [Mode selection](#mode-selection)
    - [Multiscan behavior](#multiscan-behavior)
    - [Option interactions](#option-interactions)
      - [Transport override options](#transport-override-options)
      - [`--fdpass` with TCP sockets](#--fdpass-with-tcp-sockets)
      - [Remote TCP scans](#remote-tcp-scans)
      - [`--multiscan` and `--allmatch`](#--multiscan-and---allmatch)
      - [`--allmatch`](#--allmatch)
      - [`--multiscan` and `--stream`](#--multiscan-and---stream)
      - [`--multiscan` and `--fdpass`](#--multiscan-and---fdpass)
      - [Quarantine actions](#quarantine-actions)
      - [Quarantine actions with multiscan](#quarantine-actions-with-multiscan)

## Overview

`clamd` is a long-running scanning daemon. Clients such as `clamdscan`, `clamonacc`, mail filters, and custom integrations connect to a configured socket and send simple command records.

Use `clamdscan` for normal command-line scanning. Use this protocol directly when a custom client needs to choose how to submit work: by daemon-visible path, by streamed file contents, or by passing an already-open file descriptor.

Custom clients should use `VERSIONCOMMANDS` during startup or compatibility checks. It reports the command names recognized by the connected daemon. Some recognized commands may still be disabled by `clamd.conf` or unavailable because the required platform support was not compiled in.

## Socket Types

`clamd` can listen on a Unix/local socket, a TCP socket, or both.

Unix/local sockets:

- Support path-based commands such as `SCAN`, `CONTSCAN`, `MULTISCAN`, and `ALLMATCHSCAN`.
- Support `INSTREAM` for streaming file contents.
- Support `FILDES` when ClamAV is built with file descriptor passing support.
- Are the only socket type that can use `FILDES`.

TCP sockets:

- Support path-based commands if the path is meaningful on the daemon host.
- Support `INSTREAM` for sending file contents over the socket.
- Do not support `FILDES`.
- Are not encrypted or authenticated by `clamd`. Do not expose a TCP socket to untrusted networks.

Path-based scan commands are resolved by `clamd`, not by the client. A path sent over TCP must exist on the system where `clamd` runs and must be accessible to the daemon process. When `clamdscan` connects to a remote daemon over TCP, it streams local file contents with `INSTREAM` instead of sending local client paths for the daemon to open.

## Command Framing

New clients should use explicit command framing. The first byte selects the command terminator:

- `zCOMMAND\0` uses a NUL byte as the command terminator. This is the recommended form because it does not conflict with newlines in command arguments.
- `nCOMMAND\n` uses a newline as the command terminator.

In the examples above, `\0` means a literal NUL byte, and `\n` means a literal newline byte.

`clamd` replies with the same record terminator style selected by the command. For example, `zPING\0` receives a NUL-terminated `PONG` reply, and `nPING\n` receives a newline-terminated `PONG` reply. Some multiline diagnostic replies, notably `STATS`, contain embedded newline bytes and end with a final `END` record.

Legacy unprefixed commands are accepted for some commands outside of `IDSESSION`, but new clients should not use them. Unprefixed commands are not accepted inside `IDSESSION`.

Framed command examples:

```text
zPING\0
nVERSIONCOMMANDS\n
zSCAN /srv/uploads/sample.bin\0
```

## Scan Commands

### SCAN path

`SCAN path` scans one file or recursively scans one directory. A full path is required. For directory scans, `SCAN` stops after a virus is found.

### CONTSCAN path

`CONTSCAN path` scans one file or recursively scans one directory and continues scanning after detections are found.

### MULTISCAN path

`MULTISCAN path` scans a directory recursively and asks `clamd` to use multiple worker threads for that directory tree. If the target is not a directory, `clamd` falls back to non-multiscan scanning behavior.

`MULTISCAN` is server-side directory parallelism: the client sends one directory path, and the daemon walks and schedules work for that tree.

### ALLMATCHSCAN path

`ALLMATCHSCAN path` is like `SCAN`, but enables all-match behavior so scanning can continue within a file after a match. This command must use `n` or `z` framing.

`ALLMATCHSCAN` can be disabled with `AllowAllMatchScan` in `clamd.conf`. If disabled, `clamd` returns an error for the command.

### INSTREAM

`INSTREAM` sends file contents to `clamd` on the same socket. This command must use `n` or `z` framing.

After the command record, send one or more chunks. Each chunk starts with a 4-byte unsigned length in network byte order, followed by that many bytes of data:

```text
4-byte big-endian length
chunk bytes
```

End the stream with a zero-length chunk:

```text
00 00 00 00
```

The total streamed size must not exceed `StreamMaxLength` in `clamd.conf`. If the stream exceeds that limit, `clamd` replies with an `INSTREAM size limit exceeded` error.

### FILDES

`FILDES` passes an already-open file descriptor to `clamd` using Unix socket ancillary data. It only works over Unix/local sockets and only when file descriptor passing support is available.

After the `FILDES` command, send the descriptor using an RFC 2292 / BSD 4.4 style ancillary-data message. The descriptor message must include at least one dummy byte. The descriptor may be sent in the same packet as the command or in a subsequent packet.

### Legacy STREAM

The old `STREAM` command is no longer supported by current `clamd`. Use `INSTREAM` instead.

## Other Commands

### PING

`PING` checks whether `clamd` is responding. A healthy daemon replies with `PONG`.

### VERSION

`VERSION` prints the ClamAV program and database version. It is enabled by default and can be disabled with `EnableVersionCommand` in `clamd.conf`. If disabled, `clamd` replies with `COMMAND UNAVAILABLE`.

### VERSIONCOMMANDS

`VERSIONCOMMANDS` prints version information followed by a `COMMANDS:` list. Use this to discover protocol support for the connected daemon.

`VERSIONCOMMANDS` must use `n` or `z` framing.

### RELOAD

`RELOAD` requests a database reload. It is available only when `EnableReloadCommand` is enabled in `clamd.conf`. If unavailable, `clamd` replies with `COMMAND UNAVAILABLE`.

### SELFCHECK

`SELFCHECK` checks whether the loaded databases are current. It is available only when `EnableSelfCheckCommand` is enabled in `clamd.conf`. If unavailable, `clamd` replies with `COMMAND UNAVAILABLE`.

### SHUTDOWN

`SHUTDOWN` requests a clean daemon exit. It is available only when `EnableShutdownCommand` is enabled in `clamd.conf`. If unavailable, `clamd` replies with `COMMAND UNAVAILABLE`.

### STATS

`STATS` prints queue, task, and memory statistics. It is enabled by default and can be disabled with `EnableStatsCommand` in `clamd.conf`. If disabled, `clamd` replies with `COMMAND UNAVAILABLE`.

The exact `STATS` output format is not stable. Parse it as diagnostic text, not as a fixed schema.

## Reading Replies

For non-session commands, read reply records until `clamd` closes the connection. A scan can produce multiple reply records, especially when scanning a directory.

Common scan replies look like:

```text
/path/to/file: OK
/path/to/file: Eicar-Signature FOUND
/path/to/file: Access denied ERROR
stream: OK
stream: Eicar-Signature FOUND
```

The reply record terminator is selected by the command framing: newline for `n` commands and NUL for `z` commands.

For `STATS`, read until the `END` line. `STATS` output contains newline-delimited diagnostic text even when the command uses `z` framing; the final `END` record uses the command terminator.

## IDSESSION

`IDSESSION` lets a client send multiple requests over one socket. Start the session with `zIDSESSION\0` or `nIDSESSION\n`, then send prefixed commands, and finish with `zEND\0` or `nEND\n`.

Every command inside `IDSESSION`, including `END`, must use `n` or `z` framing. Legacy unprefixed commands are rejected inside a session.

### Using IDSESSION for parallel scanning

`IDSESSION` is the client-driven alternative to directory-based `MULTISCAN` for multithreaded scanning.

`MULTISCAN` asks the daemon to walk one directory tree and parallelize that server-side directory scan. `IDSESSION` lets the client send many per-file requests over one connection so `clamd` can dispatch those requests to worker threads while the client keeps control of path resolution, streaming, descriptor passing, filtering, and result-to-action mapping.

### Commands accepted inside IDSESSION

Accepted inside `IDSESSION`:

- `SCAN`
- `INSTREAM`
- `FILDES`
- `VERSION`
- `VERSIONCOMMANDS`
- `PING`
- `STATS`
- `END`

Not accepted inside `IDSESSION`:

- `CONTSCAN`
- `MULTISCAN`
- `ALLMATCHSCAN`
- `RELOAD`
- `SHUTDOWN`
- `SELFCHECK`

`FILDES` inside `IDSESSION` still requires a Unix/local socket and descriptor passing support. `INSTREAM` inside `IDSESSION` uses the same chunk format as non-session `INSTREAM`.

### IDSESSION replies

Replies inside `IDSESSION` are prefixed with the numeric request ID. IDs start at 1 for the first command after `IDSESSION`; the `IDSESSION` command itself does not consume a visible reply ID.

```text
1: /path/a: OK
2: /path/b: Eicar-Signature FOUND
3: PONG
```

Requests are processed asynchronously, so replies can arrive out of order. Match replies to requests by numeric ID, not by arrival order.

Avoid mixing `STATS` with other in-flight session work unless the client is prepared to handle multiline diagnostic output.

### Avoiding IDSESSION deadlocks

An `IDSESSION` client must keep reading replies while it sends more commands. The recommended implementation is a nonblocking socket with `select()` or `poll()`: when sending would block, wait until the socket is writable or there are replies to read.

Alternating blocking `send()` and `recv()` calls can deadlock. If `clamd` detects that a client has deadlocked or is not following the session protocol, it may close the connection.

## Protocol Limits

Path command length is limited by the daemon command receive buffer. Current `clamd` allocates `PATH_MAX + 8` bytes for a command record, plus an internal NUL byte, so the complete framed command must fit in that buffer: the `n` or `z` prefix, command name, separating space when present, path argument, and command terminator.

Because `PATH_MAX` is platform dependent, clients should treat path commands as limited to the daemon host's normal path-length limit. Use `INSTREAM` or `FILDES` when a local client path is too long, ambiguous, or not meaningful on the daemon host.

`INSTREAM` file content is not part of the command-length limit. Each chunk length is a 32-bit unsigned value in network byte order, and the total stream is limited by `StreamMaxLength` in `clamd.conf`. If a chunk would exceed the remaining stream quota, `clamd` replies with an `INSTREAM size limit exceeded` error.

There is no separate configured limit for the total number of requests in one `IDSESSION`. Request IDs are finite implementation integers, so clients should not treat one session as an infinite stream; start a new session for extremely large batches.

In practice, concurrency and queueing are bounded much earlier by `MaxThreads`, `MaxQueue`, file descriptor limits, socket buffers, daemon memory, and timeouts such as `CommandReadTimeout` and `ReadTimeout`. A robust client should cap its own number of in-flight requests and continuously drain replies; it should not enqueue an unbounded tree into one session without backpressure.

## Examples

The following examples use NUL-terminated `z` commands. Replace `/run/clamav/clamd.sock` with the socket configured by `LocalSocket`, or replace the Unix-socket connection code with a TCP socket connection when connecting to `TCPSocket`.

### Basic checks

For quick shell checks against a Unix socket, `nc -U` is convenient:

```bash
printf 'zPING\0' | nc -U /run/clamav/clamd.sock | tr '\0' '\n'
printf 'zVERSIONCOMMANDS\0' | nc -U /run/clamav/clamd.sock | tr '\0' '\n'
printf 'zSCAN /srv/uploads/sample.bin\0' | nc -U /run/clamav/clamd.sock | tr '\0' '\n'
```

For a TCP socket on port 3310:

```bash
printf 'zPING\0' | nc 127.0.0.1 3310 | tr '\0' '\n'
```

### INSTREAM example

This example sends file contents with `INSTREAM`:

```python
import socket
import struct

socket_path = "/run/clamav/clamd.sock"
sample_path = "/srv/uploads/sample.bin"

with open(sample_path, "rb") as sample, socket.socket(socket.AF_UNIX, socket.SOCK_STREAM) as sock:
    sock.connect(socket_path)
    sock.sendall(b"zINSTREAM\0")
    while True:
        chunk = sample.read(1024 * 1024)
        if not chunk:
            break
        sock.sendall(struct.pack(">I", len(chunk)))
        sock.sendall(chunk)
    sock.sendall(struct.pack(">I", 0))

    reply = b""
    while True:
        data = sock.recv(4096)
        if not data:
            break
        reply += data

print(reply.replace(b"\0", b"\n").decode("utf-8", "replace"))
```

### FILDES example

This example sends an open file descriptor with `FILDES`:

```python
import array
import os
import socket

socket_path = "/run/clamav/clamd.sock"
sample_path = "/srv/uploads/sample.bin"

with socket.socket(socket.AF_UNIX, socket.SOCK_STREAM) as sock:
    sock.connect(socket_path)
    sock.sendall(b"zFILDES\0")
    fd = os.open(sample_path, os.O_RDONLY)
    try:
        fds = array.array("i", [fd])
        sock.sendmsg([b"x"], [(socket.SOL_SOCKET, socket.SCM_RIGHTS, fds)])
    finally:
        os.close(fd)

    reply = b""
    while True:
        data = sock.recv(4096)
        if not data:
            break
        reply += data

print(reply.replace(b"\0", b"\n").decode("utf-8", "replace"))
```

### IDSESSION example

This example sends a small bounded batch through `IDSESSION`. Clients that send many requests should use nonblocking I/O and read replies while writing new requests.

```python
import socket

socket_path = "/run/clamav/clamd.sock"
paths = ["/srv/uploads/a.bin", "/srv/uploads/b.bin", "/srv/uploads/c.bin"]

with socket.socket(socket.AF_UNIX, socket.SOCK_STREAM) as sock:
    sock.connect(socket_path)
    sock.sendall(b"zIDSESSION\0")
    for path in paths:
        sock.sendall(("zSCAN " + path).encode("utf-8") + b"\0")
    sock.sendall(b"zPING\0")
    sock.sendall(b"zEND\0")

    replies = b""
    while True:
        data = sock.recv(4096)
        if not data:
            break
        replies += data

for record in replies.split(b"\0"):
    if record:
        print(record.decode("utf-8", "replace"))
```

Example `IDSESSION` replies:

```text
4: PONG
1: /srv/uploads/a.bin: OK
2: /srv/uploads/b.bin: Eicar-Signature FOUND
3: /srv/uploads/c.bin: OK
```

The reply order above is valid. Clients should match replies to requests with the numeric ID rather than assuming replies arrive in the same order as requests were sent.

## ClamDScan Behavior

`clamdscan` is the standard command-line client for `clamd`. It chooses a scan transport based on the socket type and command-line options, then maps daemon replies back to the paths it reports to the user.

### Mode selection

`clamdscan` chooses one scan transport before sending scan requests:

- Local daemon path mode, no `--stream`, no usable `--fdpass`: path-based scan commands. This can use a Unix/local socket or a TCP socket that `clamdscan` determines is local.
- Unix/local socket with `--fdpass`: `FILDES`.
- Remote TCP socket or `--stream`: `INSTREAM`.
- Standard input: `FILDES` on a local socket when possible, otherwise `INSTREAM`.

### Multiscan behavior

`clamdscan --multiscan` has different meanings depending on the selected transport:

- In local path mode, directory scans use server-side `MULTISCAN`.
- With `--stream` or remote TCP sockets, files are sent through `IDSESSION` with `INSTREAM`.
- With `--fdpass` on a local socket, files are sent through `IDSESSION` with `FILDES`.

The `IDSESSION` forms are client-driven per-file parallelism. They can keep multiple `clamd` worker threads busy, but they are not the same as sending a whole directory to the daemon with `MULTISCAN`.

### Option interactions

The following notes explain how `clamdscan` options change the effective scan mode.

#### Transport override options

`--stream` and `--fdpass` select different ways to submit local files to the daemon. Use one transport override for a scan. `--stream` sends file contents with `INSTREAM`; `--fdpass` passes open files with `FILDES`.

#### `--fdpass` with TCP sockets

`--fdpass` only works with a Unix/local socket and fd-passing support. It is not available over TCP.

#### Remote TCP scans

When `clamdscan` connects to a remote `clamd` over TCP, it streams file contents with `INSTREAM`. It does not send local file paths for the remote daemon to open.

#### `--multiscan` and `--allmatch`

`--allmatch` is not useful with `--multiscan`. If you need all-match behavior, run without `--multiscan`.

#### `--allmatch`

`--allmatch` is only effective for local path-mode scans that are not using `--multiscan`, `--stream`, or `--fdpass`.

#### `--multiscan` and `--stream`

This combination is supported, but it means client-driven `IDSESSION` with `INSTREAM`, not server-side directory `MULTISCAN`.

#### `--multiscan` and `--fdpass`

This combination is supported on Unix/local sockets, but it means client-driven `IDSESSION` with `FILDES`, not server-side directory `MULTISCAN`.

#### Quarantine actions

Choose one quarantine action for a scan: `--move`, `--copy`, or `--remove`.

#### Quarantine actions with multiscan

Quarantine actions such as `--move`, `--copy`, and `--remove` are performed by `clamdscan`, not by `clamd`. For directory scans with quarantine actions enabled, `clamdscan` resolves the action path for each file before requesting the scan. When `--multiscan` is also enabled, `clamdscan` uses client-driven per-file scan requests so it can preserve the scan result to action-path association while still allowing `clamd` to process multiple requests in parallel.
