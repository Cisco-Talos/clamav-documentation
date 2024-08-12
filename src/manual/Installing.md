# Installing ClamAV

- [Installing ClamAV](#installing-clamav)
  - [Installing with a Package Manager](#installing-with-a-package-manager)
  - [Installing with an Installer](#installing-with-an-installer)
    - [Linux (.deb, .rpm)](#linux-deb-rpm)
      - [RPM packages (for CentOS, Redhat, Fedora, SUSE, etc.)](#rpm-packages-for-centos-redhat-fedora-suse-etc)
      - [DEB packages (for Debian, Ubuntu, Mint, etc.)](#deb-packages-for-debian-ubuntu-mint-etc)
    - [macOS](#macos)
    - [Windows](#windows)
  - [Official ClamAV Docker Images](#official-clamav-docker-images)
  - [Installing from Source](#installing-from-source)
  - [Verifying ClamAV.net Downloads with GPG](#verifying-clamavnet-downloads-with-gpg)
  - [What now?](#what-now)

## Installing with a Package Manager

ClamAV is widely available from third party package managers for most operating systems. This is often the quickest way to install ClamAV. It will make also upgrades easier.

Check out the [Packages page](Installing/Packages.md) to find installation instructions for your system.

## Installing with an Installer

Pre-compiled packages provided on [the clamav.net downloads page](https://www.clamav.net/downloads) have all external library dependencies statically compiled in.

These installers likely differ from packages provided by other packaging tools in that you will need to create and configure the `freshclam.conf` and `clamd.conf` files. You may also need to add a `clamav` service user account and adjust the permissions on the database directory. We hope to round out these sharp corners in the future and to make setup more convenient, but for now be advised that setup from one of these packages is a little bit more work than you may be used to.

If you're interested in learning how these packages were built, you can check out [these development instructions](Development/build-installer-packages.md).

> _Note_: In the event that a vulnerability is found in one of the dependencies that may impact ClamAV, we will publish new packages with updated dependencies as soon as we're able.

### Linux (.deb, .rpm)

Beginning with ClamAV 0.104, we offer Debian and RPM packages for x86_64 (64bit) and i686 (32bit) architectures. This will make it easier to get the latest version in the event that a package for your distribution is not readily available and you would prefer not to build ClamAV from source.

> _Note_: These packages do not presently include `clamav-milter`. You can help help us add `clamav-milter` to the packages by developing a Mussels recipe for building the libmilter.a static library and contributing it to our [Mussels cookbook](https://github.com/Cisco-Talos/clamav-mussels-cookbook/).

#### RPM packages (for CentOS, Redhat, Fedora, SUSE, etc.)

These are compiled on CentOS 7. They should be compatible with all RPM-based linux distributions running `glibc` version `2.17` or newer.

To install, download the package for your system use `yum` or `dnf` to install the package. For example:
```bash
sudo dnf install ~/Downloads/clamav-0.104.0-rc2.linux.x86_64.rpm
```

You can verify that the package was installed using:
```bash
dnf info clamav
```

This package installs to `/usr/local`.

Unlike packages provided by Debian or other distributions, this package does not presently include a preconfigured `freshclam.conf`, `clamd.conf`, database directory, or `clamav` user accounts for FreshClam and ClamD. You can follow [these instructions](Usage/Configuration.md) to configure FreshClam and ClamD. You can follow [these instructions](Installing/Add-clamav-user.md) to create the `clamav` user account for running FreshClam and ClamD services.

And uninstall the package with:
```bash
sudo dnf remove ~/Downloads/clamav-0.104.0-rc2.linux.x86_64.rpm
```

#### DEB packages (for Debian, Ubuntu, Mint, etc.)

These are compiled on Ubuntu 18.04, and have all external library dependencies statically compiled in. They should be compatible with all Debian-based linux distributions running `glibc` version `2.27` or newer.

```bash
sudo apt install ~/Downloads/clamav-0.104.0-rc2.libnux.x86_64.deb
```

You can verify that the package was installed using:
```bash
apt info clamav
```

This package installs to `/usr/local`.

Unlike packages provided by Debian or other distributions, this package does not presently include a preconfigured `freshclam.conf`, `clamd.conf`, database directory, or `clamav` user accounts for FreshClam and ClamD. You can follow [these instructions](Usage/Configuration.md) to configure FreshClam and ClamD. You can follow [these instructions](Installing/Add-clamav-user.md) to create the `clamav` user account for running FreshClam and ClamD services.

And uninstall the package with:
```bash
sudo apt remove clamav
```

### macOS

Beginning with ClamAV 0.104, we offer a PKG installer for macOS. These are universal binaries built for Intel x86_64 and Apple M1 arm64 processors.

To install, download the macOS `.pkg` installer. Double-click the installer and follow the directions.

This package installs to `/usr/local/clamav`. This is **not** in the default system `PATH` environment variable. You may wish to add `/usr/local/clamav/bin` and `/usr/local/clamav/sbin` to your `PATH` so you can run the ClamAV programs without entering the full path. To do this add this line to `~/.zshrc`:
```bash
export PATH=/usr/local/clamav/bin:/usr/local/clamav/sbin:$PATH
```
Then run `source ~/.zshrc` or open a new terminal.

Unlike packages provided by Homebrew, this package does not presently include a preconfigured `freshclam.conf`, `clamd.conf`, or database directory. You can follow [these instructions](Usage/Configuration.md) to configure FreshClam and ClamD.

macOS package installers do not provide a mechanism for automatically uninstalling the package. In the future, we hope to add a script to aid with uninstallation. But for now, to make it easier to remove, our macOS installer installs to `/usr/local/clamav`. To uninstall, all you need to do is run:
```bash
sudo rm -rf /usr/local/clamav
```

### Windows

The ClamAV team provides official ClamAV builds for Windows [on the ClamAV downloads page](https://www.clamav.net/downloads#otherversions). You can choose between a traditional executable installer or a portable install ZIP package.

To use the executable installer, double-click the installer and follow the instructions.

To install from a ZIP package, unzip the portable install package to any directory.

## Official ClamAV Docker Images

There are now official ClamAV images on Docker Hub. You can find the images on [Docker Hub under `clamav`](https://hub.docker.com/r/clamav/clamav).

At present we offer images with builds of the latest development version. We call this "unstable". ClamAV 0.104 will be the first stable release that we'll publish on Docker Hub.. Once published 0.104.0+ will be available using a Docker image tag with the specific version number, or using "stable" to get the latest stable release.

Check out the [Docker page](Installing/Docker.md) to learn how to install and use ClamAV with Docker.

## Installing from Source

If you need, you can also compile and install ClamAV from source:
- [Unix/Linux/Mac Instructions](Installing/Installing-from-source-Unix.md)
- [Windows Instructions](Installing/Installing-from-source-Windows.md)

## Verifying ClamAV.net Downloads with GPG

You can verify the authenticity of ClamAV release packages provided [on the ClamAV downloads page](https://www.clamav.net/downloads) using [GnuPG](http://www.gnupg.org/).

1. Install GnuPG.
2. Download the [Cisco Talos GPG public key](../manual/cisco-talos.gpg).
3. Import the key into your local public keyring:
   ```bash
   gpg --import cisco-talos.gpg
   ```
4. Download the ClamAV package AND the corresponding `.sig` file to the same directory.
5. Verify that the stable release download is signed with the [Cisco Talos GPG public key]:
   ```bash
   gpg --verify clamav-X.XX.tar.gz.sig
   ```

The resulting output should look something like this. The specific details will differ, as we rotate the GPG key every couple of years:
```bash
    gpg: Signature made Wed Jan 24 19:31:26 2018 EST
    gpg:                using RSA key F13F9E16BCA5BFAD
    gpg: Good signature from "Talos (Talos, Cisco Systems Inc.) [email address]" [unknown]
```

## What now?

Now that ClamAV is installed, you will want to customize your configuration and perhaps set up some scanning automation and alerting mechanisms.

[Continue on to "Configuration"...](Usage/Configuration.md)
