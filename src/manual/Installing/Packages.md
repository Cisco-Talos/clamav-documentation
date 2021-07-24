# ClamAV Packages

Many Linux and Unix distributions as well as packaging systems for macOS and Windows offer one or more ClamAV packages to make it easy for you to install ClamAV.

These packages are usually well maintained but if you find an issue with one, please consider helping the volunteers that maintain the packages.

> _Disclaimer_: ClamAV packages may vary somewhat from the upstream version.
> Some examples:
>
> - The database and application config paths may vary:
>
>   - A default from-source install will go in `/usr/local`, with:
>     - applications in `/usr/local/bin`
>     - daemons in `/usr/local/sbin`
>     - libraries in `/usr/local/lib`
>     - headers in `/usr/local/include`
>     - configs in `/usr/local/etc/` (or `/usr/local/etc/clamav/` for v0.104+)
>     - databases in `/usr/local/share/clamav/`
>
>   - A Linux package install will probably go in `/usr`, with:
>     - applications in `/usr/bin`
>     - daemons in `/usr/sbin`
>     - libraries in `/usr/lib`
>     - headers in `/usr/include`
>     - configs in `/etc/clamav`
>     - databases in `/var/lib/clamav`
>
> - As of 0.103.x, a from-source install requires the user create a config for FreshClam, ClamD, and ClamAV-Milter in order to use each application. A package install, however, is likely to come pre-configured. Users may wish to modify the configs as needed.
>
> - Package installs sometimes carry extra patches for issues affecting their distribution, for issues the ClamAV developers haven't had time to fix or are unaware of, and for security issues when distributing older versions that are no longer maintained by the ClamAV developers.
>
> - Some distributions parcel up ClamAV components into separate packages. You don't necessarily need all of the packages. If this applies to your package system, you may need to review the applications described in the [scanning instructions](../Usage/Scanning.md) to understand which features you will need.

> _Acknowledgments_: Thank you to all of the volunteers who maintain these packages! We appreciate your help!

## The Packages

### Debian

Debian splits up ClamAV into a selection of different packages.

Realistically, you probably only need to `apt install clamav` and probably `apt install clamav-daemon`. If you require support for scanning compressed RAR files you first need to enable the "non-free" archive.`*`

The full list of packages includes:

- `clamav` - command-line interface
- `clamav-base` - base package
- `clamav-daemon` - scanner daemon
- `clamav-docs` - documentation
- `clamav-freshclam` - virus database update utility
- `clamav-milter` - sendmail integration
- `clamav-testfiles` - test files
- `libclamav-dev` - development files
- `libclamav9` - library
- `libclamunrar9` - unrar support

> `*` _RAR Support_: ClamAV's RAR support comes from UnRAR, which is open-source but not entirely free in so far as its license restricts users from reverse engineering it to create RAR archives. For this reason, it is bundled separately in the "non-free" archive. Enable it by adding "non-free" to `/etc/apt/sources.list`. Eg:
>
> `deb http://http.us.debian.org/debian stable main contrib non-free`
>
> Then you can install the RAR-plugin using: `apt install libclamunrar9`

There are a variety of other ClamAV related projects as well.  Run `apt search clamav` to see a larger list.

To test the installation, you can try to scan the test files in the `clamav-testfiles` package.

