# Community Projects

> _Disclaimer_: The software listed in this section is authored by third parties and not by the ClamAV Team. Compatibility may vary.

## Signatures

The ClamAV Team provides FreshClam for ClamAV agents to update the official signature databases and provides [CVD-Update](https://pypi.org/project/cvdupdate/) for [Private Mirror](../../appendix/CvdPrivateMirror.md) administrators to update their server content.

Both FreshClam and CVD-Update have some limited features to update signatures from third-party sources but community tools exist that are designed for this purpose and provide a more complete experience for users that want the extra coverage.

> **WARNING**: While there are no known vulnerabilities in using traditional content-based and hash-based ClamAV signatures, bytecode signatures are a _different story_. Bytecode signatures are effectively cross-platform executable plugins [similar to Web Assembly (WASM)](../Development/Contribute.md#webassembly-runtime) but with less sandboxing.
>
> ClamScan and ClamD will not run unsigned bytecode signatures by default. Cisco-Talos' signing certificate is the **only** certificate trusted by ClamAV to run bytecode signatures.
>
> Both ClamD and ClamScan have options to run unsigned bytecode signatures but you should **NEVER** enable unsigned bytecode signatures in production when using signatures from third-party sources or a malicious bytecode signature author could gain control of your systems.
>
> ClamBC is a tool installed with ClamAV for testing bytecode signatures and should also **NEVER** be used to run signatures from an unknown or untrusted source.

### Fangfrish

Fangfrisch (German for "freshly caught") is a sibling of the Clam Anti-Virus FreshClam utility. It allows downloading virus definition files that are not official ClamAV canon, e.g. from [Sanesecurity](https://sanesecurity.com/), [URLhaus](https://urlhaus.abuse.ch/) and others. Fangfrisch was designed with security in mind, to be run by an unprivileged user only.

[Detailed documentation](https://rseichter.github.io/fangfrisch/) is available online.

[Get fangfrish](https://pypi.org/project/fangfrisch/)

## Mail Filters

ClamAV is popular for filtering mail. The ClamAV Team maintains ClamAV-Milter, which is a filter for the Sendmail mail transfer agent and the ClamAV community have created a wide variety of other tools to use ClamAV with different mail transfer agents.

### Generic Mail Transfer Agents

#### amavisd-new | clamd, clamscan

amavisd-new is a high-performance interface between mailer (MTA) and content checkers: virus scanners, and/or SpamAssassin. It is written in Perl for maintainability, without paying a significant price for speed. It talks to MTA via (E)SMTP or LMTP, or by using helper programs. Best with Postfix, fine with dual-sendmail setup and Exim v4, works with sendmail/milter, or with any MTA as a SMTP relay. For Courier and qmail MTA integration there is a patch in the distributed package.

amavisd-new is a rewritten version of Amavis and is maintained by Mark Martinec.

ClamScan is enabled automatically if `clamscan` binary is found at amavisd-new startup time. ClamD is activated by uncommenting its entry in the `@av_scanners` list in the file `/etc/amavisd.conf`.

[Get amavisd-new](https://www.ijs.si/software/amavisd/)

### Sendmail

#### MIMEDefang | clamscan, clamd

MIMEDefang is an efficient mail scanner for Sendmail/milter written in C, Perl.

[Get MIMEDefang](https://mimedefang.org/)

### Postfix

#### ClamSMTP | clamd

ClamSMTP is an SMTP filter for Postfix and other mail servers that checks for viruses using the ClamAV anti-virus software. It aims to be lightweight, reliable, and simple rather than have a myriad of options. Written in C without major dependencies.

[Get ClamSMTP](http://thewalter.net/stef/software/clamsmtp/)

#### Clapf | libclamav

[Clapf](https://clapf.org/wiki/start) is a clamav based virus scanning and anti-spam content filter for Postfix.

[Get clapf](https://bitbucket.org/jsuto/clapf/src/master/)

### Exim

Starting with [release 4.50](https://www.exim.org/exim-html-current/doc/html/spec_html/ch-content_scanning_at_acl_time.html), [Exim](https://www.exim.org/) natively supports ClamAV.

[Get exim](https://www.exim.org/mirrors.html)

### Others

#### Mail Avenger | clamscan

[Mail Avenger](https://www.mailavenger.org/) is a highly-configurable SMTP server. It allows you to reject spam during mail transactions, before spooling messages in your local mail queue. You can specify site-wide default policies for filtering mail, but individual users can also craft their own policies by creating avenger scripts in their home directories.

[Get Mail Avenger](https://www.mailavenger.org/dist/)

#### MailScanner | clamscan

[MailScanner](https://www.mailscanner.info/) scans all e-mail for viruses, spam and attacks against security vulnerabilities. It is not tied to any particular virus scanner, but can be used with any combination of 14 different virus scanners, allowing sites to choose the best of breed virus scanner.

[Get Mail Scanner](https://github.com/MailScanner/v5)

#### Sagator | clamscan, clamd, libclamav

[Sagator](http://www.salstar.sk/sagator/) is an email antivirus/antispam gateway. Its modular architecture can use any combination of antivirus/spamchecker according to configuration.

[Get Sagator](http://www.salstar.sk/sagator/download)

#### Courier-MTA | libclamav, clamavd

[Courier MTA](http://www.courier-mta.org/) includes four filers.

courier-pythonfilter by Gordon Messner. Included in a Python filter suite, it uses pyClamAV (libclamav with python)

Courier::Filter::Module::ClamAVd by Julian Mehnle. A Perl module for use with Courier::Filter, using clamavd.

ClamCour by Tony Di Monaco. A C++ (with Boost) multithreaded filter using libclamav

avfilter by Alessandro Vesely. A C forking filter using libclamav.

[Get Courier-MTA](https://sourceforge.net/projects/courier/)

#### Haraka | clamd

Haraka is a robust MTA written in node.js, with a modular architecture that lets plugins control nearly every aspect of the SMTP conversation. There is a large selection of included plugins, including a clamav plugin (docs, source) that filters messages [using clamd](https://github.com/haraka/Haraka/blob/master/docs/plugins/clamd.md).

Haraka is attractive to two audiences:

1. Anyone managing mail systems with thousands or tens-of-thousands of concurrent incoming SMTP connections (like Craigslist) and wants to do with it fewer racks of servers.

2. Developers who need more control over mail routing, filtering, and processing than can be easily or efficiently handled with traditional (milter-based) MTAs.

[Get Haraka](https://github.com/haraka/Haraka)

### Web & FTP Tools

#### Clammit | clamd

Clammit is a proxy that will perform virus scans of files uploaded via http requests, including multipart/form-data. If a virus exists, it will reject the request out of hand. If no virus exists, the request is then forwarded to the application and it's response returned in the upstream direction.

As the name implies, Clammit offloads the virus detection to the ClamAV virus detection server (clamd).

[Get Clammit](https://github.com/ifad/clammit)

#### Clara

Serverless, real-time, ClamAV+Yara scanning for your S3 Buckets

[Get Clara](https://github.com/abhinavbom/clara)

#### bucket-antivirus-function

Scan new objects added to any s3 bucket using AWS Lambda.

[Get bucket-antivirus-function](https://github.com/upsidetravel/bucket-antivirus-function)

#### cdk-serverless-clamscan

An aws-cdk construct that uses ClamAV® to scan objects in Amazon S3 for viruses. The construct provides a flexible interface for a system to act based on the results of a ClamAV virus scan.

[Get cdk-serverless-clamscan](https://github.com/awslabs/cdk-serverless-clamscann)

#### Antivirus for Amazon S3

A CloudFormation template to create an EC2 scanner cluster for S3 buckets.

[Get Antivirus for Amazon S3](https://github.com/widdix/aws-s3-virusscan)

#### HAVP | libclamav

[HAVP](http://havp.org/) is a proxy with an antivirus filter. It does not cache or filter content. At the moment the complete traffic is scanned. A reason for that is the chance of malicious code in nearly every filetypes e.g. HTML (JavaScript) or Jpeg.

[Get HAVP](https://github.com/HaveSec/HAVP)

#### mod_clamav | libclamav, clamd

mod_clamav is an Apache virus scanning filter. It was written and is currently maintained by Andreas Müller. The project is very well documented and the installation is quite easy.

[Get mod_clamav](http://software.othello.ch/mod_clamav/)

#### phpMussel | clamav

[phpMussel](http://phpmussel.github.io/) is a PHP-based script based upon ClamAV signatures designed to detect trojans, viruses, malware and other threats within files uploaded to your system wherever the script is hooked. Written by Maikuolan

[Get phpMussel](https://github.com/phpMussel/phpMussel)

#### SpamAssassin - ClamAVPlugin | clamd

A ClamAV plug in fpr SpamAssassin 3.X

[Get ClamAVPlugin](https://cwiki.apache.org/confluence/display/SPAMASSASSIN/ClamAVPlugin)

#### clamav-rest

Simple ClamAV REST proxy. Builds on top of [clamav-java](#clamav-java) which is a minimal Java client for ClamAV.

[Get clamav-rest](https://github.com/solita/clamav-rest)

### Filesystem & On-Access Scanning

#### Clam Sentinel

Clam sentinel is a program that detects file system changes and automatically scans the files added or modified using ClamWin. Require the installation of ClamWin. For Microsoft Windows 98/98SE/Me/2000/XP/Vista, Windows 7 and Windows 8.1.

[Get Clam Sentinel](https://sourceforge.net/projects/clamsentinel/)

#### ClamFS | clamd

ClamFS is a FUSE-based user-space file system for Linux and BSD with on-access anti-virus file scanning through clamd daemon (a file scanning service developed by ClamAV Project).

Features:
- Scans files using ClamAV
- User-space file system (no kernel patches, modules, recompilations, etc.)
- Based on libFUSE version 3 (until version 1.1.0 on libFUSE v2)
- Implements all clamd scan modes: fname, fdpass and stream
- Supports remote clamd instances in stream mode over TCP/IP socket
- Caches scan results in a LRU cache with time-based and out-of-memory expiration
- Configuration stored in XML files
- Supports ulockmgr
- Sends mails to administrator when detects virus

[Get ClamFS](https://github.com/burghardt/clamfs)

#### Avfs | ClamAV

Avfs, a true on-access anti-virus file system that incrementally scans files and prevents infected data from being committed to disk. Avfs is a stackable file system and therefore can add virus detection to any other file system: Ext3, NFS, etc. Avfs supports forensic modes that can prevent a virus from reaching the disk or automatically create versions of potentially infected files to allow safe recovery. Avfs can also quarantine infected files on disk and isolate them from user processes.

Avfs uses a matching algorithm that is derived from ClamAV but with changes to optimize scan time for larger signature sets. Though this project does not appear to be maintained or used elsewhere, the research was really good work and may inspire optimizations in ClamAV in the future.

[More about Avfs](https://www.fsl.cs.sunysb.edu/docs/avfs-security04/index.html)

### Mail User Agents

#### Claws Mail

Claws Mail is a user-friendly, lightweight, and fast email client. Claws Mail has a ClamD plugin for scanning received messages using ClamAV.

[Get Claws Mail](https://www.claws-mail.org/index.php)

#### Kmail | clamscan

Mail is a fully-featured email client that fits nicely into the K Desktop Environment, KDE. It supports [attachment scanning with clamscan](https://docs.kde.org/stable5/en/kmail/kmail2/the-anti-virus-wizard.html).

[Get Kmail](https://apps.kde.org/kmail2/)

#### Open Webmail modules | clamscan

Open WebMail by default can use ClamAV as the external viruscheck module to scan messages fetched from pop3 servers or all incoming messages. If a message or its attachments is found to have virus, Open WebMail will move the message from INBOX to the VIRUS folder automatically.

[Get Open Webmail](https://openwebmail.org/)

## ClamAV Bindings

### Rust

#### clamav-rs | libclamav

A safe Rust binding for libclamav. `clamav-rs` uses [`clamav-sys`](https://github.com/zaddach/clamav-sys/) to wrap the libclamav C API.

[Get clamav-rs](https://github.com/zaddach/clamav-rs/)

#### clamav-sys | libclamav

clamav-sys is a minimal Rust interface around libclamav. This package is not supposed to be used stand-alone, but only through its safe wrapper, clamav-rs.

[Get clamav-sys](https://github.com/zaddach/clamav-sys/)

#### rust-clamav | libclamav

Like `clamav-rs`. rust-clamav is a safe library for interacting with libclamav from Rust. The low-level C API is wrapped in idomatic and safe Rust code.

[Get rust-clamav](https://github.com/icebergdefender/rust-clamav)

#### clamav-tcp | clamd

A simple to use TCP client for scanning files with ClamAV. This is not exactly a binding. It is a Rust crate for interacting with ClamD.

Get [clamav-tcp](https://crates.io/crates/clamav-tcp)

### Perl

#### File::Scan::ClamAV | clamd

A Perl module for interacting with ClamD. File::Scan::ClamAV will connect to a local Clam Anti-Virus clamd service and send commands.

[Get File::Scan::ClamAV](https://metacpan.org/pod/release/CFABER/File-Scan-ClamAV-1.8/lib/File/Scan/ClamAV.pm)

### Ruby

#### Clamby | clamscan + freshclam

Ruby binding for scanning file uploads using ClamScan. If you have a file upload on your site and you do not scan the files for viruses then you not only compromise your software, but also the users of the software and their files. This gem's function is to simply scan a given file.

[Get Clamby](https://github.com/kobaltz/clamby)

#### ClamAV::Client | clamd

ClamAV::Client is a client library that can talk to the clam daemon.

[Get ClamAV::Client](https://github.com/franckverrot/clamav-client)

### PHP

#### PHP ClamAV | clamd

PHP Client to connect to ClamAV daemon over TCP or using a local socket from command line and scan your storage files for viruses.

[Get PHP ClamAV](https://github.com/appwrite/php-clamav)

#### PHP ClamAV Scan | clamd

A simple PHP class for scanning files using a LOCAL ClamAV/clamd install either via a socket file or network socket (windows). Can either be used on its own or dropped into a Codeigniter app as a library. The main reason this was created was because the legacy php-clamav module is not compatible with PHP 7 and all other options I found were either not drop in compatible with CodeIgniter or were designed for use with Composer.

[Get PHP ClamAV](https://github.com/kissit/php-clamav-scan)

### Python

#### clamd | clamd

clamd is a portable Python module to use the ClamAV anti-virus engine on Windows, Linux, MacOSX and other platforms. It requires a running instance of the clamd daemon.

This is a fork of pyClamd v0.2.0 created by Philippe Lagadec and published on his website: http://www.decalage.info/en/python/pyclamd which in turn is a slightly improved version of pyClamd v0.1.1 created by Alexandre Norman and published on his website: http://xael.org/norman/python/pyclamd/

[Get clamd](https://github.com/graingert/python-clamd)

#### Python ClamAV | libclamav

Python wrapper for libclamav using `ctypes`. Python ClamAV is a part of the ClamWin project.

[Get Python ClamAV](https://github.com/clamwin/python-clamav)

#### pyClamd | clamd

Add virus detection capabilities to your python software in an efficient and easy way.

[Get pyClamd](http://www.decalage.info/en/python/pyclamd)

### Java

#### clamav-java

Simple ClamAV Java client. See also [ClamAV REST service](#clamav-rest) which builds on top of this.

[Get clamav-java](https://github.com/solita/clamav-java)

### Go

#### go-clamav | clamd

go-clamav is a library and toolset written in Go, designed to integrate seamlessly with ClamAV antivirus software. It provides a concise and easy-to-use REST API for calling ClamAV scans, getting statistics, version information, and more. At the same time, go-clamav also includes a command line tool clamd-ctl for communicating with the Clamd daemon and performing various operations.

[Get go-clamav](https://github.com/hq0101/go-clamav)

#### clamd_exporter | clamd

Export metrics from clamd service for use by Prometheus. This uses `go-clamav` (above).

[Get clamd_exporter](https://github.com/hq0101/clamd_exporter)

#### clamav_exporter | clamd

Export metrics from clamd service for use by Prometheus. This provides a similar function but is not related to `clamd_exporter`.

[Get clamav_exporter](https://github.com/sergeymakinen/clamav_exporter)

## Miscellaneous Tools

### IPCop | ClamAV

IPCop Linux is a complete Linux Distribution whose sole purpose is to protect the networks it is installed on. ClamAV is included.

[Get IPCop](https://www.ipcop.org/)

### Endian Firewall | ClamAV

Endian Firewall Community (EFW) is a turn-key Linux security distribution that can transform any bare-metal appliance into a full-featured Unified Threat Management solution. Endian is designed to be the easiest security product to install, configure and use!

[Get Endian Firewall](https://www.endian.com/community/features/)

### ClamTK | ClamAV

ClamTk is a GUI front-end for ClamAV using gtk2-perl. It is designed to be an easy-to-use, on-demand scanner for Linux systems. ClamTk has been ported to Fedora, Debian, RedHat, openSUSE, ALT Linux, Ubuntu, CentOS, Gentoo, Archlinux, Mandriva, PCLinuxOS, FreeBSD, and others.

[Get ClamTK](https://github.com/dave-theunsub/clamtk)

### ClamAV-GUI | ClamAV

ClamAV-GUI is a GUI front-end for ClamAV using Qt. The ClamAV-GUI sports a dropzone in a corner where files and folders can be dragged and dropped into for scanning. This GUI is brought to you by Joerg Zopes.

[Get ClamAV-GUI](https://store.kde.org/p/1127892/)

### ClamWin | ClamAV

ClamWin is a Free Antivirus program for Microsoft Windows 10 / 8 / 7 / Vista / XP / Me / 2000 / 98 and Windows Server 2012, 2008 and 2003.

[Get ClamWin](https://clamwin.com/)

### Xylent Antivirus

Xylent Antivirus is a Python-based GUI and cross platform interface for ClamAV. Xylent Antivirus provides a very large (multi-gigabyte) collection of ClamAV signatures and Yara rules.

[Get Xylent Antivirus](https://xylent.sourceforge.io)
