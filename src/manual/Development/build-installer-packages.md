# Building the Installer Packages

ClamAV's installer packages are compiled in a Jenkins CI environment in the Cisco-Talos development network. For each supported OS / packaging system / architecture, we have a computer (or VM) that maintains a copy of ClamAV's external library dependencies. These libraries are recompiled using [Mussels](https://github.com/Cisco-Talos/Mussels) any time there is a change to the recipes in [our "clamav" Mussels cookbook](https://github.com/Cisco-Talos/clamav-mussels-cookbook/).

Instructions follow for how you can build the installer packages in much the same way that we do.

## Linux

> _Tip_: Using an older version of Linux is best. ClamAV's only dependency will be on `glibc`, which is forwards compatible. That is to say that if you build the installer on an older version of Linux, it should install and run on a new version of Linux. The opposite is not true.

First, install Mussels:
```bash
python3 -m pip install --user mussels
```

Mussels also requires Git, so if you don't have that installed, install it now.

Now to use Mussels, run:
```bash
# This requires Git, and will clone the the "clamav" and "scrapbook" cookbooks.
msl up

# This is to enable running the scripts in the clamav cookbook to build the clamav dependencies.
msl cookbook trust -y clamav

# This is just to get you in a small directory so Mussels don't spend forever searching your harddrive for build recipes.
mkdir tmp && cd tmp

# First try a dry-run. If you're missing any tools, it will tell you.
# If you have everything, it will give you a list of the order it plans to build everything.
msl build -t host-static clamav_deps --dry-run

# Then do the build.
msl build -t host-static clamav_deps
```

> _Tip_: On some systems you may encounter this error:
> ```
> RuntimeError: Click will abort further execution because Python was configured to use ASCII as encoding for the environment. Consult https://click.palletsprojects.com/unicode-support/ for mitigation steps.
>
> This system lists some UTF-8 supporting locales that you can pick from. The following suitable locales were discovered: en_AG.utf8, en_AU.utf8, en_BW.utf8, en_CA.utf8, en_DK.utf8, en_GB.utf8, en_HK.utf8, en_IE.utf8, en_IN.utf8, en_NG.utf8, en_NZ.utf8, en_PH.utf8, en_SG.utf8, en_US.utf8, en_ZA.utf8, en_ZM.utf8, en_ZW.utf8
> ```
> To resolve this, pick a local and set it, like this:
> ```
> export LC_ALL=en_US.utf8
> ```
> After you've set `LC_ALL` to your desired locale, re-run the above `msl` commands.  You should see it run Git to update the cookbooks without error.

So assuming you've now build the clamav dependencies, you should be ready to build ClamAV.

In a Git clone of the clamav source (or the extracted source tarball from a release), create a `build` subdirectory and open a terminal in that `build` directory.

Run the following...

Configure (generate the build system):
```bash
cmake .. \
    -D CMAKE_FIND_PACKAGE_PREFER_CONFIG=TRUE                                          \
    -D CMAKE_PREFIX_PATH="$HOME/.mussels/install/host-static"                         \
    -D CMAKE_INSTALL_PREFIX="/usr/local"                                              \
    -D CPACK_PACKAGING_INSTALL_PREFIX="/usr/local"                                    \
    -D CPACK_DEBIAN_PACKAGE_RELEASE=1                                                 \
    -D CPACK_RPM_PACKAGE_RELEASE=1                                                    \
    -D CMAKE_MODULE_PATH="$HOME/.mussels/install/host-static/lib/cmake"               \
    -D CMAKE_BUILD_TYPE=RelWithDebInfo                                                \
    -D ENABLE_EXAMPLES=OFF                                                            \
    -D ENABLE_MILTER=OFF                                                              \
    -D JSONC_INCLUDE_DIR="$HOME/.mussels/install/host-static/include/json-c"          \
    -D JSONC_LIBRARY="$HOME/.mussels/install/host-static/lib/libjson-c.a"             \
    -D ENABLE_JSON_SHARED=OFF                                                         \
    -D BZIP2_INCLUDE_DIR="$HOME/.mussels/install/host-static/include"                 \
    -D BZIP2_LIBRARY_RELEASE="$HOME/.mussels/install/host-static/lib/libbz2_static.a" \
    -D OPENSSL_ROOT_DIR="$HOME/.mussels/install/host-static"                          \
    -D OPENSSL_INCLUDE_DIR="$HOME/.mussels/install/host-static/include"               \
    -D OPENSSL_CRYPTO_LIBRARY="$HOME/.mussels/install/host-static/lib/libcrypto.a"    \
    -D OPENSSL_SSL_LIBRARY="$HOME/.mussels/install/host-static/lib/libssl.a"          \
    -D LIBXML2_INCLUDE_DIR="$HOME/.mussels/install/host-static/include/libxml2"       \
    -D LIBXML2_LIBRARY="$HOME/.mussels/install/host-static/lib/libxml2.a"             \
    -D PCRE2_INCLUDE_DIR="$HOME/.mussels/install/host-static/include"                 \
    -D PCRE2_LIBRARY="$HOME/.mussels/install/host-static/lib/libpcre2-8.a"            \
    -D NCURSES_INCLUDE_DIR="$HOME/.mussels/install/host-static/include/ncurses"       \
    -D CURSES_LIBRARY="$HOME/.mussels/install/host-static/lib/libncurses.a"           \
    -D ZLIB_INCLUDE_DIR="$HOME/.mussels/install/host-static/include"                  \
    -D ZLIB_LIBRARY="$HOME/.mussels/install/host-static/lib/libz.a"                   \
    -D LIBCHECK_INCLUDE_DIR="$HOME/.mussels/install/host-static/include"              \
    -D LIBCHECK_LIBRARY="$HOME/.mussels/install/host-static/lib/libcheck.a"
```

> _Tip_: Note the use of `CPACK_DEBIAN_PACKAGE_RELEASE` and `CPACK_RPM_PACKAGE_RELEASE`. Feel free to only use the one you need for whichever platform you're targeting.  You should increase the release version number if re-releasing a new package of the same ClamAV version.

Build:
```bash
make -j12
```

It's a good idea to run the public test suite at this point:
```bash
ctest -V
```

To make the RPM package for RPM-based distributions, you'll need the rpmbuild tool, which you can install with `yum install rpm-build`. Then run:
```bash
cpack -G RPM
```

To make the DEB package for Debian-based distributions, run:
```bash
cpack -G DEB
```

## macOS

> _Note_: The macOS instructions depend on Xcode, which is required to build the arm64 + x86_64 "universal" binaries. You may need to install it from the macOS app store. Be sure to run it once to accept the EULA before you proceed.

First, install Mussels:
```bash
python3 -m pip install --user mussels
```

Mussels also requires Git, so if you don't have that installed, install it now.

Now to use Mussels, run:
```bash
# This requires Git, and will clone the the "clamav" and "scrapbook" cookbooks.
msl up

# This is to enable running the scripts in the clamav cookbook to build the clamav dependencies.
msl cookbook trust -y clamav

# This is just to get you in a small directory so Mussels don't spend forever searching your harddrive for build recipes.
mkdir tmp && cd tmp

# First try a dry-run. If you're missing any tools, it will tell you.
# If you have everything, it will give you a list of the order it plans to build everything.
msl build -t host-static clamav_deps --dry-run

# Then do the build.
msl build -t host-static clamav_deps
```

So assuming you've now build the clamav dependencies, you should be ready to build ClamAV.

In a Git clone of the clamav source (or the extracted source tarball from a release), create a `build` subdirectory and open a terminal in that `build` directory.

Run the following...

Configure (generate the build system):
```bash
cmake .. \
    -G Xcode                                                                            \
    -D CLAMAV_SIGN_FILE=ON                                                              \
    -D CMAKE_OSX_ARCHITECTURES="arm64;x86_64"                                           \
    -D CMAKE_FIND_PACKAGE_PREFER_CONFIG=TRUE                                            \
    -D CMAKE_PREFIX_PATH="$HOME/.mussels/install/host-static"                           \
    -D CMAKE_INSTALL_PREFIX="/usr/local/clamav"                                         \
    -D CPACK_PACKAGING_INSTALL_PREFIX="/usr/local"                                      \
    -D CMAKE_MODULE_PATH="$HOME/.mussels/install/host-static/lib/cmake"                 \
    -D ENABLE_EXAMPLES=OFF                                                              \
    -D JSONC_INCLUDE_DIR="$HOME/.mussels/install/host-static/include/json-c"            \
    -D JSONC_LIBRARY="$HOME/.mussels/install/host-static/lib/libjson-c.a"               \
    -D ENABLE_JSON_SHARED=OFF                                                           \
    -D BZIP2_INCLUDE_DIR="$HOME/.mussels/install/host-static/include"                   \
    -D BZIP2_LIBRARY_RELEASE="$HOME/.mussels/install/host-static/lib/libbz2_static.a"   \
    -D OPENSSL_ROOT_DIR="$HOME/.mussels/install/host-static"                            \
    -D OPENSSL_INCLUDE_DIR="$HOME/.mussels/install/host-static/include"                 \
    -D OPENSSL_CRYPTO_LIBRARY="$HOME/.mussels/install/host-static/lib/libcrypto.a"      \
    -D OPENSSL_SSL_LIBRARY="$HOME/.mussels/install/host-static/lib/libssl.a"            \
    -D LIBXML2_INCLUDE_DIR="$HOME/.mussels/install/host-static/include/libxml2"         \
    -D LIBXML2_LIBRARY="$HOME/.mussels/install/host-static/lib/libxml2.a"               \
    -D PCRE2_INCLUDE_DIR="$HOME/.mussels/install/host-static/include"                   \
    -D PCRE2_LIBRARY="$HOME/.mussels/install/host-static/lib/libpcre2-8.a"              \
    -D CURSES_INCLUDE_DIR="$HOME/.mussels/install/host-static/include"                  \
    -D CURSES_LIBRARY="$HOME/.mussels/install/host-static/lib/libncurses.a"             \
    -D ZLIB_INCLUDE_DIR="$HOME/.mussels/install/host-static/include"                    \
    -D ZLIB_LIBRARY="$HOME/.mussels/install/host-static/lib/libz.a"                     \
    -D LIBCHECK_INCLUDE_DIR="$HOME/.mussels/install/host-static/include"                \
    -D LIBCHECK_LIBRARY="$HOME/.mussels/install/host-static/lib/libcheck.a"
```

Build:
```bash
cmake --build . --config RelWithDebInfo
```

It's a good idea to run the public test suite at this point:
```bash
ctest -C RelWithDebInfo -V
```

Now, to make the installer, just run:
```bash
cpack -C RelWithDebInfo
```

This will generate the PKG installer package.

## Windows

For tips on installing development tools for Windows, see the [development build instructions](development-builds.md#for-windows).

First, install Mussels:
```bash
python3 -m pip install --user mussels
```

Mussels also requires Git, so if you don't have that installed, install it now.

> _Tip_: You may receive a warning that installed scripts are not in your `PATH` environment variable.  I strongly recommend adding the `Scripts` directory described to your `PATH`. After which, you may run Mussels using `msl` on the command line instead of typing `python3 -m mussels`, which is exceedingly tedious ;-).

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

# By default, this build will be for x64*
# If you want to build for x86, run:
msl build -t x86 clamav_deps
```

> `*`For Windows, our recipes only provide two build targets: `x64` and `x86`. We don't as of yet have an `x64-static` variant for the recipes. You'll probably want `x64`, which is the default.

So assuming you've now build the clamav dependencies, you should be ready to build ClamAV.

In a Git clone of the clamav source (or the extracted source tarball from a release), create a `build` subdirectory and open a Powershell terminal in that `build` directory.

Run the following, replacing "2019" and "Community" with different versions or editions as needed to match your Visual Studio installation...

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
Write-Host "`nVisual Studio Command Prompt variables set." -ForegroundColor Yellow

cmake ..  -G Ninja -D CMAKE_BUILD_TYPE="RelWithDebInfo" `
    -D ENABLE_EXAMPLES=OFF                                                   `
    -D ENABLE_JSON_SHARED=OFF                                                `
    -D JSONC_INCLUDE_DIR="$home\.mussels\install\x64\include\json-c"         `
    -D JSONC_LIBRARY="$home\.mussels\install\x64\lib\json-c.lib"             `
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
    -D LIBCHECK_LIBRARY="$home\.mussels\install\x64\lib\checkDynamic.lib"
```

Build:
```ps1
ninja
```

It's a good idea to run the public test suite at this point:
```bash
ctest -C RelWithDebInfo -V
```

Now, to make the installer, just run:
```ps1
cpack -C RelWithDebInfo
```

This will generate both the ZIP and the MSI installer packages.

