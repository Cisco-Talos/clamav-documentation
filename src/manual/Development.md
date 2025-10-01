# ClamAV Development

This chapter aims to provide information useful when developing, debugging, or profiling ClamAV.

## Pull Request Basics

If you're new to open source software development on GitHub, take a moment to read [this quick introduction](Development/github-pr-basics.md) on GitHub Pull Requests.

## ClamAV Git Work Flow

ClamAV's Git work flow isn't too complicated, but it is unique. See [this section](Development/clamav-git-work-flow.md) to get a better understanding of how we use Git.

## Working with Your Fork

New core developers and community contributors can [follow these steps](Development/personal-forks.md) to prepare an environment to work on ClamAV development.

## Reviewing Pull Requests

If you need to review a pull request, it's best to not only eyeball the changes and review the test logs, but to also build and test the PR manually on your own computer. [This section](Development/testing-pull-requests.md) will help you check out someone else's PR so you can test it.

## Building for Development

Basic instructions for building ClamAV can be in the [Installing](Installing.md) chapter and a comprehensive reference for compiling ClamAV with CMake is available in the [INSTALL.md](https://github.com/Cisco-Talos/clamav/blob/main/INSTALL.md) file accompanying the source code, but if you want a few extra tips on building ClamAV for development purposes, [check this out](Development/development-builds.md).

## Building the Installer Packages

If you'd like to learn how we build the installer packages and even replicate this on your own, you can [read about it here](Development/build-installer-packages.md).

## Dev Tips & Tricks

[This section](Development/tips-and-tricks.md) contains a varied assortment of techniques you can use when coding on ClamAV to up your development game.

## libclamav

Are you interested in using libclamav to scan for malware in your own C/C++ application? [This section](Development/libclamav.md) introduces the most important functions of the libclamav API. For a more comprehensive reference, inline documention can be found in [the `clamav.h` header](https://github.com/Cisco-Talos/clamav/blob/main/libclamav/clamav.h) distributed with libclamav.

## Contribute

If you're interested in contributing to ClamAV, we've assembled a page of bugs that need fixing as well as other project ideas that we feel might be great new-contributor projects.

If you're looking for project ideas, check out the [project ideas list](Development/Contribute.md) to find out how you might be able to help out the project!
