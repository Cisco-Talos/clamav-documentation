# Installing ClamAV on Unix / Linux / macOS from Source

Updated instructions for how to build ClamAV with CMake are coming soon. For now, please see the `INSTALL.cmake.md` file located in the source repository.

## Step-by-Step Instructions

- [Debian & Ubuntu](Steps/Steps-Debian-Ubuntu.md)
- [Redhat & CentOS](Steps/Steps-Redhat-CentOS.md)
- [macOS](Steps/Steps-macOS.md)

## Requirements

The following is an overview of the tools, libraries, and steps needed to build ClamAV.

Required tools:

- `gcc` or `clang`
- GNU Make (`gmake` on UNIX systems)

Recommended tools:

- `check` unit testing framework

***Required*** libraries (including development sources (i.e. `...-dev` or `...-devel`)):

- zlib
- openssl version 1.0.2 or higher (libcrypto, libssl)
- libcurl:     _required for libfreshclam, freshclam, clamsubmit_

**Recommended** libraries (including development sources (i.e. `...-dev` or `...-devel`)):

- pcre2
- bzip2
- libxml2

Optional libraries (including development sources (i.e. `...-dev` or `...-devel`)):

- json-c library:   _required for clamsubmit_
- ncurses library:  _required for clamdtop_

ClamAV may execute Bytecode signatures using:

- ClamAV's built-in bytecode interpreter
- LLVM for Just-In-Time (JIT) compilation`*`
  - System-installed LLVM library (3.2-3.6)
  - ClamAV's built-in version of LLVM 2.8

> `*` LLVM's runtime performance is better than that of the bytecode interpreter. Unfortunately we presently only support up to LLVM version 3.6. Until we're able to update to support a modern version of LLVM, you may have to use the bytecode interpreter.

The following are thus optional, but *required* to use system-LLVM in place of the built-in LLVM or the bytecode interpreter:

- LLVM 3.2 - 3.6
- A supported CPU for LLVM JIT, either of: X86, X86-64, PowerPC, PowerPC64

### Known Library Compatibility Issues

#### zlib

Certain versions on certain OSes will cause failures loading virus database:

- CentOS 6 32bit: zlib 1.2.3-29
  - Solution: Update to newer version.

## Installing ClamAV

### Private installation on local shell account

To install ClamAV locally on an unprivileged shell account you need not create any additional users or groups. Assuming your home directory is `/home/gary` you should build it as follows:

```bash
./configure --prefix=/home/gary/clamav --disable-clamav
make; make install
```

The `--disable-clamav` switch disables the check for existence of the `clamav` user and group but `clamscan` would still require an unprivileged account to work in a superuser mode.

### Global installation in system-owned directories

#### Adding new system user and group

If installing to the system, it is recommended to set up at least one special user account to run `freshclam` and `clamd`. You may choose to set up two separate accounts, one for each. You only need to create these accounts the first time you install ClamAV.

These are instructions specific to some popular operating systems:

