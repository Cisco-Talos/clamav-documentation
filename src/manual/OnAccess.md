# On-Access Scanning

## Purpose

This guide is for users interested in leveraging and understanding ClamAV's On-Access Scanning feature. It will walk through how to set up and use the On-Access Scanner and step through some common issues and their solutions.

## Requirements

On-Access is only available on Linux systems. On Linux, On-Access requires a `kernel version >= 3.8`. This is because it leverages a kernel api called [fanotify](http://man7.org/linux/man-pages/man7/fanotify.7.html) to block processes from attempting to access malicious files. This prevention occurs in kernel-space, and thus offers stronger protection than a purely user-space solution.

#### For Versions >= 0.102.0

It also requires `Curl version >= 7.45 ` to ensure support for all curl options used by clamonacc. Users on Linux operating systems that package older versions of libcurl have a number of options:

  1. Wait for your package maintainer to provide a newer version of libcurl.
  2. Install a newer version of libcurl [from source](https://curl.haxx.se/download.html).
  3. Disable installation of `clamonacc` and On-Access Scanning capabilities with the `./configure` flag `--disable-clamonacc`.

## General Use

To use ClamAV's On-Access Scanner, operation will vary depending on version.


#### For Versions >= 0.102.0

You will need to run the `clamd` and `clamonacc` applications side by side. First, you will need to configure and run `clamd`. For instructions on how to do that, see [the clamd configuration guide](Usage/Configuration.md#clamdconf). One important thing to note while configuring `clamd.conf` is that--like `clamdscan`--the `clamonacc` application will connect to `clamd` using the `clamd.conf` settings for either `LocalSocket` or `TCPAddr`/`TCPSocket`. Another important thing to note, is that when using a `clamd.conf` that specifies a `LocalSocket`, then `clamd` will need to be run under a user with the right permissions to scan the files you plan on including in your watch-path.


Next, you will need to configure `clamonacc`. For a very simple configuration, follow these steps:

    1. Open `clamd.conf` for editing
    2. Specify the path(s) you would like to recursively watch by setting the `OnAccessIncludePath` option
    3. Set `OnAccessPrevention` to `yes`
    4. Check what username `clamd` is running under
    5. Set `OnAccessExcludeUname` to `clamd`'s uname
    6. Save your work and close `clamd.conf`

For slightly more nuanced configurations, which may be adapted to your use case better, please check out the [recipe guide below](manual/OnAccess.md#configuration-and-recipes).

Then, run `clamonacc` with elevated permissions

> `$ sudo clamonacc`

If all went well, the On-Access scanner will fork to the background, and will now be actively protecting the path(s) specified with `OnAccessIncludePath`. You can test this by dropping an eicar file into the specified path, and attempting to read/access it (e.g. `cat eicar.txt`). This will result in an "Operation not permitted" message, triggered by fanotify blocking the access attempt at the kernel level.

Finally, while you will have to restart both `clamd` and `clamonacc`. If default `clamonacc` performance is not to your liking, and your system has the resources available, we reccomend increasing the values for the following `clamd.conf` configuration options to increase performance:

- `MaxQueue`
- `MaxThreads`
- `OnAccessMaxThreads`


#### For Versions <= 0.101.x

You will only need to run the `clamd` application in older versions. First,
we reccomend you configure `clamd` for your environment. For instructions on how
to do that, see [the clamd configuration guide](Usage/Configuration.md#clamdconf).

Next, you will need to configure On Access Scanning using the `clamd.conf` file. For a very simple configuration follow these steps:

    1. Open `clamd.conf` for editing
    2. Set the `ScanOnAccess` option to `yes`
    3. Specify the path(s) you would like to recursively watch by setting the `OnAccessIncludePath` option
    4. Set `OnAccessPrevention` to `yes`
    6. Save your work and close `clamd.conf`

For slightly more nuanced configurations, which may be adapted to your use case better, please check out the [recipe guide below](manual/OnAccess.md#configuration-and-recipes).

Then, run `clamd` with elevated permissions

> `$ sudo clamd`

If all went well, the On-Access scanner will fork to the background, and will now be actively protecting the path(s) specified with `OnAccessIncludePath`. You can test this by dropping an eicar file into the specified path, and attempting to read/access it (e.g. `cat eicar.txt`). This will result in an "Operation not permitted" message, triggered by fanotify blocking the access attempt at the kernel level.

## Troubleshooting

Some OS distributors have disabled fanotify, despite kernel support. You can check for fanotify support on your kernel by running the command:

> `$ cat /boot/config-<kernel_version> | grep FANOTIFY`

You should see the following:

```bash
    CONFIG_FANOTIFY=y
    CONFIG_FANOTIFY_ACCESS_PERMISSIONS=y
```

If you see:

```bash
    # CONFIG_FANOTIFY_ACCESS_PERMISSIONS is not set
```

Then ClamAV's On-Access Scanner will still function, scanning and alerting on files normally in real time. However, it will be unable to block access attempts on malicious files. We call this `notify-only` mode.

ClamAV's On-Access Scanning system uses a scheme called Dynamic Directory Determination (DDD for short) which is a shorthand way of saying that it tracks the layout of every directory specified with `OnAccessIncludePath` dynamically, and recursively, in real time. It does this by leveraging [inotify](http://man7.org/linux/man-pages/man7/inotify.7.html) which by default has a limited number of watchpoints available for use by a process at any given time. Given the complexity of some directory hierarchies, ClamAV may warn you that it has exhausted its supply of inotify watchpoints (8192 by default). To increase the number of inotify watchpoints available for use by ClamAV (to 524288), run the following command:

> `$ echo 524288 | sudo tee -a /proc/sys/fs/inotify/max_user_watches`

The `OnAccessIncludePath` option will not accept `/` as a valid path. This is because fanotify works by blocking a process' access to a file until a access_ok or access_denied determination has been made by the original fanotify calling process. Thus, by placing fanotify watchpoints on the entire filesystem, key system files may have their access blocked to key processes at the kernel level, which will result in a system lockup.

This restriction was made to prevent users from "shooting themselves in the foot." However, clever users will find it's possible to circumvent this restriction by using multiple `OnAccessIncludePath` options to recursively protect most of the filesystem anyways, or better still, simply the paths they truly care about.

The `OnAccessMountPath` option uses a different fanotify api configuration which makes it incompatible with `OnAccessIncludePath` and the DDD System. Therefore, inotify watchpoint limitations will not be a concern when using this option. Unfortunately, this also means that the following options cannot be used in conjunction with `OnAccessMountPath`:

- `OnAccessExtraScanning` - is built around catching inotify events.
- `OnAccessExcludePath` - is built upon the DDD System.
- `OnAccessPrevention` - would lock up the system if `/` was selected for `OnAccessMountPath`. If you need `OnAccessPrevention`, you should use `OnAccessIncludePath` instead of `OnAccessMountPath`.

## Configuration and Recipes

More nuanced behavior can be coerced from ClamAV's On-Access Scanner via careful modification to `clamd.conf`. Each option related to On-Access Scanning is easily identified by looking for the `OnAccess` prefix pre-pended to each option. The default `clamd.conf` file contains descriptions of each option, along with any documented limitations or safety features.

Below are examples of common use cases, recipes for the correct minimal configuration, and the expected behavioral result.

### Use Case 0x0

- User needs to watch the entire file system, but blocking malicious access attempts isn't a concern
```bash
    ScanOnAccess yes ## versions <= 0.101.x
    OnAccessMountPath /
    OnAccessExcludeRootUID yes
    OnAccessExcludeUname clamav ## versions >= 0.102
```

This configuration will put the On-Access Scanner into `notify-only` mode. It will also ensure only non-root, non-clam, user processes will trigger scans against the filesystem.

### Use Case 0x1

- System Administrator needs to watch the home directory of multiple Users, but not all users. Blocking access attempts is un-needed.
```bash
    ScanOnAccess yes ## versions <= 0.101.x
    OnAccessIncludePath /home
    OnAccessExcludePath /home/user2
    OnAccessExcludePath /home/user4
    OnAccessExcludeUname clamav ## versions >= 0.102
```

With this configuration, the On-Access Scanner will watch the entirety of the `/home` directory recursively in `notify-only` mode. However, it will recursively exclude the `/home/user2` and `/home/user4` directories.

### Use Case 0x2

- The user needs to protect a single directory non-recursively and ensure all access attempts on malicious files are blocked.
```bash
    ScanOnAccess yes ## versions <= 0.101.x
    OnAccessIncludePath /home/user/Downloads
    OnAccessExcludeUname clamav ## versions >= 0.102
    OnAccessPrevention yes
    OnAccessDisableDDD yes
```

The configuration above will result in non-recursive real-time protection of the `/home/user/Downloads` directory by ClamAV's On-Access Scanner. Any access attempts that ClamAV detects on malicious files within the top level of the directory hierarchy will be blocked by fanotify at the kernel level.

## Command Line Options for Versions >= 0.102

Beyond `clamd.conf` configuration, you can change the behaviour of the On-Access scanner by passing in a number of command line options. A list of all options can be retrieved with `--help`, but below is a list and explanation of some of options you might find most useful.

- `--log=FILE` `-l FILE` - passing this option is important if you want a record of scan results, otherwise `clamonacc` will operate silently.
- `--verbose` `-v` - primarily for debugging as this will increase the amount of noise in your log by quite a lot, but useful for troubleshooting potential connection problems
- `--foreground` `-F` - forces `clamonacc` to not for the background, which is useful for debugging potential issues with during startup or runtime
- `--include-list=FILE` `-e FILE` - allows users to pass a list of directories for clamonacc to watch, each directory must be a full path and seperated by a newline
- `--exclude-list=FILE` `-e FILE` - same as include-list option, but for excluding at startup
- `--remove` - after an infected verdict, an attempt will be made to remove the infected file
- `--move=DIRECTORY` - just like the remove option, but infected file will be moved to the specified quarantine location instead
- `--copy=DIRECTORY` - just like the move, except infected file is also left in place
