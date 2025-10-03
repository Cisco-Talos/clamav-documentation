# Configuration

Table Of Contents

- [Configuration](#configuration)
  - [First Time Set-Up](#first-time-set-up)
    - [Unix](#unix)
    - [Windows](#windows)
      - [Additional notes about the config files and database directories](#additional-notes-about-the-config-files-and-database-directories)
  - [freshclam.conf](#freshclamconf)
    - [Other freshclam.conf settings](#other-freshclamconf-settings)
  - [clamd.conf](#clamdconf)
    - [Other clamd.conf settings](#other-clamdconf-settings)
    - [On-Access Scanning](#on-access-scanning)
  - [clamav-milter.conf](#clamav-milterconf)
    - [Users and on user privileges](#users-and-on-user-privileges)
  - [Configure SELinux for ClamAV](#configure-selinux-for-clamav)
  - [ClamConf](#clamconf)
  - [Next Steps](#next-steps)

## First Time Set-Up

Depending on your install method and your operating system, some configuration options may have been pre-configured. For example a clamav install on Ubuntu with `apt install` will place configs in `/etc/clamav`.

However, it is likely that you will need to create new config files or modify the existing ones with custom settings that make the most sense for your use case. A from-source install will require you to create a `freshclam.conf` before you can use FreshClam, a `clamd.conf` before you can use ClamD, and a `clamav-milter.conf` before you can use ClamAV-Milter.

A default install from source will place the example configs in `/usr/local/etc/` on Unix/Linux systems and in the install directory under `conf_examples` on Windows. These examples demonstrate each of the options and may help you decide how to configure ClamAV to suit your needs. But again the location of these examples may vary depending on how you installed ClamAV. To continue with the Ubuntu example, you may find the FreshClam config from an `apt install` in `/usr/share/doc/clamav-freshclam/examples/`. So if you're unsure where the example configs are on your system, you may wish to use [ClamConf](#clamconf) to generate them.

Here are some quick steps to get you started.

### Unix

Run these to generate example configs, if needed:

```bash
clamconf -g freshclam.conf > freshclam.conf
clamconf -g clamd.conf > clamd.conf
clamconf -g clamav-milter.conf > clamav-milter.conf
```

Or if you have the examples already, copy them to drop the `.example` extension:

```bash
cp freshclam.conf.example freshclam.conf
cp clamd.conf.example clamd.conf
cp clamav-milter.conf.example clamav-milter.conf
```

Next up, edit the configs you need. There are tips below for each of [freshclam.conf](#freshclamconf), [clamd.conf](#clamdconf), and [clamav-milter](#clamav-milterconf).

### Windows

In a PowerShell terminal in the install directory, perform the following tasks:

Run:
```ps1
copy .\conf_examples\freshclam.conf.sample .\freshclam.conf
copy .\conf_examples\clamd.conf.sample .\clamd.conf
```

Run:
```ps1
write.exe .\freshclam.conf
```

WordPad will pop up. Delete the line that says "Example". You may also wish to set additional options to enable features or alter default behavior, such as the receive-timeout. Save the file and close WordPad.

Run:
```ps1
write.exe .\clamd.conf
```

WordPad will pop up. Delete the line that says "Example". You may also wish to set additional options to enable features or alter default behavior, such as enabling logging. Save the file and close WordPad.

#### Additional notes about the config files and database directories

The install directory is but one of a few locations ClamAV may search for configs and for signature databases.

Config files path search order:

1. The content of the registry key:
   "HKEY_LOCAL_MACHINE/Software/ClamAV/ConfDir"
2. The directory where libclamav.dll is located:
   "C:\Program Files\ClamAV"
3. "C:\ClamAV"

Database files path search order:

1. The content of the registry key:
  "HKEY_LOCAL_MACHINE/Software/ClamAV/DataDir"
2. The directory "database" inside the directory where libclamav.dll is located:
  "C:\Program Files\ClamAV\database"
3. "C:\ClamAV\db"

## freshclam.conf

`freshclam` is the automatic database update tool for Clam AntiVirus. It can be configured to work in two modes:

- interactive - on demand from command line
- daemon - silently in the background

`freshclam` is an advanced tool: it supports scripted updates (instead of transferring the whole CVD file at each update it only transfers the differences between the latest and the current database via a special script), database version checks through DNS, proxy servers (with authentication), digital signatures and various error scenarios.

**Quick test: run freshclam (as superuser) with no parameters and check the output.**

```bash
freshclam
```

> _Tip_: Depending on how you installed Freshclam and depending on which version of ClamAV you're running, you may encounter errors the first time you run Freshclam. See [the Freshclam section of our FAQ](../../faq/faq-freshclam.md) for help!

If everything is OK you may create the log file in /var/log (ensure the directory is owned either by *clamav* or whichever user `freshclam` will be running as):

```bash
touch /var/log/freshclam.log
chmod 600 /var/log/freshclam.log
chown clamav /var/log/freshclam.log
```

>  _Tip_: If SELinux is enabled you probably need to set the right SELinux context on this newly created file, otherwise freshclam service won't be able to access this file. On Redhat-like systems, you should do `restorecon /var/log/freshclam.log`.

Now you *should* edit the configuration file `freshclam.conf` and point the *UpdateLogFile* directive to the log file. Finally, to run `freshclam` in the daemon mode, execute:

```bash
freshclam -d
```

The other way is to use the *cron* daemon. You have to add the following line to the *crontab* of **root** or **clamav** user:

```
N * * * *   /usr/local/bin/freshclam --quiet
```

to check for a new database every hour. **N should be a number between 3 and 57 of your choice. Please don’t choose any multiple of 10, because there are already too many clients using those time slots.** Proxy settings are only configurable via the configuration file and `freshclam` will require strict permission settings for the config file when `HTTPProxyPassword` is turned on.

```ini
HTTPProxyServer myproxyserver.com
HTTPProxyPort 1234
HTTPProxyUsername myusername
HTTPProxyPassword mypass
```

### Other freshclam.conf settings

If your `freshclam.conf` was derived from the `freshclam.conf.sample`, you should find many other options that are simply commented out. If not, seek out the `freshclam.conf.sample` file, or on Linux/Unix systems run `man freshclam.conf`.

Take the time to look through the options. You can enable the sample options by deleting the `#` comment characters.

Some popular options to enable include:

* `LogTime`
* `LogRotate`
* `NotifyClamd`
* `DatabaseOwner`

## clamd.conf

Currently, ClamAV requires users to edit their `clamd.conf.example` file before they can run the daemon. At a bare minimum, users will need to comment out the line that reads "Example", else `clamd` will consider the configuration invalid, ala:

```ini
# Comment or remove the line below.
#Example
```

You will also need to rename `clamd.conf.example` to `clamd.conf` via:

```bash
mv ./clamd.conf.example ./clamd.conf
```

If you are setting up a simple, local [`clamd` instance](Scanning.md#clamd) then some other configuration options of interests to you will be as follows:

```ini
# Path to a local socket file the daemon will listen on.
# Default: disabled (must be specified by a user)
LocalSocket /tmp/clamd.socket

...

# Sets the permissions on the unix socket to the specified mode.
# Default: disabled (socket is world accessible)
LocalSocketMode 660
```

Beyond that, `clamd.conf` is well commented and configuration should be straightforward.

If needed, you can find out even more about the formatting and options available in `clamd.conf` with the command:

```bash
man clamd.conf
```

### Other clamd.conf settings

If your `clamd.conf` was derived from the `clamd.conf.sample`, you should find many other options that are simply commented out. If not, seek out the `clamd.conf.sample` file, or on Linux/Unix systems run `man clamd.conf`.

Take the time to look through the options. You can enable the sample options by deleting the `#` comment characters.

Some popular options to enable include:

* `LogTime`
* `LogClean`
* `LogRotate`
* `User`
* `ScanOnAccess`
  * `OnAccessIncludePath`
  * `OnAccessExcludePath`
  * `OnAccessPrevention`

### On-Access Scanning

You can configure On-Access Scanning through `clamd.conf`. Configuration for On-Access Scanning starts in the second half of `clamd.conf.sample` starting with "On-access Scan Settings". All options are grouped acording to use and roughly ordered by importance in those groupings. Please carefully read the explanation of each option to see if it might be of use to you.

Also read the [on-access](../OnAccess.md) section of the Usage manual for further details on using On-Access Scanning.

## clamav-milter.conf

ClamAV includes a mail filtering tool called `clamav-milter`. This tool interfaces directly with `clamd`, and thus requires a working [`clamd` instance](Scanning.md#clamd) to run. However, `clamav-milter`'s configuration and log files are separate from that of `clamd`.

Ensuring ClamAV compiles with `clamav-milter` must be done at configure time with the command:

```bash
cmake [options] -D ENABLE_MILTER=ON
```

This requires having the milter library installed on your system. If *libmilter* is not installed, the build will fail.

While not necessarily *complicated*, setting up the `clamav-milter` is an involved process. Thus, we recommend consulting your MTA’s manual on how to best connect ClamAV with the `clamav-milter`.

### Users and on user privileges

If you are running `freshclam` and `clamd` as root or with `sudo`, and you did not explicitly configure with `--disable-clamav`, you will want to ensure that the `DatabaseOwner` user specified in `freshclam.conf` owns the database directory so it can download signature updates.

The user that `clamd`, `clamdscan`, and `clamscan` run as may be the same user, but if it isn't -- it merely needs _read_ access to the database directory.

If you choose to use the default `clamav` user to run `freshclam` and `clamd`, you'll need to create the clamav group and the clamav user account the first time you install ClamAV.

```bash
groupadd clamav
useradd -g clamav -s /bin/false -c "Clam Antivirus" clamav
```

Finally, you will want to set user ownership of the database directory. For example:
```bash
sudo chown -R clamav:clamav /usr/local/share/clamav
```

## Configure SELinux for ClamAV

Certain distributions (notably RedHat variants) when operating with SELinux enabled use the non-standard `antivirus_can_scan_system` SELinux option instead of `clamd_can_scan_system`.

At this time, libclamav only sets the `clamd_can_scan_system` option, so you may need to manually enable `antivirus_can_scan_system`. If you don't perform this step, `freshclam` will log something like this when it tests the newly downloaded signature databases:

```bash
During database load : LibClamAV Warning: RWX mapping denied: Can't allocate RWX Memory: Permission denied
```

To allow ClamAV to operate under SELinux, run the following:
```bash
setsebool -P antivirus_can_scan_system 1
```

## ClamConf

`clamconf` is a tool ClamAV provides for checking your entire system configuration, as it relates to your ClamAV installation. When run, it displays values used when configuring ClamAV at compilation time, important OS details, the contents (and validity) of both `clamd.conf` and `freshclam.conf`, along with other important engine, database, platform, and build information.

It can also generate example configuration files for [`clamd.conf`](#clamdconf) and [`freshclam.conf`](#freshclamconf).

To use `clamconf`, and see all the information it provides, simply run the following command:

```bash
clamconf
```

For more detailed information on `clamconf`, run:

```bash
clamconf --help
```

or on Unix systems:

```bash
man clamconf
```

## Next Steps

Now that you have the config file basics, it's time to [learn about signature databases and how to keep yours up-to-date](SignatureManagement.md).