- [Debian & Ubuntu](Steps/Steps-Debian-Ubuntu.md#Users-and-on-user-privileges)
- [Redhat & CentOS](Steps/Steps-Redhat-CentOS.md#Users-and-on-user-privileges)
- [macOS](Steps/Steps-macOS.md#Users-and-on-user-privileges)

If your operating system isn't specified above, and your OS does not have the `groupadd` and `useradd` utilities, consult a system manual. **Don’t forget to lock access to the account!**

#### Compiling ClamAV for global installation

Once you have created the clamav user and group, please extract the archive:

```bash
tar xzf clamav-[ver].tar.gz
cd clamav-[ver]
```

Assuming you want to install the configuration files in `/etc`, configure and build the software as follows:

```bash
./configure --sysconfdir=/etc
make
su -c "make install"
```

In the last step, the software is installed into the `/usr/local` directory and the config files into `/etc`. **WARNING: Never enable the SUID or SGID bits for Clam AntiVirus binaries.**

### First-time set-up

First, create a database directory. This would be located under the install path `share/clamav`. For example:

- `/usr/local/share/clamav`
- `~/clamav/share/clamav`

You will need to create `freshclam.conf` and `clamd.conf` files in the config directory. In the above example, we chose `/etc`, so run the following.

```bash
    sudo cp /etc/freshclam.conf.sample /etc/freshclam.conf
    sudo cp /etc/clamd.conf.sample /etc/clamd.conf
```

At a minimum, you will need to edit each file and remove or comment-out the `Example` line. In addition, for `clamd.conf` you will need to enable either `LocalSocket` or `TCPSocket`.

For additional recommendations, please read:

- [Debian, Ubuntu, etc](Steps/Steps-Debian-Ubuntu.md#First-time-set-up)
- [Redhat, CentOS, etc](Steps/Steps-Debian-Ubuntu.md#First-time-set-up)
- [macOS](Steps/Steps-Debian-Ubuntu.md#First-time-set-up)

### Test your installation

To test your local installation execute:

```bash
~/clamav/bin/freshclam
~/clamav/bin/clamscan ~
```

To test your system installation execute:

```bash
sudo freshclam
sudo clamscan ~
```

## Compilation with clamav-milter enabled

The `libmilter` package and its development files are required. To enable clamav-milter, configure ClamAV with

```bash
./configure --enable-milter
```

## Using a system-installed LLVM library

To configure ClamAV to use a system-installed LLVM library:

```bash
./configure --with-system-llvm=/myllvm/bin/llvm-config
make
sudo make install
```

The argument to `--with-system-llvm` indicates the path name of the LLVM configuration utility (llvm-config). Alternatively, you may use `--enable-llvm` and `./configure` will search for LLVM in /usr/local/ and then /usr.

Recommended versions of LLVM are 3.2 - 3.6. Some installations have reported problems using earlier LLVM versions. Versions of LLVM beyond 3.6 are not currently supported in ClamAV.

## Running unit tests

ClamAV includes unit tests that allow you to test that the compiled binaries work correctly on your platform.

The first step is to use your OS’s package manager to install the `check` package. If your OS doesn’t have that package, you can download it from [SourceForge](http://check.sourceforge.net/), build it and install it.

To help clamav’s configure script locate `check`, it is recommended that you install `pkg-config`, preferably using your OS’s package manager, or from [FreeDesktop.org](http://pkg-config.freedesktop.org).

The recommended way to run unit-tests is the following, which ensures you will get an error if unit tests cannot be built:

```bash
./configure --enable-check
make
make check
```

When `make check` is finished, you should get a message similar to this:

```bash
==================
All 8 tests passed
==================
```

If a unit test fails, you get a message similar to the following. Note that in older versions of `make check` may report failures due to the absence of optional packages. Please make sure you have the latest versions of the dependencies noted in the [Requirements section](#Requirements). See the next section on how to report a bug when a unit test fails.

```bash
========================================
1 of 8 tests failed
Please report to https://bugzilla.clamav.net/
========================================
```

If unit tests are disabled (and you didn’t use `--enable-check`), you will get this message:

```bash
*** Unit tests disabled in this build
*** Use ./configure --enable-check to enable them

SKIP: check_clamav
PASS: check_clamd.sh
PASS: check_freshclam.sh
PASS: check_sigtool.sh
PASS: check_clamscan.sh
======================
All 4 tests passed
(1 tests were not run)
======================
```

Running `./configure --enable-check` should tell you why.

## Reporting a unit test failure bug

If `make check` reports failed tests, we encourage you to report a bug on [bugzilla](https://bugzilla.clamav.net).

When writing a bug report regarding failed unit tests, please provide the following:

- The exact output from `make check`
- Output of `uname -mrsp`
- your `config.log`
- The following files from the `unit_tests/` directory:
  - `test.log`
  - `clamscan.log`
  - `clamdscan.log`

- `/tmp/clamd-test.log` if it exists
- where and how you installed the check package
- Output of `pkg-config check --cflags --libs`
- Optionally if `valgrind` is available on your platform, the output of the following:
    ```bash
    make check
    CK_FORK=no ./libtool --mode=execute valgrind unit_tests/check_clamav
    ```

## Obtain Latest ClamAV anti-virus signature databases

Before you can run `clamd`, `clamdscan`, or `clamscan`, you must have ClamAV Virus Database (.cvd) file(s) installed in the appropriate location on your system. The default location for these database files are `/usr/local/share/clamav`.

Here is a listing of currently available ClamAV Virus Database Files:

- main.cvd (main ClamAV virus database file)
- daily.cvd (daily update file for ClamAV virus databases)
- bytecode.cvd (signatures to detect bytecode in files)

These files should be downloaded using the `freshclam` utility on a periodic basis. While using HTTPS to directly download the CVDs is possible, using `freshclam` is the preferred method of keeping the ClamAV virus database files up to date. `freshclam` can download database difference files (`.cdiff`) to get the latest signature definitions without downloading whole CVD files. This saves a considerable amount of bandwidth.

Please see the [freshclam usage section](../Usage/SignatureManagement.md#freshclam) for additional details on freshclam).
