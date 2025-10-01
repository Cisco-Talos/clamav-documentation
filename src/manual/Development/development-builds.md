# Building for Development

The following are instructions for building ClamAV using CMake or Autotools with recommendations specific to ClamAV software development.

- [Building for Development](#building-for-development)
  - [Build dependencies](#build-dependencies)
    - [For Linux/UNIX](#for-linuxunix)
    - [For Windows](#for-windows)
  - [Download the Source](#download-the-source)
  - [Building ClamAV](#building-clamav)
    - [Linux/Unix](#linuxunix)
    - [Windows](#windows)
      - [vcpkg](#vcpkg)
      - [Mussels](#mussels)
    - [Testing with CTest](#testing-with-ctest)
      - [Unit Tests](#unit-tests)
      - [Integration Tests](#integration-tests)
      - [Feature Tests](#feature-tests)

## Build dependencies

Instructions to install the build dependencies for each major operating system and distribution can be found in our install from source instructions. See:
- [Unix/Linux/Mac Instructions](../Installing/Installing-from-source-Unix.md)
- [Windows Instructions](../Installing/Installing-from-source-Windows.md)

For development, you may also need to install the following...

### For Linux/UNIX

- `git`

- `valgrind`:

  Valgrind is used to enhance our unit tests and feature tests. It will be automatically when running `ctest` for CMake builds, or when running `make check VG=1` for Autotools builds.

- `pytest`:

  Pytest is used in our test suite for CMake builds to get better test output when analyzing test failures. Having pytest

- `bison` and `flex`:

  Bison and Flex may be used to re-generate the Yara rule parser if you enable the `MAINTAINER_MODE` CMake option.

- `gperf`:

  GPerf is another maintainer tool. It was used to generate code for our javascript normalizer. `*`Enabling GPerf in `MAINTAINER_MODE` for the CMake build system is still a to-do item.

- `ninja` or `ninja-build` :

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

- StrawberryPerl and Netwide Assembler (NASM):

  Perl and NASM are required to compile openssl from source if using Mussels to build your dependencies. If using vcpkg, you can skip them. You can install these tools using Chocolatey:
  ```ps1
  choco install strawberryperl nasm
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

## Building ClamAV

To get started, first review the official build instructions [for Unix/Linux](../Installing/Installing-from-source-Unix.md) or [for Windows](../Installing/Installing-from-source-Windows.md). Then return for some tips on building for development. For a complete reference of ClamAV build configuration options, see [the `INSTALL.md` file located in the `clamav` repository](https://github.com/Cisco-Talos/clamav/blob/main/INSTALL.md).

The following instructions assume you have installed CMake, Ninja, and either GCC, Clang, or Visual Studio 2019 or newer.

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
     -D PThreadW32_LIBRARY="$home\.mussels\install\x64\lib\pthreadVC3.lib"    `
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

ClamAV unit tests, integration tests, & feature tests are performed via CMake's `ctest` toolset. All tests are executed within through `ctest` but within a Python test framework build around Python's `unittest` module. See `clamav/unit_tests/testcase.py`. Python 3.5+ is required.

> _Note_: Valgrind tests are performed on Linux if Valgrind is installed.

To run the unit tests, run `ctest` or `ctest -V` (for verbose output) after the build. On some systems, you may need to specify the build configuration, like `ctest -V -C Debug`.

You can limit to run specific test sets with the `-R` regex filter. Like this: `ctest -V -R "clamscan \$"`

#### Unit Tests

The libclamav C code unit tests use the [libcheck](https://github.com/libcheck/check) framework. The libclamav Rust code unit tests use Rust's built-in `cargo test` features.

There are presently no unit tests for libfreshclam. See `clamav/unit_tests/check_clamav.c` for the libclamav unit tests.

#### Integration Tests

ClamAV is presently light on integration tests for libclamav, though you may think of the application feature as integration tests, because the apps integrate libclamav. Tests for additional features not easily exercised via the existing applications could be added by creating new example applications in `clamav/examples` and exercising those programs in new CTest tests. See `clamav/unit_tests/CMakeLists.txt` and `clamav/examples/CMakeLists.txt` for details.

#### Feature Tests

ClamAV primarily has feature tests for ClamD and ClamScan, though basic version tests do exist for FreshClam and SigTool as well. See `clamav/unit_tests/CMakeLists.txt` and `clamav/unit_tests/clamscan_test.py` for an example.
