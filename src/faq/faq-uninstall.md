# Uninstalling ClamAV

## If you installed from source

### If you installed using Autotools (0.103.0 and older)

If you installed from source, the easiest way to uninstall will require that same source and build configuration in order to uninstall.

Then run:
```bash
sudo make uninstall
```

> _Tip_: If you don't have the old source / build directory from when you installed, you can get the source again and re-configure, as if for a build, so that you can use the build system to uninstall. Just be sure you use the same `./configure` options as when you first installed. For example:
> ```bash
> ./configure
> sudo make uninstall
> ```

### If you installed using CMake (0.104.0 and newer)

CMake doesn't provide a simple command to uninstall. However, CMake does build an `install_manifest.txt` file when you do the install. You can use the manifest to remove the installed files.

You will find the manifest in the directory where you compiled ClamAV. If you followed the recommendations in our [Installing from Source](../manual/Installing/Installing-from-source-Unix.md) section, then you will find it at `<clamav source directory>/build/install_manifest.txt`.

Feel free to inspect the file so you're comfortable knowing what you're about to delete.

Open a terminal and `cd` to that `<clamav source directory>/build` directory. Then run:
```bash
xargs rm < install_manifest.txt
```

This will leave behind the directories, and will leave behind any files added after install including the signature databases and any config files. You will have to delete these extra files yourself.

> _Tip_: If you don't have the old source / build directory from when you installed, you can get the source again. Unlike with Autotools, you'll have to do more than just re-configure. You'll have to compile and re-install overtop of your existing install in order to get a new copy of the `install_manifest.txt` file. But once you do that, you should be able to use the command above to uninstall. For example:
> ```bash
> cmake . &&
> make && sudo make install
> sudo xargs rm < install_manifest.txt
> ```

## If you installed from packages

* Debian/Ubuntu:

  `apt remove clamav`

* Redhat/Fedora:

  `dnf remove clamav*`

  or, on older systems:

  `yum remove clamav*`

* Mandriva:

  `urpme clamav`

* Gentoo:

  `emerge -C clamav`

* FreeBSD:

  `pkg delete clamav`

* OpenBSD:

  `pkg_delete clamav`

* NetBSD:

  `pkgin remove clamav`

* Slackware:

  `/etc/rc.d/rc.clamav stop; removepkg clamav`

## Caveats

Make sure that you haven’t got old libraries (_libclamav.so_) lying around your filesystem. You can verify it using:

```bash
ldd `which freshclam`
```

Also make sure there is really only one version of ClamAV installed on your system:

```bash
whereis freshclam

whereis clamscan
```
