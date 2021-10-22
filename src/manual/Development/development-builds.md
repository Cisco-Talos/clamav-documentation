# Building for Development

The following are instructions for building ClamAV using CMake or Autotools with recommendations specific to ClamAV software development.

- [Building for Development](#building-for-development)
  - [Build dependencies](#build-dependencies)
    - [For Linux/UNIX](#for-linuxunix)
    - [For Windows](#for-windows)
  - [Download the Source](#download-the-source)
  - [Building ClamAV with CMake (v0.104 and newer)](#building-clamav-with-cmake-v0104-and-newer)
    - [Linux/Unix](#linuxunix)
    - [Windows](#windows)
      - [vcpkg](#vcpkg)
      - [Mussels](#mussels)
    - [Testing with CTest](#testing-with-ctest)
      - [Unit Tests](#unit-tests)
      - [Integration Tests](#integration-tests)
      - [Feature Tests](#feature-tests)
  - [Building ClamAV with Autotools (v0.103 and older)](#building-clamav-with-autotools-v0103-and-older)
    - [Running autogen.sh](#running-autogensh)
      - [Redhat / Centos / Fedora](#redhat--centos--fedora)
      - [Debian / Ubuntu](#debian--ubuntu)
    - [Running configure](#running-configure)
    - [Running make](#running-make)
    - [Testing with `make check`](#testing-with-make-check)

## Build dependencies

Instructions to install the build dependencies for each major operating system and distribution can be found in our install from source instructions. See:
- [Unix/Linux/Mac Instructions](Installing-from-source/Installing-from-source-Unix.md)
- [Windows Instructions](Installing-from-source/Installing-from-source-Windows.md)

For development, you may also need to install the following...

### For Linux/UNIX

- `git`

- `autoconf`, `automake`, `libtool`, `m4` (For 0.103 and older, only):

  These four packages make up "Autotools" and are required to run the `./autogen.sh` script that generates the `./configure` tool for configuring an Autotools build. You will need these packakges if building from a git clone, but the 0.103 release tarballs have this stuff pre-generated for normal users.

- `valgrind`:

  Valgrind is used to enhance our unit tests and feature tests. It will be automatically when running `ctest` for CMake builds, or when running `make check VG=1` for Autotools builds.

- `pytest` (For 0.104 and newer):

  Pytest is used in our test suite for CMake builds to get better test output when analyzing test failures. Having pytest

- `bison` and `flex`:

  Bison and Flex re-generating the Yara rule parser, used by our "maintainer mode" in the CMake build system (v0.104+), and used by default in the Autotools build system (v0.103-).

- `gperf`:

  GPerf is another tool used by our "maintainer mode". It is used to generate code for our javascript normalizer. `*`Enabling GPerf in the "maintainer mode" for the CMake build system (v0.104+) is still a to-do.

- `ninja` or `ninja-build` (For 0.104 and newer):

  Ninja is a build system that CMake can use in place of Makefiles (UNIX) or Visual Studio (Windows). It's faster than both, particularly as compared with Visual Studio. If you're compiling ClamAV frequently, you may find it very helpful. The only real downside is that it's highly multithreaded so errors and warnings tend to get mixed up and it can be hard to inspect when you're having build failures.

### For Windows

- [Git for Windows](https://git-scm.com/download/win).

- [Windows Terminal](https://www.microsoft.com/en-us/p/windows-terminal/9n0dx20hk701):

  Windows Terminal is Microsoft's new open source terminal program. It's quite nice, and miles better than using a traditional CMD prompt or Powershell.

- [Visual Studio](https://visualstudio.microsoft.com/Downloads/?q=Visual%20Studio):

  2019 Community Edition is fine. It may also possible to build using Clang + Ninja. Investigate at your peril.

- [Visual Studio Code](https://code.visualstudio.com/):

  I recommend a modern text editor like VSCode instead of working with Visual Studio directly. Visual Studio is powerful, but can be slow and unwieldy. Those coming from a Unix/Linux background may find that the Vim plugin is particularly nice.

- [Chocolatey](https://chocolatey.org/install):

  Chocolatey is an application package manager for Windows that makes it easy to install stuff on Windows. After you install Chocolatey, you can use it to install CMake, WiX, Flex, Bison, Perl, and Nasm very simply, like this:
  ```ps1
  choco install cmake
  ```

- Wix Toolset:

  If you want to build the installer, you'll also need WiX Toolset. If not, you can skip it. You can install it with Chocolatey:
  ```ps1
  choco install wixtoolset
  ```

- `bison` and `flex`:

  As mentioned in the Linux/Unix section, Bison and Flex may be needed if working with the yara parser module. You can install it with Chocolatey:
  ```ps1
  choco install winflexbison
  ```

- ActivePerl and Netwide Assembler (NASM):

  Perl and NASM are required to compile openssl from source if using Mussels to build your dependencies. If using vcpkg, you can skip them. You can install these tools using Chocolatey:
  ```ps1
  choco install activeperl nasm
  ```

We support two options for sourcing and building ClamAV library dependencies:
1. [vcpkg](https://github.com/microsoft/vcpkg)
2. [Mussels](https://github.com/Cisco-Talos/Mussels)

For basic builds, vcpkg should do just fine`*`, and is easier to get started.

If you want to customize how the dependencies are built, use Mussels. The ClamAV project uses Mussels to build the installers available on our website. The recipes to build the ClamAV dependencies, the definitions for finding and using the required development tools are hosted in [the ClamAV Mussels Cookbook](https://github.com/Cisco-Talos/clamav-mussels-cookbook).

> `*` There is a known issue with the unit tests when building with vcpkg in Debug mode. When you run the libclamav unit tests (check_clamav), the program will crash and a popup will claim there was heap corruption. If you use Task Manager to kill the `check_clamav.exe` process, the rest of the tests pass just fine. This issue does not occur when using Mussels to supply the library dependencies. Commenting out the following lines in `readdb.c` resolves the heap corruption crash when running `check_clamav`, but of course introduces a memory leak:
> ```c
>     if (engine->stats_data)
>         free(engine->stats_data);
> ```
> If anyone has time to figure out the real cause of the vcpkg Debug-build crash
> in check_clamav, it would be greatly appreciated.

## Download the Source

If you don't already have the source, use Git to clone it:
```bash
git clone https://github.com/Cisco-Talos/clamav.git
cd clamav
```

If you intend to make changes and submit a pull request, fork the `Cisco-Talos/clamav` repo first and then clone your fork of the repository instead:
```bash
git clone https://github.com/<yourusername>/clamav.git clamav-fork
cd clamav-fork
```

## Building ClamAV with CMake (v0.104 and newer)

ClamAV versions 0.103+ provide CMake build tooling. In 0.103, this is for experimental and development purposes only. Autotools should be used for production builds. In 0.104+, CMake is the only build system. Autotools and Visual Studio build systems have been removed.

To get started, first review the [official build isntructions](../Installing/Installing-from-source-Windows.md). Then return hrefer for some tips on building for development. For a complete reference of ClamAV build configuration options, see [the `INSTALL.md` file located in the `clamav` repository](https://github.com/Cisco-Talos/clamav/blob/main/INSTALL.md).

The following instructions assume you have installed CMake, Ninja, and either GCC, Clang, or Visual Studio 2015 or newer.

### Linux/Unix

Linux/Unix builds are often much simpler because the system's package manager can provide all of the dependencies for your. But if you want, you _can_ build them yourself, using a tool like Mussels. The instructions listed in the Windows section are nearly identical. With Mussels on Linux, Unix, and macOS you can even use the `host-static` target to build all of the dependencies as static libraries to make ClamAV more portable and easier to package. Feel free to reach out on Discord if you want to learn more.

Configure (generate the build system):
```bash
cmake .. -G Ninja                   \
    -D CMAKE_BUILD_TYPE="Debug"     \
    -D OPTIMIZE=OFF                 \
    -D CMAKE_INSTALL_PREFIX=install \
    -D ENABLE_MILTER=ON             \
    -D ENABLE_EXAMPLES=ON           \
    -D ENABLE_STATIC_LIB=ON         \
    -D ENABLE_SYSTEMD=OFF
```

Build:
```ps1
ninja
```

Install (to the `CMAKE_INSTALL_PREFIX` directory):
```ps1
ninja install
```

### Windows

#### vcpkg

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

> _Tip_: I like to place the "Configure" script in a `configure-vcpkg.ps1` script file in my home directory. This way I can simply run `~\configure-vcpkg.ps1` followed by `ninja` to do a build.

#### Mussels

Here are some tips for using Mussels to build the clamav dependencies and then for building ClamAV with those dependencies.

Install Mussels
```ps1
python3 -m pip install --user mussels
```

After the install, pip may suggest you add a "Scripts" directory to your PATH environment variable. *I strongly suggest that you do this*, so you can run `msl` for mussels commands instead of having to type `python3 -m mussels` for every command.

Now to use Mussels, run:
```ps1
# This requires Git, and will clone the the "clamav" and "scrapbook" cookbooks.
msl up

# This is to enable running the scripts in the clamav cookbook to build the clamav dependencies.
msl cookbook trust -y clamav

# This is just to get you in a small directory so Mussels don't spend forever searching your harddrive for build recipes.
mkdir tmp && cd tmp

# First try a dry-run. If you're missing any tools, it will tell you.
# If you have everything, it will give you a list of the order it plans to build everything.
msl build clamav_deps --dry-run

# Then do the build.
msl build clamav_deps

# You could also have it build clamav for you too, but that's not so useful for development work.
msl build clamav
```

Mussels isn't great for doing repeated builds, because it tends to retry every build in the dependency chain, and that will take some time. Mussels also builds from a downloaded source tarball, and not from a local Git repository. If you're interested in working on improvement Mussels for development purposes and smoothing over some of these sharp edges, [we'd love the help](https://github.com/Cisco-Talos/Mussels#contribute).

So assuming you've now build the clamav dependencies, you should be ready to build ClamAV. Replace "2019" and "Community" with different versions or editions as needed to match your Visual Studio installation

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

cmake ..  -G Ninja -D CMAKE_BUILD_TYPE="Debug" `
     -D ENABLE_EXAMPLES=OFF                                                 `
     -D JSONC_INCLUDE_DIR="$home\.mussels\install\x64\include\json-c"         `
     -D JSONC_LIBRARY="$home\.mussels\install\x64\lib\json-c.lib"             `
     -D ENABLE_JSON_SHARED=OFF                                              `
     -D BZIP2_INCLUDE_DIR="$home\.mussels\install\x64\include"                `
     -D BZIP2_LIBRARY_RELEASE="$home\.mussels\install\x64\lib\libbz2.lib"     `
     -D CURL_INCLUDE_DIR="$home\.mussels\install\x64\include"                 `
     -D CURL_LIBRARY="$home\.mussels\install\x64\lib\libcurl_imp.lib"         `
     -D OPENSSL_ROOT_DIR="$home\.mussels\install\x64"                         `
     -D OPENSSL_INCLUDE_DIR="$home\.mussels\install\x64\include"              `
     -D OPENSSL_CRYPTO_LIBRARY="$home\.mussels\install\x64\lib\libcrypto.lib" `
     -D ZLIB_LIBRARY="$home\.mussels\install\x64\lib\libssl.lib"              `
     -D LIBXML2_INCLUDE_DIR="$home\.mussels\install\x64\include\libxml2"      `
     -D LIBXML2_LIBRARY="$home\.mussels\install\x64\lib\libxml2.lib"          `
     -D PCRE2_INCLUDE_DIR="$home\.mussels\install\x64\include"                `
     -D PCRE2_LIBRARY="$home\.mussels\install\x64\lib\pcre2-8.lib"            `
     -D CURSES_INCLUDE_DIR="$home\.mussels\install\x64\include"               `
     -D CURSES_LIBRARY="$home\.mussels\install\x64\lib\pdcurses.lib"          `
     -D PThreadW32_INCLUDE_DIR="$home\.mussels\install\x64\include"           `
     -D PThreadW32_LIBRARY="$home\.mussels\install\x64\lib\pthreadVC2.lib"    `
     -D ZLIB_INCLUDE_DIR="$home\.mussels\install\x64\include"                 `
     -D ZLIB_LIBRARY="$home\.mussels\install\x64\lib\zlibstatic.lib"          `
     -D LIBCHECK_INCLUDE_DIR="$home\.mussels\install\x64\include"             `
     -D LIBCHECK_LIBRARY="$home\.mussels\install\x64\lib\checkDynamic.lib"    `
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

> _Tip_: I like to place the "Configure" script in a `configure-mussels.ps1` script file in my home directory. This way I can simply run `~\configure-mussels.ps1` followed by `ninja` to do a build.

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

To run `autogen.sh`, you will need some extra tools:
- autoconf
- automake
- libtool
- m4
- pkg-config

The packages to install are...

#### Redhat / Centos / Fedora

```sh
dnf/yum install -y \
  autoconf autoreconf automake libtool libtool-ltdl-devel m4 pkg-config
```

#### Debian / Ubuntu

```sh
apt-get install -y \
  autoconf autoconf-archive automake libtool libltdl-dev m4 pkg-config
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