> _Note_: Debian packages are maintained by [Debian's ClamAV Team](https://salsa.debian.org/clamav-team).
>
> The package maintainers can be reached at [clamav-devel at lists.alith.debian.org](pkg-clamav-devel@lists.alioth.debian.org). More info at [tracker.debian.org/pkg/clamav](https://tracker.debian.org/pkg/clamav).
>
> Patches: https://salsa.debian.org/clamav-team/clamav/tree/unstable/debian/patches

### Ubuntu

Ubuntu's ClamAV packages are derived from the Debian packages (above). See the Debian instructions for installation details.

> _RAR Support_: As with Debian, RAR support is not included in the base package. Users that desire RAR support will have to install `libclamunar9` separately. Unlike with Debian, there is no need to enable "non-free" packages for this to work.

> _Note_: Ubuntu packages are curated by [Ubuntu Developers](https://wiki.ubuntu.com/UbuntuDevelopers).
> Package source: https://packages.ubuntu.com/source/clamav

### openSUSE

openSUSE provides two packages:
- `clamav` - The clamav package
- `clamav-devel` - The clamav package plus headers for software development.

#### RPM download

Find these packages at under http://download.opensuse.org/repositories/security
Eg.:
 - http://download.opensuse.org/repositories/security/openSUSE_Leap_15.3/x86_64/clamav-0.103.1-lp153.234.4.x86_64.rpm.mirrorlist
 - http://download.opensuse.org/repositories/security/openSUSE_Leap_15.3/x86_64/clamav-devel-0.103.1-lp153.234.4.x86_64.rpm.mirrorlist

Use the update variant for openSUSE, add it to your installation as another repository using YaST or zypper and give it a higher priority (lower number) than the repository that delivers the official updates.

> _Tip_: RPMs of new ClamAV versions for existing SUSE products are provided through the respective online update channels. As these packages have to go through QA, it usually takes some time for a new ClamAV source release to appear as an official RPM. For those who want the newest version, packages are available from [the security project in the openSUSE Build Service](https://build.opensuse.org/package/show/security/clamav).

#### Zypper

Install ClamAV with `zypper`:

```bash
  zypper install -y clamav
```

> _Note_: openSUSE packages are maintained by Reinhard Max.

### EPEL: Fedora, RHEL, and CentOS

EPEL creates ClamAV packages for Fedora (as well as EPEL-enabled CentOS and RHEL). For more information on EPEL, [visit their wiki](https://fedoraproject.org/wiki/EPEL).

To enable EPEL for CentOS:
```bash
dnf install -y epel-release
```

EPEL offers a selection of packages to install ClamAV:
- `clamd` - The Clam AntiVirus Daemon
- `clamav` - End-user tools for the Clam Antivirus scanner
- `clamav-data` - Virus signature data for the Clam Antivirus scanner
- `clamav-devel` - Header files and libraries for the Clam Antivirus scanner
- `clamav-lib` - Dynamic libraries for the Clam Antivirus scanner
- `clamav-milter` - Milter module for the Clam Antivirus scanner
- `clamav-update` - Auto-updater for the Clam Antivirus scanner data-files

Most users will only need to run:

```bash
dnf install -y clamav clamd clamav-update
```

> **_Tips_**
>
> _CentOS_: On Community Enterprise Operating System (CentOS) the ClamAV package requires the Extra Packages for Enterprise Linux (EPEL) repository.
>
> _RHEL_: On RedHat Enterprise Linux (RHEL) the EPEL release package has to be installed either manually or through RHN.
>
> _Fedora_: Fedora packages can be found at https://src.fedoraproject.org/rpms/clamav
>
> Fedora's packaging is more customized than most. Please review the RPM notes when troubleshooting your Fedora package configuration.

### Gentoo

ClamAV is available in portage under `/usr/portage/app-antivirus/clamav`

To install, run:
```bash
emerge clamav
```

For more details, see the package entry on [Portage](https://packages.gentoo.org/packages/app-antivirus/clamav).

### FreeBSD, OpenBSD, NetBSD

Although all these systems offer the possibility to use ports or pkgsrc, you can install the pre-built package:

#### FreeBSD

FreeBSD offers two ClamAV ports (packages):
- `clamav`
- `clamav-devel`

To install, run:
```bash
pkg install clamav
```

> _Note_: For more details, see:
> - https://www.freshports.org/security/clamav
> - https://www.freshports.org/security/clamav-devel

#### OpenBSD

To install, run:
```bash
  pkg_add clamav
```

#### NetBSD

To install, run:
```bash
  pkgin install clamav
```

### Solaris

OpenCSW is a community software project for Solaris 8+ on both Sparc and x86. It packages more than 2000 popular open source titles and they can all easily be installed with dependency handling via _pkgutil_ which is modeled after Debian's _apt-get_.

```bash
pkgutil -i clamav
```

> _Note_: The package can be found on [OpenCSW](https://www.opencsw.org/packages/clamav/) though it is unfortuantely quite out-of-date.

> _Disclaimer_: ClamAV is also no longer supported on Solaris because Solaris is proprietary, less commonly used, and difficult to work with. Future versions of ClamAV will depend on components written in the Rust programming language, which also does not support building directly on Solaris. It is likely that ClamAV will no longer work on Solaris in the future.

### Slackware

You can download ClamAV builds for Slackware from https://slackbuilds.org/repository/14.2/system/clamav/

Download the package, and as root, install it like so (substituting the appropriate filename):

```bash
  installpkg clamav.tar.gz
```

### macOS

ClamAV can be easily installed on macOS using one of these popular package managers:
- [Homebrew](https://brew.sh): [ClamAV formula](https://formulae.brew.sh/formula/clamav)
- [MacPorts](https://www.macports.org/install.php): [ClamAV port](https://ports.macports.org/port/clamav/summary)

#### Homebrew

Install [Homebrew](https://brew.sh) if you don't already have it. Then run:

```bash
  brew install clamav
```

Homebrew installs versioned packages to `/usr/local/Cellar/<pacakge>/<version>` with symlinks in `/usr/local/opt/<pacakge>` to the current version. Symlinks for ClamAV's executables will be placed in `/usr/local/bin` to add them to your PATH. ClamAV's config files will be placed in `/usr/local/etc/clamav`.

As with most other installation methods, you may need to do the following at a minimum before you can run `freshclam`, `clamscan`, or use `clamdscan` with `clamd`:
1. Create `/usr/local/etc/clamav/freshclam.conf` from `/usr/local/etc/clamav/freshclam.conf.sample`.
2. Remove or comment-out the `Example` line from `freshclam.conf`
3. Run `freshclam` to download the latest malware definitions.

If you wish to run `clamd` you'll also need to create `/usr/local/etc/clamav/clamd.conf` from `/usr/local/etc/clamav/clamd.conf.sample`, and configure `clamd.conf` with Local/Unix socket settings (preferred), or TCP socket settings.

#### MacPorts

Install [MacPorts](https://www.macports.org/install.php) if you don't already have it. Then run:

```bash
  sudo port install clamav
```

MacPorts installs versioned packages to `/opt/local/`. ClamAV's config files will be placed in `/opt/local/etc`.

As with most other installation methods, you may need to do the following at a minimum before you can run `freshclam`, `clamscan`, or use `clamdscan` with `clamd`:
1. Create `/opt/local/etc/freshclam.conf` from `/opt/local/etc/freshclam.conf.sample`.
2. Remove or comment-out the `Example` line from `freshclam.conf`
3. Run `freshclam` to download the latest malware definitions.

If you wish to run `clamd` you'll also need to create `/opt/local/etc/clamd.conf` from `/opt/local/etc/clamd.conf.sample`, and configure `clamd.conf` with Local/Unix socket settings (preferred), or TCP socket settings.
