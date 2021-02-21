# ClamAV Development

Table of Contents

<!-- TOC depthFrom:2 depthTo:6 withLinks:1 updateOnSave:1 orderedList:0 -->

- [ClamAV Development](#clamav-development)
  - [Introduction](#introduction)
  - [Contributing to ClamAV](#contributing-to-clamav)
  - [Building ClamAV for Development](#building-clamav-for-development)
    - [Satisfying Build Dependencies](#satisfying-build-dependencies)
      - [Debian](#debian)
      - [Ubuntu](#ubuntu)
      - [Fedora](#fedora)
      - [CentOS/RHEL](#centosrhel)
      - [Solaris (using OpenCSW)](#solaris-using-opencsw)
      - [FreeBSD](#freebsd)
      - [macOS](#macos)
    - [Download the Source](#download-the-source)
    - [Building ClamAV with CMake](#building-clamav-with-cmake)
      - [Linux/Unix](#linuxunix)
      - [Windows](#windows)
    - [Testing with CTest](#testing-with-ctest)
      - [Unit Tests](#unit-tests)
      - [Integration Tests](#integration-tests)
      - [Feature Tests](#feature-tests)
    - [Building ClamAV with Autotools](#building-clamav-with-autotools)
      - [Running autogen.sh](#running-autogensh)
      - [Running configure](#running-configure)
      - [Running make](#running-make)
    - [Downloading the Official Ruleset](#downloading-the-official-ruleset)
  - [General Debugging](#general-debugging)
    - [Useful clamscan Flags](#useful-clamscan-flags)
    - [Using gdb](#using-gdb)
  - [Hunting for Memory Leaks](#hunting-for-memory-leaks)
  - [Computing Code Coverage](#computing-code-coverage)
  - [Profiling - Flame Graphs](#profiling---flame-graphs)
  - [Profiling - Callgrind](#profiling---callgrind)
  - [System Call Tracing / Fault Injection](#system-call-tracing--fault-injection)
  - [Running ClamAV with AddressSanitizer (ASAN)](#running-clamav-with-addresssanitizer-asan)

<!-- /TOC -->

## Introduction

This page aims to provide information useful when developing, debugging, or profiling ClamAV.

## Contributing to ClamAV

If you're interested in contributing to ClamAV, we've assembled a page of bugs that need fixing as well as other project ideas that we feel might be great new-contributor projects.

Check out the [project ideas list](manual/Contribute.md) to find out how you might be able to help out the project!

## Building ClamAV for Development

Below are some recommendations for building ClamAV so that it's easy to debug.

### Satisfying Build Dependencies

To satisify all build dependencies:

#### Debian

*Install build tools:*
```bash
    sudo apt-get install -y \
        autoconf automake libtool m4 \
        bison flex gcc g++ make man-db ninja-build pkg-config \
        git valgrind
```

To build with CMake you will also need to install `cmake`. CMake 3.13+ is required, so older systems may have better luck installing a modern verson via Python's `pip` package manager rather than using `apt`/`apt-get`.

```bash
    sudo apt-get install -y python3-pip
    python3 -m pip install --user cmake
    ~ or ~
    sudo apt-get install -y cmake
```

*Install ClamAV dependencies:*
```bash
    sudo apt-get install -y check libbz2-dev libcurl4-openssl-dev libjson-c-dev libmilter-dev libncurses5-dev libpcre3-dev libssl-dev libxml2-dev zlib1g-dev
```

#### Ubuntu

**Tip**: You may wish to set `DEBIAN_FRONTEND=noninteractive` if scripting the following so that the install will not hang while prompting you to select your geographic area.

```bash
    sudo export DEBIAN_FRONTEND=noninteractive
```

*Install build tools:*
```bash
    sudo apt-get install -y \
        autoconf automake libtool m4 \
        bison flex gcc g++ make man-db ninja-build pkg-config \
        git valgrind
```

To build with CMake you will also need to install `cmake`. CMake 3.13+ is required, so older systems may have better luck installing a modern verson via Python's `pip` package manager rather than using `apt`/`apt-get`.

```bash
    sudo apt-get install -y python3-pip
    python3 -m pip install --user cmake
    ~ or ~
    sudo apt-get install -y cmake
```

*Install ClamAV dependencies:*
```bash
    sudo apt-get install -y check libbz2-dev libcurl4-openssl-dev libjson-c-dev libmilter-dev libncurses5-dev libpcre3-dev libssl-dev libxml2-dev zlib1g-dev
```

#### Fedora

*Install build tools:*
```bash
    sudo dnf install -y \
        autoconf automake libtool m4 \
        bison flex gcc gcc-c++ make man-db ninja-build pkg-config \
        git valgrind
```

To build with CMake you will also need to install `cmake`. CMake 3.13+ is required, so older systems may have better luck installing a modern verson via Python's `pip` package manager rather than using `dnf`.

```bash
    sudo dnf install -y python3-pip
    python3 -m pip install --user cmake
    ~ or ~
    sudo dnf install -y cmake
```

*Install ClamAV dependencies:*
```bash
    sudo dnf install -y bzip2-devel check-devel json-c-devel libcurl-devel libtool-ltdl-devel libxml2-devel ncurses-devel openssl-devel pcre2-devel sendmail-devel zlib-devel
```

#### CentOS/RHEL

*Install build tools:*
```bash
    sudo dnf --enablerepo=PowerTools install -y \
        autoconf automake libtool m4 \
        bison flex gcc gcc-c++ make man-db ninja-build pkg-config \
        git valgrind
```

To build with CMake you will also need to install `cmake`. CMake 3.13+ is required, so older systems may have better luck installing a modern verson via Python's `pip` package manager rather than using `dnf`.

```bash
    sudo dnf install -y python3-pip
    python3 -m pip install --user cmake
    ~ or ~
    sudo dnf --enablerepo=PowerTools install -y cmake
```

*Install ClamAV dependencies:*
```bash
    sudo dnf --enablerepo=PowerTools install -y bzip2-devel check-devel json-c-devel libcurl-devel libxml2-devel ncurses-devel openssl-devel pcre2-devel sendmail-devel zlib-devel
```

#### Solaris (using OpenCSW)

*Install build tools:*
```bash
    sudo /opt/csw/bin/pkgutil -y -i \
        common coreutils \
        automake autoconf libtool \
        gmake cmake libgcc_s1 libstdc++6 ggrep gsed pkgconfig ggettext gcc4core gcc4g++ libgcc_s1 libgccpp1

    sudo pkg install system/header

    sudo ln -sf /opt/csw/bin/gnm /usr/bin/nm
    sudo ln -sf /opt/csw/bin/gsed /usr/bin/sed
    sudo ln -sf /opt/csw/bin/gmake /usr/bin/make
```

*Install ClamAV dependencies:*
```bash
    sudo /opt/csw/bin/pkgutil -y -i libxml2_2 libxml2_dev bzip2 libbz2_dev libcheck0 libcheck_dev libssl1_0_0 libssl_dev openssl_utils libiconv2 zlib1 libpcre1 libltdl7 lzlib_stub zlib_stub libmilter
```

If you receive an error message like `gcc: error: /opt/csw/lib/libstdc++.so: No such file or directory`, change versions with `/opt/csw/sbin/alternatives --config automake`

#### FreeBSD

*Install build tools:*
```bash
    sudo pkg install -y \
        autoconf automake libtool m4 \
        bison flex gmake cmake pkgconf \
        git
```

*Install ClamAV dependencies:*
```bash
    sudo pkg install -y bzip2 check curl json-c libmilter libxml2 ncurses pcre2
```

#### macOS

*Install Homebrew:*
```bash
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
```

*Install Xcode command line tools (without Xcode):*
```bash
    xcode-select --install
```

*Install build tools:*
```bash
    brew install \
        autoconf automake libtool m4 \
        bison flex cmake pkg-config \
        git
```

*Install ClamAV dependencies:*
```bash
    brew install bzip2 check curl-openssl json-c libxml2 ncurses openssl@1.1 pcre2 zlib
```

### Download the Source

```bash
    git clone https://github.com/Cisco-Talos/clamav-devel.git
    cd clamav-devel
```

If you intend to make changes and submit a pull request, fork the clamav-devel repo first and then clone your fork of the repository.

### Building ClamAV with CMake

CLamAV versions 0.103+ provide CMake build tooling. In 0.103, this is for experimental and development purposes only. Autotools should be used for production builds. In 0.104+, we expect that CMake will be the preferred build system and will deprecate the use of Autotools.

For FULL details on how to use CMake to build ClamAV, see the `INSTALL.cmake.md` file located in the `clamav-devel` repository.

Ninja Build is recommended when doing development work. Builds using Ninja are significantly faster, both on Unix and Windows systems.

The following instructions assume you have installed CMake, Ninja, and either GCC, Clang, or Visual Studio 2015 or newer.

#### Linux/Unix

```sh
cmake .. -G Ninja                   \
    -D CMAKE_BUILD_TYPE="Debug"     \
    -D OPTIMIZE=OFF                 \
    -D CMAKE_INSTALL_PREFIX=install \
    -D ENABLE_MILTER=ON             \
    -D ENABLE_EXAMPLES=ON           \
    -D ENABLE_STATIC_LIB=ON         \
    -D ENABLE_SYSTEMD=OFF           \
    && ninja && ninja install
```

#### Windows

[vcpkg](https://github.com/microsoft/vcpkg) can be used to build the ClamAV library dependencies automatically. See the `vcpkg` README for installation instructions.

Once installed, set the variable `$VCPKG_PATH` to the location where you installed `vcpkg`:

```ps1
$VCPKG_PATH="..." # Path to your vcpkg installation
```

By default, CMake and `vcpkg` build for 32-bit. If you want to build for 64-bit, set the `VCPKG_DEFAULT_TRIPLET` environment variable:

```ps1
$env:VCPKG_DEFAULT_TRIPLET="x64-windows"
```

Now run the following to build ClamAV's library dependencies:

```ps1
& "$VCPKG_PATH\vcpkg" install 'curl[openssl]' 'json-c' 'libxml2' 'pcre2' 'pthreads' 'zlib' 'pdcurses' 'bzip2'
```

Finally, you can use the following to build ClamAV using Ninja for super fast builds.

```ps1
pushd "C:\Program Files (x86)\Microsoft Visual Studio\2017\Community\Common7\Tools"
cmd /c "VsDevCmd.bat -arch=amd64 & set" |
foreach {
  if ($_ -match "=") {
    $v = $_.split("="); set-item -force -path "ENV:\$($v[0])"  -value "$($v[1])"
  }
}
popd
Write-Host "`nVisual Studio 2017 Command Prompt variables set." -ForegroundColor Yellow

cmake ..  -G Ninja                                                          `
    -D CMAKE_BUILD_TYPE="Debug"                                             `
    -D CMAKE_TOOLCHAIN_FILE="$VCPKG_PATH\scripts\buildsystems\vcpkg.cmake"  `
    -D CMAKE_INSTALL_PREFIX="install"

ninja

ninja install
```

### Testing with CTest

ClamAV version 0.104+ will include unit tests, integration tests, & feature tests performed via CMake's `ctest` toolset. All tests are executed within through `ctest` but within a Python test framework build around Python's `unittest` module. See `clamav-devel/unit_tests/testcase.py`. Python 3.5+ is required.

*Note*: Valgrind tests are performed on Linux if Valgrind is installed.

#### Unit Tests

The libclamav unit tests use the [libcheck](https://github.com/libcheck/check) framework. There are presently no unit tests for libfreshclam. See `clamav-devel/unit_tests/check_clamav.c` for the libclamav unit tests.

#### Integration Tests

ClamAV is presently light on integration tests for libclamav, though you may think of the application feature as integration tests, because the apps integrate libclamav. Tests for additional features not easily exercised via the existing applications could be added by creating new example applications in `clamav-devel/examples` and exercising those programs in new CTest tests. See `clamav-devel/unit_tests/CMakeLists.txt` and `clamav-devel/examples/CMakeLists.txt` for details.

#### Feature Tests

ClamAV primarily has feature tests for ClamD and ClamScan, though basic verion tests do exist for FreshClam and SigTool as well. See `clamav-devel/unit_tests/CMakeLists.txt` and `clamav-devel/unit_tests/clamscan_test.py` for an example.

### Building ClamAV with Autotools

#### Running autogen.sh

ClamAV versions 0.103+ will require you to run `autogen.sh` before running `configure` when building from a git clone. The files generated by Autotools, such as `configure`, are no longer stored in the Git repo. When you run `autogen.sh` it will generate those files for you.

```bash
    ./autogen.sh
```

#### Running configure

To ensure that build artifacts don't clutter the source code directory, create a subdirectory named `build`.

```bash
    mkdir build
    cd build
```

For a basic build, just run `../configure`. If you've installed the dependencies with your platforms respective package manager, it should detect the dependencies automatically. macOS users will need to use this option to properly detect openssl `--with-openssl=/usr/local/opt/openssl@1.1`.

Run `../configure --help` to see a full list of options. The following suggestions will help you get started:

- Modify the `CFLAGS`, `CXXFLAGS`, `OBJCFLAGS` variables as follows (assuming you're build with `gcc`):

  - Include `gdb` debugging information (`-ggdb`).  This will make it easier to debug with `gdb`.

  - Disable optimizations (`-O0`).  This will ensure the line numbers you see in `gdb` match up with what is actually being executed.

  Example:

  ```bash
      CFLAGS="-ggdb -O0" CXXFLAGS="-ggdb -O0" OBJCFLAGS="-ggdb -O0" ../configure
  ```

  NOTE: Setting `OBJCFLAGS` is needed because currently, clamsubmit gets built with the Objective-C compiler. See [this Stack Overflow post](https://stackoverflow.com/questions/61167084/automake-conditional-compilation-from-c-or-objective-c-sources) for a discussion of why this occurs.

- Run configure with the following options:

  - ``--prefix=`pwd`/../installed``: This will cause `make install` to install into the specified directory (a directory named `installed` in the root of the ClamAV source code directory).

  - `--enable-debug`: This will define *CL_DEBUG*, which mostly just enables additional print statements that are useful for debugging.

  - `--enable-check`: Enables the unit tests, which can be run with `make check`.

  - `--enable-coverage`: If using gcc, sets `-fprofile-arcs -ftest-coverage` so that code coverage metrics will get generated when the program is run. Note that the code inserted to store program flow data may show up in any generated flame graphs or profiling output, so if you don't care about code coverage, omit this.

  - `--enable-libjson`: Enables `libjson`, which enables the `--gen-json` option. The json output contains additional metadata that might be helpful when debugging.

  - `--with-systemdsystemunitdir=no`: Don't try to register `clamd` as a `systemd` service (on systems that use `systemd`). You likely don't want this development build of `clamd` to register as a service, and this eliminates the need to run `make install` with `sudo`.

  - You might want to include the following flags also so that the optional functionality is enabled: `--enable-experimental --enable-clamdtop --enable-milter --enable-xml --enable-pcre`. Note that this may require you to install additional development libraries.

  - `--enable-llvm --with-system-llvm=no`: When LLVM is enabled, LLVM provides the capability to just-in-time compile ClamAV bytecode signatures. Without LLVM, ClamAV uses a built-in bytecode interpreter to execute bytecode signatures. With LLVM, options, "system LLVM" and "internal LLVM". The bytecode interpreter is somewhat slower than using LLVM, though the results are the same. At present only LLVM versions up to LLVM 3.6.2 are supported by ClamAV, and LLVM 3.6.2 is old enough that newer distributions no longer provide it. Therefore, we recommend using the `--enable-llvm --with-system-llvm=no` configure option to use the "internal LLVM". It is worth noting that the internal LLVM can take a while to build, and that the JIT compilation process for loading bytecode signatures also takes a while when starting `clamd` or `clamdscan`. For compile speed and `clamscan` load speed, you may wish to instead ouse `--disable-llvm`.

Altogether, the following configure command can be used:

```bash
    CFLAGS="-ggdb -O0" CXXFLAGS="-ggdb -O0" OBJCFLAGS="-ggdb -O0" ../configure --prefix=`pwd`/../installed --enable-debug --enable-check --enable-coverage --enable-libjson --with-systemdsystemunitdir=no --enable-experimental --enable-clamdtop --enable-xml --enable-pcre --enable-llvm --with-system-llvm=no
```

NOTE: It is possible to build libclamav as a static library and have it statically linked into clamscan/clamd (to do this, run `../configure` with `--enable-static --disable-shared`).  This is useful for using tools like `gprof` that do not support profiling code in shared objects.  However, there are two drawbacks to doing this:

- `clamscan`/`clamd` will not be able to extract files from RAR archives.  Based on the software license of the unrar library that ClamAV uses, the library can only be dynamically loaded.  ClamAV will attempt to dlopen the unrar library shared object and will continue on without RAR extraction support if the library can't be found (or if it doesn't get built, which is what happens if you indicate that shared libraries should not be built).

- If you make changes to libclamav, you'll need to `make clean`, `make`, and `make install` again to have `clamscan`/`clamd` rebuilt using the new `libclamav.a`.  The makefiles don't seem to know to rebuild `clamscan`/`clamd` when `libclamav.a` changes (TODO, fix this).

#### Running make

Run the following to finishing building.  `-j2` in the code below is used to indicate that the build process should use 2 cores.  Increase this if your machine is more powerful.

```bash
    make -j2
    make install
```

Also, you can run `make check` to run the unit tests.

The ClamAV executables will get installed in `../installed/bin/`, so to invoke clamscan do:

```bash
    cd ..
    ./installed/bin/clamscan
```

### Downloading the Official Ruleset

If you plan to use custom rules for testing, you can invoke `clamscan` via `./installed/bin/clamscan`, specifying your custom rule files via `-d` parameters.

If you want to download the official ruleset to use with `clamscan`, do the following:

1. Run `mkdir -p installed/share/clamav`
2. Comment out line 8 of etc/freshclam.conf.sample
3. Run `./installed/bin/freshclam --config-file etc/freshclam.conf.sample`

## General Debugging

NOTE: Some of the debugging/profiling tools mentioned in the sections below are specific to Linux

### Useful clamscan Flags

The following are useful flags to include when debugging clamscan:

- `--debug --verbose`: Print lots of helpful debug information

- `--gen-json`: Print some additional debug information in a JSON format

- `--statistics=pcre --statistics=bytecode`: Print execution statistics on any PCRE and bytecode rules that were evaluated

- `--dev-performance`: Print per-file statistics regarding how long scanning took and the times spent in various scanning stages

- `--alert-broken`: This will attempt to detect broken executable files.  If an executable is determined to be broken, some functionality might not get invoked for the sample, and this could be an indication of an issue parsing the PE header or file.  This causes those binary to generate an alert instead of just continuing on. This flag replaces the `--detect-broken` flag from releases prior to 0.101.

- `--max-filesize=2000M --max-scansize=2000M --max-files=2000000 --max-recursion=2000000 --max-embeddedpe=2000M --max-htmlnormalize=2000000 --max-htmlnotags=2000000 --max-scriptnormalize=2000000 --max-ziptypercg=2000000 --max-partitions=2000000 --max-iconspe=2000000 --max-rechwp3=2000000 --pcre-match-limit=2000000 --pcre-recmatch-limit=2000000 --pcre-max-filesize=2000M --max-scantime=2000000`:

  Effectively disables all file limits and maximums for scanning.  This is useful if you'd like to ensure that all files in a set get scanned, and would prefer clam to just run slowly or crash rather than skip a file because it encounters one of these thresholds

The following are useful flags to include when debugging rules that you're
writing:

- `-d`: Allows you to specify a custom ClamAV rule file from the command line

- `--bytecode-unsigned`: If you are testing custom bytecode rules, you'll need this flag so that `clamscan` actually runs the bytecode signature

- `--all-match`: Allows multiple signatures to match on a file being scanned

- `--leave-temps --tmpdir=/tmp`: By default, ClamAV will attempt to extract embedded files that it finds, normalize certain text files before looking for matches, and unpack packed executables that it has unpacking support for. These flags tell ClamAV to write these intermediate files out to the directory specified.  Usually when a file is written, it will mention the file name in the --debug output, so you can have some idea at what stage in the scanning process a tmp file was created.

- `--dump-certs`: For signed PE files that match a rule, display information about the certificates stored within the binary.  Note - sigtool has this functionality as well and doesn't require a rule match to view the cert data

### Using gdb

Given that you might want to pass a lot of arguments to `gdb`, consider taking advantage of the `--args` parameter.  For example:

```bash
    gdb --args ./installed/bin/clamscan -d /tmp/test.ldb -d /tmp/block_list.crb -d --dumpcerts --debug --verbose --max-filesize=2000M --max-scansize=2000M --max-files=2000000 --max-recursion=2000000 --max-embeddedpe=2000M --max-iconspe=2000000 f8f101166fec5785b4e240e4b9e748fb6c14fdc3cd7815d74205fc59ce121515
```

When using ClamAV without libclamav statically linked, if you set breakpoints on libclamav functions by name, you'll need to make sure to indicate that the breakpoints should be resolved after libraries have been loaded.

For other documentation about how to use `gdb`, check out the following resources:

- [A Guide to gdb](http://www.cabrillo.edu/~shodges/cs19/progs/guide_to_gdb_1.1.pdf)
- [gdb Quick Reference](http://users.ece.utexas.edu/~adnan/gdb-refcard.pdf)

## Hunting for Memory Leaks

You can easily hunt for memory leaks with valgrind.  Check out this guide to get started: [Valgrind Quick Start](http://valgrind.org/docs/manual/quick-start.html)

If checking for leaks, be sure to run `clamscan` with samples that will hit as many of the unique code paths in the code you are testing.  An example invocation is as follows:

```bash
    valgrind --leak-check=full ./installed/bin/clamscan -d /tmp/test.ldb --leave-temps --tempdir /tmp/test --debug --verbose /tmp/upx-samples/ > /tmp/upx-results-2.txt 2>&1
```

Alternatively, on Linux, you can use glibc's built-in leak checking functionality:

```bash
    MALLOC_CHECK_=7 ./installed/bin/clamscan
```

See the [mallopt man page](http://manpages.ubuntu.com/manpages/trusty/man3/mallopt.3.html) for more details

## Computing Code Coverage

gcov/lcov can be used to produce a code coverage report indicating which lines of code were executed on a single run or by multiple runs of `clamscan`.  NOTE: for these metrics to be collected, ClamAV needs to have been configured with the `--enable-coverage` option.

First, run the following to zero out all of the performance metrics:

```bash
    lcov -z --directory . --output-file coverage.lcov.data
```

Next, run ClamAV through whatever test cases you have.  Then, run lcov again to collect the coverage data as follows:

```bash
    lcov -c --directory . --output-file coverage.lcov.data
```

Finally, run the genhtml tool that ships with lcov to produce the code coverage report:

```bash
    genhtml coverage.lcov.data --output-directory report
```

The report directory will have an `index.html` page which can be loaded into any web browser.

For more information, visit the [lcov webpage](http://ltp.sourceforge.net/coverage/lcov.php)

## Profiling - Flame Graphs

[FlameGraph](https://github.com/brendangregg/FlameGraph) is a great tool for generating interactive flamegraphs based collected profiling data.  The github page has thorough documentation on how to use the tool, but an overview is presented below:

First, install `perf`, which on Linux can be done via:

```bash
    apt-get install linux-tools-common linux-tools-generic linux-tools-`uname -r`
```

Modify the system settings to allow `perf` record to be run by a standard user:

```bash
    sudo su     # Run the following as root
    cat /proc/sys/kernel/perf_event_paranoid
    echo "1" > /proc/sys/kernel/perf_event_paranoid
    exit
```

Invoke `clamscan` via `perf record` as follows, and run `perf script` to collect the profiling data:

```bash
    perf record -F 100 -g -- ./installed/bin/clamscan -d /tmp/test.ldb /tmp/2aa6b18d509090c60c3e4ecdd8aeb16e5f149807e3404c86892112710eab576d
    perf script > out.perf
```

The `-F` parameter indicates how many samples should be collected during program execution.  If your scan will take a long time to run, a lower value should be sufficient.  Otherwise, consider choosing a higher value (on Ubuntu 18.04, 7250 is the max frequency, but it can be increased via `/proc/sys/kernel/perf_event_max_sample_rate`.

Check out the FlameGraph project and run the following commands to generate the flame graph:

```bash
    perl stackcollapse-perf.pl ../clamav-devel/out.perf > /tmp/out.folded
    perl flamegraph.pl /tmp/out.folded > /tmp/test.svg
```

The SVG that is generated is interactive, but some viewers don't support this.
Be sure to open it in a web browser like Chrome to be able to take full advantage of it.

## Profiling - Callgrind

Callgrind is a profiling tool included with `valgrind`.  This can be done by prepending `valgrind --tool=callgrind ` to the `clamscan` command.

[kcachegrind](https://kcachegrind.github.io/html/Home.html) is a follow-on tool that will graphically present the profiling data and allow you to explore it visually, although if you don't already use KDE you'll have to install lots of extra packages to use it.

## System Call Tracing / Fault Injection

strace can be used to track the system calls that are performed and provide the number of calls / time spent in each system call.  This can be done by prepending `strace -c ` to a `clamscan` command.  Results will look something like this:

```bash
    % time     seconds  usecs/call     calls    errors syscall
    ------ ----------- ----------- --------- --------- ----------------
    95.04    0.831430          13     62518           read
    3.22    0.028172          14      2053           munmap
    0.69    0.006005           3      2102           mmap
    0.28    0.002420           7       344           pread64
    0.16    0.001415           5       305         1 openat
    0.13    0.001108           3       405           write
    0.11    0.000932          23        40           mprotect
    0.07    0.000632           2       310           close
    0.07    0.000583           9        67        30 access
    0.05    0.000395           1       444           lseek
    0.04    0.000344           2       162           fstat
    0.04    0.000338           1       253           brk
    0.03    0.000262           1       422           fcntl
    0.02    0.000218          16        14           futex
    0.01    0.000119           1       212           getpid
    0.01    0.000086          14         6           getdents
    0.00    0.000043           7         6           dup
    0.00    0.000040           1        31           unlink
    0.00    0.000038          19         2           rt_sigaction
    0.00    0.000037          19         2           rt_sigprocmask
    0.00    0.000029           1        37           stat
    0.00    0.000022          11         2           prlimit64
    0.00    0.000021          21         1           sysinfo
    0.00    0.000020           1        33           clock_gettime
    0.00    0.000019          19         1           arch_prctl
    0.00    0.000018          18         1           set_tid_address
    0.00    0.000018          18         1           set_robust_list
    0.00    0.000013           0        60           lstat
    0.00    0.000011           0        65           madvise
    0.00    0.000002           0        68           geteuid
    0.00    0.000000           0         1           execve
    0.00    0.000000           0         1           uname
    0.00    0.000000           0         1           getcwd
    ------ ----------- ----------- --------- --------- ----------------
    100.00    0.874790                 69970        31 total
```

`strace` can also be used for cool things like system call fault injection.  For instance, let's say you are curious whether the `read` bytecode API call is implemented in such a way that the underlying `read` system call could handle `EINTR` being returned (which can happen periodically).  To test this, write the following bytecode rule:

```bash
    VIRUSNAME_PREFIX("BC.Heuristic.Test.Read.Passed")
    VIRUSNAMES("")
    TARGET(0)

    SIGNATURES_DECL_BEGIN
    DECLARE_SIGNATURE(zeroes)
    SIGNATURES_DECL_END

    SIGNATURES_DEF_BEGIN
    DEFINE_SIGNATURE(zeroes, "0:0000")
    SIGNATURES_DEF_END

    bool logical_trigger()
    {
        return matches(Signatures.zeroes);
    }

    #define READ_S(value, size) if (read(value, size) != size) return 0;

    int entrypoint(void)
    {
        char buffer[65536];
        int i;

        for (i = 0; i < 256; i++)
        {
            debug(i);
            debug("\n");
            READ_S(buffer, sizeof(buffer));
        }

        foundVirus("");
        return 0;
    }
```

Compiled the rule, and make a test file to match against it. Then run it under `strace` to determine what underlying read system call is being used for the bytecode `read` function:

```bash
    clambc-compiler read_test.bc
    dd if=/dev/zero of=/tmp/zeroes bs=65535 count=256
    strace clamscan -d read_test.cbc --bytecode-unsigned /tmp/zeroes
```

It uses `pread64` under the hood, so the following command could be used for fault injection:

```bash
    strace -e fault=pread64:error=EINTR:when=20+10 clamscan -d read_test.cbc --bytecode-unsigned /tmp/zeroes
```

This command tells `strace` to skip the first 20 `pread64` calls (these appear to be used by the loader, which didn't seem to handle `EINTR` correctly) but to inject `EINTR` for every 10th call afterward.  We can see the injection in action and that the system call is retried successfully:

```bash
    pread64(3, "\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0"..., 65536, 15007744) = 65536
    pread64(3, "\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0"..., 65536, 15073280) = 65536
    pread64(3, "\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0"..., 65536, 15138816) = 65536
    pread64(3, "\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0"..., 65536, 15204352) = 65536
    pread64(3, "\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0"..., 65536, 15269888) = 65536
    pread64(3, "\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0"..., 65536, 15335424) = 65536
    pread64(3, "\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0"..., 65536, 15400960) = 65536
    pread64(3, "\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0"..., 65536, 15466496) = 65536
    pread64(3, "\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0"..., 65536, 15532032) = 65536
    pread64(3, 0x7f6a7ff43000, 65536, 15597568) = -1 EINTR (Interrupted system call) (INJECTED)
    pread64(3, "\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0"..., 65536, 15597568) = 65536
```

More documentation on using `strace` to perform system call fault injection, see [this presentation](https://archive.fosdem.org/2017/schedule/event/failing_strace/attachments/slides/1630/export/events/attachments/failing_strace/slides/1630/strace_fosdem2017_ta_slides.pdf) from FOSDEM 2017.

## Running ClamAV with AddressSanitizer (ASAN)

Building ClamAV with ASAN support can be extremely useful in detecting memory corruption and memory leaks. To build with ASAN, use a `..\configure` line like the following:

```bash
    CFLAGS="-ggdb -O0 -fsanitize=address -fno-omit-frame-pointer" LDFLAGS="-fsanitize=address" CXXFLAGS="-ggdb -O0 -fsanitize=address -fno-omit-frame-pointer" OBJCFLAGS="-ggdb -O0 -fsanitize=address -fno-omit-frame-pointer" ../configure --prefix=`pwd`/../installed --enable-debug --enable-libjson --with-systemdsystemunitdir=no --enable-experimental --enable-clamdtop --enable-libjson --enable-xml --enable-pcre --disable-llvm
```
