# Installing ClamAV

## Installing with a Package Manager

ClamAV is widely available from third party package managers for most operating systems. This is often the quickest way to install ClamAV. It will make also upgrades easier.

Check out the [Packages page](Installing/Packages.md) to find installation instructions for your system.

## Installing with an Installer

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
- [Unix/Linux/Mac Instructions](Installing-from-source/Installing-from-source-Unix.md)
- [Windows Instructions](Installing-from-source/Installing-from-source-Windows.md)

## What now?

Now that ClamAV is installed, you will want to customize your configuration and perhaps set up some scanning automation and alerting mechanisms.

[Continue on to "Configuration"...](Configuration.md)
