
# ClamAV

<p align="center">
  <a href="https://www.clamav.net/">
    <img align="center" width="250" height="250" src="https://raw.githubusercontent.com/micahsnyder/clamav-documentation/main/src/images/logo.png" alt='Maeve, the ClamAV mascot'>
  </a>
</p>

ClamAV is an open source (GPLv2) anti-virus toolkit, designed especially for e-mail scanning on mail gateways. It provides a number of utilities including a flexible and scalable multi-threaded daemon, a command line scanner and advanced tool for automatic database updates. The core of the package is an anti-virus engine available in a form of shared library.

> _Tip_: ClamAV is not a traditional anti-virus or endpoint security suite. For a fully featured modern endpoint security suite, check out *Cisco Secure Endpoint*. See ["related products"](#related-products), below, for more details.

ClamAV is brought to you by Cisco Systems, Inc.

## Community Projects

ClamAV has a diverse ecosystem of [community projects, products, and other tools](manual/Installing/Community-projects.md) that either depend on ClamAV to provide malware detection capabilities or supplement ClamAV with new features such as improved support for 3rd party signature databases, graphical user interfaces (GUI), and more.

## Features

- ClamAV is designed to scan files quickly.
- Real time protection (Linux only). The ClamOnAcc client for the ClamD scanning daemon provides on-access scanning on modern versions of Linux. This includes an optional capability to block file access until a file has been scanned (on-access prevention).
- ClamAV detects millions of viruses, worms, trojans, and other malware, including Microsoft Office macro viruses, mobile malware, and other threats.
- ClamAV's bytecode signature runtime, powered by either LLVM or our custom bytecode interpreter, allows the ClamAV signature writers to create and distribute very complex detection routines and remotely enhance the scanner’s functionality.
- Signed signature databases ensure that ClamAV will only execute trusted signature definitions.
- ClamAV scans within archives and compressed files but also protects against archive bombs. Built-in archive extraction capabilities include:
  - Zip (including SFX, excluding some newer or more complex extensions)
  - RAR (including SFX, most versions)
  - 7Zip
  - ARJ (including SFX)
  - Tar
  - CPIO
  - Gzip
  - Bzip2
  - DMG
  - IMG
  - ISO 9660
  - PKG
  - HFS+ partition
  - HFSX partition
  - APM disk image
  - GPT disk image
  - MBR disk image
  - XAR
  - XZ
  - Microsoft OLE2 (Office documments)
  - Microsoft OOXML (Office documments)
  - Microsoft Cabinet Files (including SFX)
  - Microsoft CHM (Compiled HTML)
  - Microsoft SZDD compression format
  - HWP (Hangul Word Processor documents)
  - BinHex
  - SIS (SymbianOS packages)
  - AutoIt
  - InstallShield
  - ESTsoft EGG
- Supports Windows executable file parsing, also known as Portable Executables (PE) both 32/64-bit, including PE files that are compressed or obfuscated with:
  - AsPack
  - UPX
  - FSG
  - Petite
  - PeSpin
  - NsPack
  - wwpack32
  - MEW
  - Upack
  - Y0da Cryptor
- Supports ELF and Mach-O files (both 32 and 64-bit)
- Supports almost all mail file formats
- Support for other special files/formats includes:
  - HTML
  - RTF
  - PDF
  - Files encrypted with CryptFF and ScrEnc
  - uuencode
  - TNEF (winmail.dat)
- Advanced database updater with support for scripted updates, digital signatures and DNS based database version queries

> _Disclaimer_: Many of the above file formats continue to evolve. Executable packing and obfuscation tools in particular are constantly changing. We cannot guarantee that we can unpack or extract every version or variant of the listed formats.

## License

ClamAV is licensed under the GNU General Public License, Version 2.

## Supported platforms

Clam AntiVirus is highly cross-platform. The development team cannot test every OS, so we have chosen to test ClamAV using the two most recent Long Term Support (LTS) versions of each of the most popular desktop operating systems. Our regularly tested operating systems include:

- GNU/Linux
  - Alpine
    - 3.21 (x86_64, arm64)
  - Ubuntu
    - 24.04 (x86_64, arm64)
    - 22.04 (x86_64, arm64)
  - Debian
    - 12 (x86_64, arm64)
    - 11 (x86_64, arm64)
  - AlmaLinux
    - 8.10 (x86_64, arm64)
  - Fedora
    - 41 (x86_64, arm64)
    - 40 (x86_64, arm64)
  - openSUSE
    - 15 Leap (x86_64, arm64)
- UNIX
  - FreeBSD
    - 14 (x86_64)
    - 13 (x86_64)
  - macOS
    - 15.3 Sequoia (x86_64, arm64)
    - 14.7 Sonoma (x86_64, arm64)
    - 13.7 Ventura (x86_64, arm64)
- Windows
  - 11 (x86_64, arm64)
  - 10 (x86_64, arm64)

> _Disclaimer_: Platforms and operating systems other than the ones above are not as well tested by the ClamAV development team. In particular, uncommon operating systems such as HP-UX and Solaris, and uncommon processor architectures such as sparc64, armhf, pp64le, etc. are not supported.
>
> You are welcome to report bugs and contribute bug fixes for unsupported platforms. We may be unable to verify that a platform-specific bug-fix is resolves an issue. But provided that a contributed fix appears technically sound, and does not cause other issues, we will be happy to merge it.

## Recommended System Requirements

The following minimum recommended system requirements are for using ClamScan or ClamD applications with the standard ClamAV signature database provided by Cisco.

Minimum recommended RAM for ClamAV:

- FreeBSD and Linux server edition: 3 GiB+
- Linux non-server edition: 3 GiB+
- Windows 10 & 11: 3 GiB+
- macOS: 3 GiB+

> _Tip_: Server environments, like Docker, as well as and embedded runtime environments are often resource constrained. We recommend at 3-4 GiB of RAM, but you may get by with less if you're willing to accept some limitations. You can find [more information here](manual/Installing/Docker.md#memory-ram-requirements).

Minimum recommended CPU for ClamAV:

- 1 CPU at 2.0 Ghz+

Minimum available hard disk space required:

For the ClamAV application we recommend having 5 GiB of free space available. This recommendation is in addition to the recommended disk space for each OS.

> _Note_: The tests to determine these minimum requirements were performed on systems that were not running other applications. If other applications are being run on the system, additional resources will be required in addition to our recommended minimums.

## Mailing Lists and Chat

### Mailing Lists

If you have a trouble installing or using ClamAV try asking on our mailing lists. There are four lists available:

- **clamav-announce (at) lists.clamav.net**
  - info about new versions, moderated.
  - Subscribers are not allowed to post to this mailing list.
- **clamav-users (at) lists.clamav.net**
  - user questions
- **clamav-devel (at) lists.clamav.net**
  - technical discussions
- **clamav-virusdb (at) lists.clamav.net**
  - database update announcements, moderated

You can subscribe and search the mailing list archives [here](https://www.clamav.net/contact.html#ml).

**To unsubscribe**: Use the same form page that you used when you subscribed. Search at the bottom for "unsubscribe".

*IMPORTANT*: When you subscribe or unsubscribe, you will receive a confirmation email with a link that you must click on or else no action will occur. If you did not receive the confirmation email, check your spam folder.

### Chat

You can join the community on our [ClamAV Discord chat server](https://discord.gg/6vNAqWnVgw).

## Submitting New or Otherwise Undetected Malware

If you've got a virus which is not detected by the current version of ClamAV using the latest signature databases, please submit the sample for review at our website:

<https://www.clamav.net/reports/malware>

Likewise, if you have a benign file that is flagging as a virus and you wish to report a False Positive, please submit the sample for review at our website:

<https://www.clamav.net/reports/fp>

If you have questions about the submission process, please read the [Malware and False Positive Report FAQ](faq/faq-malware-fp-reports.md)

How long does it take for a signature change after submitting new malware or submitting a false positive report?

> In most cases, it takes at least 48 hours from initial submission before any change will be published in the official ClamAV signature databases.

Who analyzes malware and false positive file uploads?

> Given the volume of submissions, the vast majority of files are handled by automation.

Who has access to the uploaded files?

> All engineers and analysts within Cisco's Talos organization have access to the files.

Are malware or false positive file uploads shared with other companies?

> No. Files that are submitted for review through the ClamAV Malware and False Positive web forms (or the clamsubmit tool), are not shared outside of Cisco. However, sample sharing is fair game if we've already received the same file from a different source (VirusTotal, Cisco SMA, various feeds, etc.).

Are the files deleted after the analysis?

> No. Uploaded files are kept indefinitely.

Is the file accessible using a public URL at any point in this process?

> No. Uploaded files are not accessible using a public URL. They are processed internally and kept internal to Cisco Talos.

## Related Products

[Cisco Secure Endpoint](https://www.cisco.com/c/en/us/products/security/amp-for-endpoints/index.html) (formerly AMP for Endpoints) is Cisco's cloud-based security suite for commercial and enterprise customers. Secure Endpoint is available for Windows, Linux, and macOS and provides superior malware detection capabilities, behavioral monitoring, dynamic file analysis, endpoint isolation, analytics, and threat hunting. Secure Endpoint sports a modern administrative web interface (dashboard).

<p align="center">
  <a href="https://www.cisco.com/">
    <img align="center" img width="80" src="https://raw.githubusercontent.com/micahsnyder/clamav-documentation/main/src/images/cisco.png" alt='Cisco Systems, Inc'>
  </a>
</p>
