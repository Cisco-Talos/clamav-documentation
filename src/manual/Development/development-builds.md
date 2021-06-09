# Building for Development

The following are instructions for building ClamAV using CMake or Autotools with recommendations specific to ClamAV software development.

- [Building for Development](#building-for-development)
  - [Satisfying Build Dependencies](#satisfying-build-dependencies)
    - [Debian](#debian)
    - [Ubuntu](#ubuntu)
    - [Fedora](#fedora)
    - [CentOS/RHEL](#centosrhel)
    - [Solaris (using OpenCSW)](#solaris-using-opencsw)
    - [FreeBSD](#freebsd)
    - [macOS](#macos)
    - [Windows](#windows)
  - [Download the Source](#download-the-source)
  - [Building ClamAV with CMake (v0.104 and newer)](#building-clamav-with-cmake-v0104-and-newer)
    - [Linux/Unix](#linuxunix)
    - [Windows](#windows-1)
    - [Testing with CTest](#testing-with-ctest)
      - [Unit Tests](#unit-tests)
      - [Integration Tests](#integration-tests)
      - [Feature Tests](#feature-tests)
  - [Building ClamAV with Autotools (v0.103 and older)](#building-clamav-with-autotools-v0103-and-older)
    - [Running autogen.sh](#running-autogensh)
    - [Running configure](#running-configure)
    - [Running make](#running-make)
    - [Testing with `make check`](#testing-with-make-check)

## Satisfying Build Dependencies

To satisify all build dependencies:

### Debian

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
sudo apt-get install -y check libbz2-dev libcurl4-openssl-dev libjson-c-dev libmilter-dev libncurses5-dev libpcre2-dev libssl-dev libxml2-dev zlib1g-dev
```

### Ubuntu

> _Tip_: You may wish to set `DEBIAN_FRONTEND=noninteractive` if scripting the following so that the install will not hang while prompting you to select your geographic area.
>
> ```bash
> sudo export DEBIAN_FRONTEND=noninteractive
> ```

*Install build tools:*
```bash
sudo apt-get install -y \
    autoconf automake libtool m4 \
    bison flex gcc g++ make man-db ninja-build pkg-config \
    git valgrind
```

To build with CMake you will also need to install `cmake`. CMake 3.13+ is required, so older systems may have better luck installing a modern version via Python's `pip` package manager rather than using `apt`/`apt-get`.

```bash
sudo apt-get install -y python3-pip
python3 -m pip install --user cmake
~ or ~
sudo apt-get install -y cmake
```

*Install ClamAV dependencies:*
```bash
sudo apt-get install -y check libbz2-dev libcurl4-openssl-dev libjson-c-dev libmilter-dev libncurses5-dev libpcre2-dev libssl-dev libxml2-dev zlib1g-dev
```

### Fedora

*Install build tools:*
```bash
sudo dnf install -y \
    autoconf automake libtool m4 \
    bison flex gcc gcc-c++ make man-db ninja-build pkg-config \
    git valgrind
```

To build with CMake you will also need to install `cmake`. CMake 3.13+ is required, so older systems may have better luck installing a modern version via Python's `pip` package manager rather than using `dnf`.

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

### CentOS/RHEL

*Install build tools:*
```bash
sudo dnf --enablerepo=PowerTools install -y \
    autoconf automake libtool m4 \
    bison flex gcc gcc-c++ make man-db ninja-build pkg-config \
    git valgrind
```

To build with CMake you will also need to install `cmake`. CMake 3.13+ is required, so older systems may have better luck installing a modern version via Python's `pip` package manager rather than using `dnf`.

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

### Solaris (using OpenCSW)

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

### FreeBSD

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

### macOS

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

### Windows

Install [Windows Terminal](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwjmk-qv64jxAhXBKFkFHZnUBuEQFnoECAcQAA&url=https%3A%2F%2Fwww.microsoft.com%2Fen-us%2Fp%2Fwindows-terminal%2F9n0dx20hk701&usg=AOvVaw0T3sd9IQM_S3Udg4fr3Xkz).

Install [Git for Windows](https://git-scm.com/download/win).

Install [Visual Studio (2019 Community Edition is fine)](https://visualstudio.microsoft.com/Downloads/?q=Visual%20Studio).

You may also wish to [install Visual Studio Code](https://code.visualstudio.com/) for a modern code editor (recommended for dev on any operating system).

[Chocolatey](https://chocolatey.org/install) is a great application package manager for Windows that makes it easy to install stuff on Windows. After you install Chocolatey, you can use it to install CMake and WiX simply like this:

```ps1
choco install cmake wixtoolset
```

If you want to build the installer, you'll also need WiX Toolset. If not, you can skip it.

We support two options for sourcing and building ClamAV library dependencies:
1. [vcpkg](https://github.com/microsoft/vcpkg)
2. [Mussels](https://github.com/Cisco-Talos/Mussels)

For basic builds, vcpkg should do just fine, and is easier to get started.

If you want to customize how the dependencies are built, use Mussels. The ClamAV project uses Mussels to build the installers available on our website. The recipes to build the ClamAV dependencies, the definitions for finding and using the required development tools are hosted in [the ClamAV Mussels Cookbook](https://github.com/Cisco-Talos/clamav-mussels-cookbook).

## Download the Source

If you don't already have the source, use Git to clone it.

If you intend to make changes and submit a pull request, fork the `Cisco-Talos/clamav` repo first and then clone your fork of the repository instead.

```bash
git clone https://github.com/Cisco-Talos/clamav.git
cd clamav
```

## Building ClamAV with CMake (v0.104 and newer)

CLamAV versions 0.103+ provide CMake build tooling. In 0.103, this is for experimental and development purposes only. Autotools should be used for production builds. In 0.104+, CMake is the only build system. Autotools and Visual Studio build systems have been removed.

The following will help you get started, but for FULL details on how to use CMake to build ClamAV, see the `INSTALL.md` file located in the `clamav` repository.

Ninja Build is recommended when doing development work. Builds using Ninja are significantly faster, both on Unix and Windows systems.

The following instructions assume you have installed CMake, Ninja, and either GCC, Clang, or Visual Studio 2015 or newer.

### Linux/Unix

```bash
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

### Windows

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
& "$VCPKG_PATH\vcpkg" install 'curl[openssl]' 'json-c' 'libxml2' 'pcre2' 'pthreads' 'zlib' 'pdcurses' 'bzip2' 'check'
```

Finally, you can use the following to build ClamAV using Ninja for super fast builds. Replace "2019" and "Community" with different versions or editions as needed to match your Visual Studio installation.

Configure (generate the build system):
```ps1
pushd "C:\Program Files (x86)\Microsoft Visual Studio\2019\Community\Common7\Tools"
cmd /c "VsDevCmd.bat -arch=amd64 & set" |
foreach {
  if ($_ -match "=") {
    $v = $_.split("="); set-item -force -path "ENV:\$($v[0])"  -value "$($v[1])"
  }
}
popd
Write-Host "`nVisual Studio 2019 Command Prompt variables set." -ForegroundColor Yellow

cmake .. -G Ninja                                                          `
    -D CMAKE_BUILD_TYPE="Debug"                                             `
    -D CMAKE_TOOLCHAIN_FILE="$VCPKG_PATH\scripts\buildsystems\vcpkg.cmake"  `
    -D CMAKE_INSTALL_PREFIX="install"
```

Build:
```ps1
ninja
```

Install (to the `CMAKE_INSTALL_PREFIX` directory):
```ps1
ninja install
```

> _Tip_: I like to place the "Configure" script in a `configure.ps1` script file in my home directory. This way I can simply run `~\configure.ps1` followed by `ninja` to do a build.

### Testing with CTest

ClamAV version 0.104+ will include unit tests, integration tests, & feature tests performed via CMake's `ctest` toolset. All tests are executed within through `ctest` but within a Python test framework build around Python's `unittest` module. See `clamav/unit_tests/testcase.py`. Python 3.5+ is required.

> _Note_: Valgrind tests are performed on Linux if Valgrind is installed.

#### Unit Tests

The libclamav unit tests use the [libcheck](https://github.com/libcheck/check) framework. There are presently no unit tests for libfreshclam. See `clamav/unit_tests/check_clamav.c` for the libclamav unit tests.

#### Integration Tests

ClamAV is presently light on integration tests for libclamav, though you may think of the application feature as integration tests, because the apps integrate libclamav. Tests for additional features not easily exercised via the existing applications could be added by creating new example applications in `clamav/examples` and exercising those programs in new CTest tests. See `clamav/unit_tests/CMakeLists.txt` and `clamav/examples/CMakeLists.txt` for details.

#### Feature Tests

ClamAV primarily has feature tests for ClamD and ClamScan, though basic version tests do exist for FreshClam and SigTool as well. See `clamav/unit_tests/CMakeLists.txt` and `clamav/unit_tests/clamscan_test.py` for an example.

## Building ClamAV with Autotools (v0.103 and older)

### Running autogen.sh

ClamAV versions 0.103+ will require you to run `autogen.sh` before running `configure` when building from a git clone. The files generated by Autotools, such as `configure`, are no longer stored in the Git repo. When you run `autogen.sh` it will generate those files for you.

```bash
./autogen.sh
```

### Running configure

To ensure that build artifacts don't clutter the source code directory, create a subdirectory named `build`.

```bash
mkdir build
cd build
```

For a basic build, just run `../configure`. If you've installed the dependencies with your platforms respective package manager, it should detect the dependencies automatically. macOS users will need to use this option to properly detect openssl `--with-openssl=/usr/local/opt/openssl@1.1`.

Run `../configure --help` to see a full list of options. The following suggestions will help you get started:

- Modify the `CFLAGS`, `CXXFLAGS`, `OBJCFLAGS` variables as follows (assuming you're build with `gcc`):

  - Include `gdb` debugging information (`-ggdb`). This will make it easier to debug with `gdb`.

  - Disable optimizations (`-O0`). This will ensure the line numbers you see in `gdb` match up with what is actually being executed.

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

NOTE: It is possible to build libclamav as a static library and have it statically linked into clamscan/clamd (to do this, run `../configure` with `--enable-static --disable-shared`). This is useful for using tools like `gprof` that do not support profiling code in shared objects. However, there are two drawbacks to doing this:

- `clamscan`/`clamd` will not be able to extract files from RAR archives. Based on the software license of the unrar library that ClamAV uses, the library can only be dynamically loaded. ClamAV will attempt to dlopen the unrar library shared object and will continue on without RAR extraction support if the library can't be found (or if it doesn't get built, which is what happens if you indicate that shared libraries should not be built).

- If you make changes to libclamav, you'll need to `make clean`, `make`, and `make install` again to have `clamscan`/`clamd` rebuilt using the new `libclamav.a`. The makefiles don't seem to know to rebuild `clamscan`/`clamd` when `libclamav.a` changes (TODO, fix this).

### Running make

Run the following to finishing building. `-j2` in the code below is used to indicate that the build process should use 2 cores. Increase this if your machine is more powerful.

```bash
make -j2
make install
```

The ClamAV executables will get installed in `../installed/bin/`, so to invoke clamscan do:

```bash
cd ..
./installed/bin/clamscan
```

### Testing with `make check`

You can run `make check` to run the unit tests and feature tests.

Unlike with the CTest tool used for CMake builds, you must use `make check VG=1` if you wish to run extra tests using Valgrind (must be installed).
