# Building ClamAV with CMake (v0.104 and newer)

The following are instructions to build ClamAV *version 0.104 and newer* using CMake.

> _Tip_: If you wish to build ClamAV *version 0.103 or older* from source, follow [these instructions to build ClamAV using Autotools](Installing-from-source-Unix-old.md).

- [Building ClamAV with CMake (v0.104 and newer)](#building-clamav-with-cmake-v0104-and-newer)
  - [Install prerequisites](#install-prerequisites)
    - [Alpine:](#alpine)
    - [Redhat / Centos / Fedora:](#redhat--centos--fedora)
    - [Ubuntu / Debian:](#ubuntu--debian)
    - [macOS](#macos)
    - [FreeBSD](#freebsd)
  - [Adding new system user and group](#adding-new-system-user-and-group)
  - [Download the source code](#download-the-source-code)
  - [Build ClamAV](#build-clamav)
    - [The Default Build](#the-default-build)
    - [A Linux Distribution-style Build](#a-linux-distribution-style-build)
    - [A Build for Development](#a-build-for-development)
    - [About the tests](#about-the-tests)
  - [Un-install](#un-install)
  - [What now?](#what-now)

> _Note_: Some of the dependencies are optional if you elect to not build all of the command line applications, or elect to only build the libclamav library. Specifically:
>
> - libcurl:  _required for libfreshclam, freshclam, clamsubmit, clamonacc_
> - ncurses:  _required for clamdtop_
>
> For more information about customized builds and which dependencies can be skipped, please see the `INSTALL.md` document accompanying the source code.

## Install prerequisites

> _Note_: Many of the instructions below rely on Python 3's Pip package manager to install CMake. This is because many distributions do not provide a new enough version of CMake required to build ClamAV.

> _Tip_: The Python 3 `pytest` package is recommended in the instructions below in case the unit tests fail so that the test output is easy to read. *You're welcome to skip it.* However, if you have Python 2's `pytest` installed but not Python 3's `pytest`, the tests may fail to run.

### Alpine:

As root or with `sudo`, run:
```sh
apk update && apk add \
  `# install tools` \
  g++ gcc gdb make cmake py3-pytest python3 valgrind \
  `# install clamav dependencies` \
  bzip2-dev check-dev curl-dev json-c-dev libmilter-dev libxml2-dev \
  linux-headers ncurses-dev openssl-dev pcre2-dev zlib-dev
```

### Redhat / Centos / Fedora:

*For Centos 8*, you will probably need to run this to enable EPEL & PowerTools.
As root or with `sudo`, run:
```sh
dnf install -y epel-release
dnf install -y dnf-plugins-core
dnf install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-8.noarch.rpm
dnf config-manager --set-enabled PowerTools | \
  dnf config-manager --set-enabled powertools | true
```

As root or with `sudo`, run:
```sh
dnf install -y \
  `# install tools` \
  gcc gcc-c++ make python3 python3-pip valgrind \
  `# install clamav dependencies` \
  bzip2-devel check-devel json-c-devel libcurl-devel libxml2-devel \
  ncurses-devel openssl-devel pcre2-devel sendmail-devel zlib-devel
```

> _Note_: If you get `dnf: command not found`, use `yum` instead.

As a regular user, run:
```sh
python3 -m pip install --user cmake pytest
```

> _Tip_: If you don't have a user account, e.g. in a Docker container, run:
> ```sh
> python3 -m pip install cmake pytest
> ```

### Ubuntu / Debian:

As root or with `sudo`, run:
```sh
apt-get update && apt-get install -y \
  `# install tools` \
  gcc make pkg-config python3 python3-pip python3-pytest valgrind \
  `# install clamav dependencies` \
  check libbz2-dev libcurl4-openssl-dev libjson-c-dev libmilter-dev \
  libncurses5-dev libpcre2-dev libssl-dev libxml2-dev zlib1g-dev
```

As a regular user, run:
```sh
python3 -m pip install --user cmake
```

> _Tip_: If you don't have a user account, e.g. in a Docker container, run:
> ```sh
> python3 -m pip install cmake
> ```

### macOS

The following instructions require you to install [HomeBrew](https://brew.sh/) to install tools and library dependencies.

```sh
brew update

packages=(
  # install tools
  python3 cmake
  # install clamav dependencies
  bzip2 check curl-openssl json-c libxml2 ncurses openssl@1.1 pcre2 zlib
)
for item in "${packages[@]}"; do
  brew install $item || true; brew upgrade $item || brew upgrade $item
done

python3 -m pip install --user cmake pytest
```

### FreeBSD

As root or with `sudo`, run:
```sh
pkg install -y \
  `# install tools` \
  gmake cmake pkgconf py38-pip python38 \
  `# install clamav dependencies` \
  bzip2 check curl json-c libmilter libxml2 ncurses pcre2
```

Now as a regular user, run:
```sh
python3.8 -m pip install --user pytest
```

> _Tip_: If you don't have a user account, e.g. in a Docker container, run:
> ```sh
> python3 -m pip install pytest
> ```

## Adding new system user and group

If installing to the system, and if you intend to run `freshclam` or `clamd` as as service, you should create a service account before compiling and installing ClamAV.

[Follow these steps to create a service account](Add-clamav-user.md).

## Download the source code

Download the source from [the clamav.net downloads page](https://www.clamav.net/downloads).

Extract the archive:
```bash
tar xzf clamav-[ver].tar.gz
cd clamav-[ver]
```

## Build ClamAV

First, make a "build" subdirectory. This will enable you to easily delete your build files if something goes wrong and you need to re-configure and try again.

```bash
mkdir build && cd build
```

Next, select the build options you desire. For a full list of configuration options, see the "Custom CMake options" section in the `INSTALL.md` file included with the source code.

To help you get started, here are some popular build configurations.

### The Default Build

The default build type is `RelWithDebInfo`, that is "Release mode with Debugging symbols". It will install to `/usr/local`.

```bash
cmake ..
cmake --build .
ctest
sudo cmake --build . --target install
```

> _Tip_: If building for macOS, you may need to override the system provided LibreSSL with the OpenSSL you installed using Homebrew.
> For example:
> ```sh
> cmake .. \
>   -D CMAKE_INSTALL_PREFIX=/usr/local/clamav                                    \
>   -D OPTIMIZE=OFF                                                              \
>   -D OPENSSL_ROOT_DIR=/usr/local/opt/openssl@1.1/                              \
>   -D OPENSSL_CRYPTO_LIBRARY=/usr/local/opt/openssl@1.1/lib/libcrypto.1.1.dylib \
>   -D OPENSSL_SSL_LIBRARY=/usr/local/opt/openssl@1.1/lib/libssl.1.1.dylib
> make
> sudo make install
> ```

### A Linux Distribution-style Build

This build type mimics the layout you may be familiar with if installing a ClamAV package on Debian, Ubuntu, Alpine, and some other distributions:
```bash
cmake .. \
    -D CMAKE_INSTALL_PREFIX=/usr \
    -D CMAKE_INSTALL_LIBDIR=lib \
    -D APP_CONFIG_DIRECTORY=/etc/clamav \
    -D DATABASE_DIRECTORY=/var/lib/clamav \
    -D ENABLE_JSON_SHARED=OFF
cmake --build .
ctest
sudo cmake --build . --target install
```

Using the above example:

- `CMAKE_INSTALL_PREFIX` - The install "prefix" will be `/usr`.

- `CMAKE_INSTALL_LIBDIR` - The library directory will be `lib` (i.e. `/usr/lib`).

  This may be the default anyways, but you may want to specify if CMake tries to install to `lib64` and if `lib64` is not desired.

- `APP_CONFIG_DIRECTORY` - The config directory will be `/etc/clamav`.

  *Note*: This absolute path is non-portable.

- `DATABASE_DIRECTORY` - The database directory will be `/var/lib/clamav`.

  *Note*: This absolute path is non-portable.

> _Tip_: Setting `ENABLE_JSON_SHARED=OFF` is preferred, but it will require json-c version 0.15 or newer unless you build json-c yourself with custom options. If json-c 0.15+ is not available to you, you may omit the option and just use the json-c shared library. But be warned that downstream applications which use `libclamav.so` may crash if they also use a different JSON library.

Some other popular configuration options include:

- `CMAKE_INSTALL_DOCDIR` - Specify exact documentation subdirectory, relative to the install prefix. The default may vary depending on your system and how you install CMake.

  E.g., `-D CMAKE_INSTALL_DOCDIR=share/doc/packages/clamav`

- `CMAKE_SKIP_RPATH` - If enabled, no RPATH is built into anything. This may be required when building packages for some Linux distributions. See the [CMake wiki](https://gitlab.kitware.com/cmake/community/-/wikis/doc/cmake/RPATH-handling) for more detail about CMake's RPATH handling.

  E.g., `-D CMAKE_SKIP_RPATH=ON`

Please see the [CMake documentation](https://cmake.org/cmake/help/latest/command/install.html#installing-files) for more instructions on how to customize the install paths.

### A Build for Development

This suggested development configuration generates a Ninja-based build system instead of the default Makefile-based build system. Ninja is faster than Make, but you will have to install "ninja" (or "ninja-build"). With the following commands, ClamAV will be compiled in `Debug` mode with optimizations disabled. It will install to an "install" subdirectory and SystemD integration is disabled so that `sudo` is not required for the install and SystemD unit files are not installed to the system. This build also enables building a static `libclamav.a` library as well as building the example applications.

```bash
cmake .. -G Ninja \
    -D CMAKE_BUILD_TYPE=Debug \
    -D OPTIMIZE=OFF \
    -D CMAKE_INSTALL_PREFIX=`pwd`/install \
    -D ENABLE_EXAMPLES=ON \
    -D ENABLE_STATIC_LIB=ON \
    -D ENABLE_SYSTEMD=OFF
cmake --build .
ctest --verbose
cmake --build . --target install
```

You can find additional instructions [in our Development chapter](../Development/development-builds.md).

### About the tests

ClamAV's public test suite is run using `ctest`. On Linux systems, our build system will detect if you have Valgrind. If installed, each test will run a second time using Valgrind to check for leaks.

If a test fails, please [report the issue on GitHub](https://github.com/Cisco-Talos/clamav/issues). You will find `.log` files for each of the tests in the `build/unit_tests` directory. The output from `ctest --verbose` may give us enough information, but if not it could be helpful to zip up the `.log` files and attach them to the ticket.

## Un-install

CMake doesn't provide a simple command to uninstall. However, CMake does build an `install_manifest.txt` file when you do the install. You can use the manifest to remove the installed files.

You will find the manifest in the directory where you compiled ClamAV. If you followed the recommendations (above), then you will find it at `<clamav source directory>/build/install_manifest.txt`.

Feel free to inspect the file so you're comfortable knowing what you're about to delete.

Open a terminal and `cd` to that `<clamav source directory>/build` directory. Then run:
```bash
xargs rm < install_manifest.txt
```

This will leave behind the directories, and will leave behind any files added after install including the signature databases and any config files. You will have to delete these extra files yourself.

> _Tip_: You may need to use `sudo`, depending on where you installed to.

## What now?

Now that ClamAV is installed, you will want to customize your configuration and perhaps set up some scanning automation and alerting mechanisms.

[Continue on to "Configuration"...](../Usage/Configuration.md)
