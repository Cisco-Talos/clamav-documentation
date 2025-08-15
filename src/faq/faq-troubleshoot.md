# Troubleshooting FAQ

The following questions and answers may help you troubleshoot issues you may encounter when using ClamAV.

If you're unable to find an answer to your question in our FAQ, you can seek help in [our clamav-users mailing list](https://www.clamav.net/contact.html#ml), on our [Discord server](https://discord.gg/6vNAqWnVgw), or by submitting an [issue on GitHub](https://github.com/Cisco-Talos/clamav/issues). The mailing list archives and existing Github issues (open or closed) may also have an answer to your question.

Please consider contributing answered questions back to this FAQ, and improving the quality of these answers, by submitting pull requests to [our documentation source repository](https://github.com/Cisco-Talos/clamav-documentation).

## After ClamAV is installed, then what? How do I update / refresh the virus database?

You will need to edit the `freshclam.conf.example` file located in `/usr/local/etc`. Once that is done, you will need to run a `sudo freshclam` to download the signatures. You will need to run the command to update signatures often so that ClamAV has the most up to date signatures.

## How many times per hour shall I run FreshClam?

You can check for database update as often as 4 times per hour provided that you have the following options in `freshclam.conf`:

```ini
DNSDatabaseInfo current.cvd.clamav.net

DatabaseMirror database.clamav.net
```

## I get this error when running FreshClam: _Invalid DNS reply. Falling back to HTTP mode_ or _ERROR: Can't query current.cvd.clamav.net_ . What does it mean?

There is a problem with your DNS server. Please check the entries in /etc/resolv.conf and verify that you can resolve the TXT record manually:

```bash
host -t txt current.cvd.clamav.net
```

If you can't, it means your network is broken. You'll be still able to download the updates, but you'll waste a lot of bandwidth checking for updates.

## What does _WARNING: DNS record is older than 3 hours_ mean?

FreshClam attempts to detect potential problems with DNS caches and switches to use HTTPS if something looks suspicious. If this message appears seldomly, you can safely ignore it. If you get the error every time you run FreshClam, check your system clock. If it is set correctly, check your dns settings. If those didn't help, try putting this at the top of your cronjob:

```bash
host -t txt current.cvd.clamav.net; perl -e 'printf "%d\n", time;'
```

The 4th field of the first line should be less than 3 &lowast; 3600 behind the output of the second line. If not, you have a caching DNS server somewhere  misbehaving.

## I get this error when running FreshClam: _ERROR: Connection with ??? failed_ . What shall I do?

Either your dns servers are not working or you are blocking port 53/tcp. You should manually check that you can resolve host names with:

```bash
host database.clamav.net
```

If it doesn't work, check your dns settings in `/etc/resolv.conf`. If it works, check that you can receive dns answers longer than 512 bytes, e.g. check that your firewall is not blocking packets which originate from `port 53/tcp`.

An easy way to find it out is:

```bash
dig @ns1.clamav.net db.us.big.clamav.net
```

## How do I know if my IP address has been blocked?

Run FreshClam in verbose-mode (`-v`) to view the HTTP requests and responses. If you're seeing an HTTP 403 response, then you may have been blocked. If think you've been blocked, feel free to contact us for help getting un-blocked. For more information about HTTP error codes, see the [FreshClam FAQ](faq-freshclam.md)

## I can't resolve `current.cvd.clamav.net`! Is there a problem with your/my DNS servers?

current.cvd.clamav.net has got only a TXT record, not a type A record! Try this command:

```bash
$ host -t txt current.cvd.clamav.net
```

Please note that some not RFC compliant DNS servers (namely the one shipped with the *Alcatel* (now *Thomson*) **SpeedTouch 510 modem**) can't resolve `TXT` record. If that's the case, please recompile ClamAV with the flag `--enable-dns-fix` if using `./configure` or `-D ENABLE_FRESHCLAM_DNS_FIX=ON` if using CMake.

----

For other questions regarding issues with the signature databases, see our [Virus Database FAQ](faq-cvd.md).

## ClamAV becomes unresponsive

ClamAV requires a lot of memory in order to function properly. It is particularly common in environments like Docker / Kubernetes for a container to lack the required memory needed for the `clamd` process to reload the databases after the daily signature update. This may cause the process to crash or become unresponsive. You can find [more information here](../manual/Installing/Docker.md#memory-ram-requirements).

## ClamAV stops responding after about 24 hours

ClamAV requires a lot of memory in order to function properly. It is particularly common in environments like Docker / Kubernetes for a container to lack the required memory needed for the `clamd` process to reload the databases after the daily signature update. This may cause the process to crash or become unresponsive. You can find [more information here](../manual/Installing/Docker.md#memory-ram-requirements).

## ClamAV crashes once each day

ClamAV requires a lot of memory in order to function properly. It is particularly common in environments like Docker / Kubernetes for a container to lack the required memory needed for the `clamd` process to reload the databases after the daily signature update. This may cause the process to crash or become unresponsive. You can find [more information here](../manual/Installing/Docker.md#memory-ram-requirements).

## ClamAV build fails on RedHat Enterprise Linux (RHEL) 8, or AlmaLinux 8

ClamAV version 1.5.0 and newer may fail to compile on RHEL 8 or AlmaLinux 8 with this error:
```
../libclamav/libclamav.so.12.1.0: undefined reference to `json_object_new_uint64'
collect2: error: ld returned 1 exit status
make[2]: *** [clamconf/CMakeFiles/clamconf.dir/build.make:110: clamconf/clamconf] Error 1
make[1]: *** [CMakeFiles/Makefile2:1891: clamconf/CMakeFiles/clamconf.dir/all] Error 2
make: *** [Makefile:166: all] Error 2
```

This is a compatibility issue with ClamAV 1.5.0 and the older version of `libjson-c` provided by RedHat 8. It won't be fixed because the ClamAV development team only supports [the last two major versions](../Introduction.md#supported-platforms) for popular operating systems.

You can work around this issue by:
1. Compiling a newer version of libjson-c yourself.
2. Using the ClamAV project provided RPM to install ClamAV.
3. Upgrading to a newer version of RHEL or AlmaLinux.
