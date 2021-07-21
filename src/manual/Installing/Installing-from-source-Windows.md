# Installing ClamAV on Windows from Source

The following are instructions to build ClamAV *version 0.104 and newer* using CMake.

> _Tip_: If you wish to build ClamAV from source in ClamAV *version 0.103 and older*, you'll have to use the Visual Studio solution, please see the [Win32 ClamAV Build Instructions](https://github.com/Cisco-Talos/clamav/blob/rel/0.103/win32/README.md) located in our source release materials on [ClamAV.net](https://www.clamav.net/downloads) and on [GitHub](https://github.com/Cisco-Talos/clamav).

- [Installing ClamAV on Windows from Source](#installing-clamav-on-windows-from-source)
  - [Install prerequisites](#install-prerequisites)
    - [Building the library dependencies](#building-the-library-dependencies)
  - [Download the source code](#download-the-source-code)
  - [Build ClamAV](#build-clamav)
    - [Building with Mussels](#building-with-mussels)
      - [Building the library dependencies with Mussels](#building-the-library-dependencies-with-mussels)
      - [Building ClamAV](#building-clamav)
    - [Building with vcpkg](#building-with-vcpkg)
    - [Build the Installer](#build-the-installer)
  - [What now?](#what-now)

> _Note_: Some of the dependencies are optional if you elect to not build all of the command line applications, or elect to only build the libclamav library. Specifically:
>
> - libcurl:  _required for libfreshclam, freshclam, clamsubmit_
> - ncurses:  _required for clamdtop_
>
> For more information about customized builds and which dependencies can be skipped, please see the `INSTALL.md` document accompanying the source code.

## Install prerequisites

**The following commands for building on Windows are written for Powershell**.

At a minimum you will need Visual Studio 2015 or newer, and CMake. If you want to build the installer, you'll also need WiX Toolset.

If you're using Chocolatey, you can install CMake and WiX simply like this:

```ps1
choco install cmake wixtoolset
```

If you're using Mussels to build the library dependencies (see below), then you may also need to install Netwide Assembler (NASM) and ActivePerl. These are also simple to install using Chocolatey:

```ps1
choco install nasm activeperl
```

Then open a new terminal so that CMake and WiX will be in your `$PATH`.

### Building the library dependencies

There are two options for building and supplying the library dependencies. These are Mussels and vcpkg.

Mussels is an open source project developed in-house by the ClamAV team. It offers great flexibility for defining your own collections (cookbooks) of build instructions (recipes) instead of solely relying on a centralized repository of ports. And unlike vcpkg, Mussels does not implement CMake build tooling for projects that don't support CMake, but instead leverages whatever build system is provided by the project. This means that Mussels builds may require installing additional tools, like NMake and ActivePerl rather than simply requiring CMake. The advantage is that you'll be building those projects the same way that those developers intended, and that Mussels recipes are generally very light weight. Mussels has some sharp edges because it's a newer and much smaller project than vcpkg.

Vcpkg is an open source project developed by Microsoft and is heavily oriented towards CMake projects. Vcpkg offers a very large collection of "ports" for almost any project you may need to build. It is very easy to get started with vcpkg.

Mussels is the preferred tool to supply the library dependencies at least until such time as the vcpkg Debug-build libclamav unit test heap-corruption crash is resolved [(see below)](#windows-build-with-vcpkg).

***Details for how to use Mussels and vcpkg will be provided with the build instructions (below), as the instructions differ _significantly_ depending on which you choose.***

> _Tip_: Installing the Python 3 `pytest` package is also recommended in case the unit tests fail so that the test output is easy to read. *You're welcome to skip it.* However, if you have Python 2's `pytest` installed but not Python 3's `pytest`, the tests may fail to run.
>
> You can install pytest by running:
> ```ps1
> python3 -m pip install --user pytest
> ```

## Download the source code

Download the source from [the clamav.net downloads page](https://www.clamav.net/downloads).

Extract the archive. You should be able to right click on it and extract it to a folder, then in that folder, do the same for the `clamav-[ver].tar` file.

The rest of the instructions will assume you've opened Powershell in the clamav source directory.

## Build ClamAV

First, make a "build" subdirectory. This will enable you to easily delete your build files if something goes wrong and you need to re-configure and try again.

```ps1
mkdir build && cd build
```

### Building with Mussels

#### Building the library dependencies with Mussels

Much like `vcpkg`, [Mussels](https://github.com/Cisco-Talos/Mussels) can be used to automatically build the ClamAV library dependencies. Unlike `vcpkg`, Mussels does not provide a mechanism for CMake to automatically detect the
library paths.

To build the library dependencies with Mussels, use Python's `pip` package manager to install Mussels:

```ps1
python3 -m pip install mussels
```

Update the Mussels cookbooks to get the latest build recipes and set the
`clamav` cookbook to be trusted:

```ps1
msl update
msl cookbook trust clamav
```

Use `msl list` if you wish to see the recipes provided by the `clamav` cookbook.

To build with Mussels, you may need to install a few extra tools required to build some of the libraries. These include NASM, Perl

Build the `clamav_deps` recipe to compile ClamAV's library dependencies. By default, Mussels will install them to `~\.mussels\install\<target>`

```ps1
msl build clamav_deps
```

If this worked, you should be ready to build ClamAV.

#### Building ClamAV

Next, set `$env:CLAMAV_DEPENDENCIES` to the location where Mussels built your library dependencies:

```ps1
$env:CLAMAV_DEPENDENCIES="$env:userprofile\.mussels\install\x64"
```

To configure the project, run:

```ps1
cmake ..  -G "Visual Studio 15 2017" -A x64 `
  -D JSONC_INCLUDE_DIR="$env:CLAMAV_DEPENDENCIES\include\json-c"         `
  -D JSONC_LIBRARY="$env:CLAMAV_DEPENDENCIES\lib\json-c.lib"             `
  -D ENABLE_JSON_SHARED=OFF                                              `
  -D BZIP2_INCLUDE_DIR="$env:CLAMAV_DEPENDENCIES\include"                `
  -D BZIP2_LIBRARY_RELEASE="$env:CLAMAV_DEPENDENCIES\lib\libbz2.lib"     `
  -D CURL_INCLUDE_DIR="$env:CLAMAV_DEPENDENCIES\include"                 `
  -D CURL_LIBRARY="$env:CLAMAV_DEPENDENCIES\lib\libcurl_imp.lib"         `
  -D OPENSSL_ROOT_DIR="$env:CLAMAV_DEPENDENCIES"                         `
  -D OPENSSL_INCLUDE_DIR="$env:CLAMAV_DEPENDENCIES\include"              `
  -D OPENSSL_CRYPTO_LIBRARY="$env:CLAMAV_DEPENDENCIES\lib\libcrypto.lib" `
  -D OPENSSL_SSL_LIBRARY="$env:CLAMAV_DEPENDENCIES\lib\libssl.lib"       `
  -D ZLIB_LIBRARY="$env:CLAMAV_DEPENDENCIES\lib\libssl.lib"              `
  -D LIBXML2_INCLUDE_DIR="$env:CLAMAV_DEPENDENCIES\include"              `
  -D LIBXML2_LIBRARY="$env:CLAMAV_DEPENDENCIES\lib\libxml2.lib"          `
  -D PCRE2_INCLUDE_DIR="$env:CLAMAV_DEPENDENCIES\include"                `
  -D PCRE2_LIBRARY="$env:CLAMAV_DEPENDENCIES\lib\pcre2-8.lib"            `
  -D CURSES_INCLUDE_DIR="$env:CLAMAV_DEPENDENCIES\include"               `
  -D CURSES_LIBRARY="$env:CLAMAV_DEPENDENCIES\lib\pdcurses.lib"          `
  -D PThreadW32_INCLUDE_DIR="$env:CLAMAV_DEPENDENCIES\include"           `
  -D PThreadW32_LIBRARY="$env:CLAMAV_DEPENDENCIES\lib\pthreadVC2.lib"    `
  -D ZLIB_INCLUDE_DIR="$env:CLAMAV_DEPENDENCIES\include"                 `
  -D ZLIB_LIBRARY="$env:CLAMAV_DEPENDENCIES\lib\zlibstatic.lib"          `
  -D LIBCHECK_INCLUDE_DIR="$env:CLAMAV_DEPENDENCIES\include"             `
  -D LIBCHECK_LIBRARY="$env:CLAMAV_DEPENDENCIES\lib\checkDynamic.lib"    `
  -D CMAKE_INSTALL_PREFIX="install"
```

Now, go ahead and build the project:

```ps1
cmake --build . --config Release
```

> _Tip_: If you're having include-path issues when building, try building with
detailed verbosity so you can verify that the paths are correct:

```ps1
cmake --build . --config Release -- /verbosity:detailed
```

You can run the test suite with CTest:

```ps1
ctest -C Release
```

And you can install to the `install` (set above) like this:

```ps1
cmake --build . --config Release --target install
```

> _Tip_: For a full list of configuration options, see the "Custom CMake options" section in the `INSTALL.md` file included with the source code.

### Building with vcpkg

`vcpkg` can be used to build the ClamAV library dependencies automatically.

`vcpkg` integrates really well with CMake, enabling CMake to find your compiled libraries automatically, so you don't have to specify the include & library paths manually as you do when using Mussels.

> _DISCLAIMER_: There is a known issue with the unit tests when building with vcpkg in Debug mode. When you run the > libclamav unit tests (check_clamav), the program will crash and a popup will claim there was heap corruption. If > you use Task Manager to kill the `check_clamav.exe` process, the rest of the tests pass just fine. This issue does > not occur when using Mussels to supply the library dependencies. Commenting out the following lines in `readdb.c` > resolves the heap corruption crash when running `check_clamav`, but of course introduces a memory leak:
> ```c
>     if (engine->stats_data)
>         free(engine->stats_data);
> ```
> If anyone has time to figure out the real cause of the vcpkg Debug-build crash in check_clamav, it would be greatly appreciated.

You'll need to install [vcpkg](https://github.com/microsoft/vcpkg). See the `vcpkg` README for installation instructions.

Once installed, set the variable `$VCPKG_PATH` to the location where you installed `vcpkg`:

```ps1
$VCPKG_PATH="..." # Path to your vcpkg installation
```

By default, CMake and `vcpkg` build for 32-bit. If you want to build for 64-bit, set the `VCPKG_DEFAULT_TRIPLET` environment variable:

```ps1
$env:VCPKG_DEFAULT_TRIPLET="x64-windows"
```

Next, use `vcpkg` to build the required library dependencies:

```ps1
& "$VCPKG_PATH\vcpkg" install 'curl[openssl]' 'json-c' 'libxml2' 'pcre2' 'pthreads' 'zlib' 'pdcurses' 'bzip2' 'check'
```

Now configure the ClamAV build using the `CMAKE_TOOLCHAIN_FILE` variable which will enable CMake to automatically find the libraries we built with `vcpkg`.

```ps1
cmake .. -A x64 `
  -D CMAKE_TOOLCHAIN_FILE="$VCPKG_PATH\scripts\buildsystems\vcpkg.cmake" `
  -D CMAKE_INSTALL_PREFIX="install"
```

> _Tip_: You have to drop the `-A x64` arguments if you're building for 32-bits, and correct the package paths accordingly.

Now, go ahead and build the project:

```ps1
cmake --build . --config Release
```

You can run the test suite with CTest:

```ps1
ctest -C Release
```

And you can install to the `install` directory (set above) like this:

```ps1
cmake --build . --config Release --target install
```

### Build the Installer

To build the installer, you must have WIX Toolset installed. If you're using Chocolatey, you can install it simply with `choco install wixtoolset` and then open a new terminal so that WIX will be in your PATH.

```ps1
cpack -C Release
```

## What now?

Now that ClamAV is installed, you will want to customize your configuration and perhaps set up some scanning automation and alerting mechanisms.

[Continue on to "Configuration"...](../Usage/Configuration.md)
