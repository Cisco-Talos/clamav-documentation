# Building ClamAV with Autotools (v0.103 and older)

The following are instructions to build ClamAV *version 0.103 and older* using Autotools.

- [Building ClamAV with Autotools (v0.103 and older)](#building-clamav-with-autotools-v0103-and-older)
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
> - json-c: _required for clamsubmit, optional for libclamav_
> - ncurses:  _required for clamdtop_

## Install prerequisites

### Alpine:

As root, run:
```sh
apk update && apk add \
  `# install tools` \
  g++ gcc gdb make valgrind \
  `# install clamav dependencies` \
  bzip2-dev check-dev curl-dev json-c-dev libmilter-dev libxml2-dev \
  linux-headers ncurses-dev openssl-dev pcre2-dev zlib-dev
```

### Redhat / Centos / Fedora:

*For Centos 8*, you will probably need to run this to enable EPEL & PowerTools.
As root, run:
```sh
dnf install -y epel-release
dnf install -y dnf-plugins-core
dnf install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-8.noarch.rpm
dnf config-manager --set-enabled PowerTools | \
  dnf config-manager --set-enabled powertools | true
```

Then as root, run:
```sh
dnf install -y \
  `# install tools` \
  gcc gcc-c++ make valgrind \
  `# install clamav dependencies` \
  bzip2-devel check-devel json-c-devel libcurl-devel libxml2-devel \
  ncurses-devel openssl-devel pcre2-devel sendmail-devel zlib-devel
```

### Ubuntu / Debian:

As root, run:
```sh
apt-get update && apt-get install -y \
  `# install tools` \
  gcc make pkg-config valgrind \
  `# install clamav dependencies` \
  check libbz2-dev libcurl4-openssl-dev libjson-c-dev libmilter-dev \
  libncurses5-dev libpcre2-dev libssl-dev libxml2-dev zlib1g-dev
```

### macOS

The following instructions require you to install [HomeBrew](https://brew.sh/) to install tools and library dependencies.

```sh
# Install XCode's Command Line Tools
xcode-select --install

brew update

packages=(
  # install tools
  autoconf automake m4
  # install clamav dependencies
  bzip2 check curl-openssl json-c libxml2 ncurses openssl@1.1 pcre2 zlib
)
for item in "${packages[@]}"; do
  brew install $item || true; brew upgrade $item || brew upgrade $item
done
```

### FreeBSD

As root, run:
```sh
pkg install -y \
  `# install tools` \
  git gmake pkgconf \
  `# install clamav dependencies` \
  bzip2 check curl json-c libmilter libxml2 ncurses pcre2
```

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

> _Note_: The instructions in this page assume you're building from our source `clamav-[ver].tar.gz` file. **If you aren't**, you may need to install extra build tools (autoconf, automake, m4, libtool, and pkg-config/pkgconfig/pkgconf) then run:
> ```bash
> ../autogen.sh
> ```

Next, select the build options you desire. For a full list of configuration options, run:
```bash
../configure --help
```

To help you get started, here are some popular build configurations.

### The Default Build

The default build type is "RelWithDebInfo", that is "Release mode with Debugging symbols". It will install to `/usr/local`.

```bash
../configure
make
make check VG=1
sudo make install
```

### A Linux Distribution-style Build

This build type mimics the layout you may be familiar with if installing a ClamAV package on Debian, Ubuntu, Alpine, and some other distributions. This will be a "release build" (no debugging symbols, optimizations enabled) and will install to `/usr`. The config directory will be `/etc/clamav` and the database directory will be `/var/lib/clamav`.

```bash
../configure \
    --prefix=/usr
    --sysconfdir=/etc/clamav \
    --with-dbdir=/var/lib/clamav \
    --with-libjson-static=/path/to/libjson-c.a \
    --enable-milter
make
make check VG=1
sudo make install
```

> _Note_: Setting `ENABLE_JSON_SHARED=OFF` is preferred, but it will require json-c version 0.15 or newer. If json-c 0.15+ is not available to you, you may omit the option and just use the json-c shared library. But be warned that downstream applications which use `libclamav.so` may crash if they also use a different JSON library.

### A Build for Development

With the following commands, ClamAV will be compiled with debugging symbols and with optimizations disabled. It will install to an "install" subdirectory and SystemD integration is disabled so that `sudo` is not required for the install and SystemD unit files are not installed to the system.

```bash
CFLAGS="-Wall -Wextra -ggdb -O0" CXXFLAGS="-Wall -Wextra -ggdb -O0" ../configure \
    --prefix=`pwd`/install \
    --with-systemdsystemunitdir=no
make -j12
make check VG=1
sudo make install
```

### About the tests

ClamAV's public test suite is run using `make check`. On Linux systems, the `VG=1` argument will enable extra tests that use Valgrind to check for leaks.

If a test fails, please [report the issue on GitHub](https://github.com/Cisco-Talos/clamav/issues). You will find `.log` files generated by the tests in the `build/unit_tests` directory. The output from `make check VG=1` may give us enough information, but if not it could be helpful to zip up the `.log` files and attach them to the ticket.

## Un-install

Run `make uninstall` to remove the installed files.

This will leave behind the directories, and will leave behind any files added after install including the signature databases and any config files. You will have to delete these extra files yourself.

> _Tip_: You may need to use `sudo`, depending on where you installed to.

## What now?

Now that ClamAV is installed, you will want to customize your configuration and perhaps set up some scanning automation and alerting mechanisms.

[Continue on to "Configuration"...](../Usage/Configuration.md)
