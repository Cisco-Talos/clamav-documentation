# ClamAV on Microsoft Windows FAQ

ClamAV offers a versions of ClamAV for Microsoft Windows compatible with both 32bit and 64bit versions of Windows 7 and newer.

We provide both two install packages for Windows:

* Portable Install Package
    * Zip file containing all you need to run ClamAV without running an installer.

* Install Program
    * Traditional executable installer that will install ClamAV in the "Program Files" directory.

In addition to the above ClamAV versions that run on Windows, Cisco offers two more endpoint security products powered in-part by ClamAV. These are:

* Immunet
    * Immunet is a malware and antivirus protection system that utilizes cloud computing to provide enhanced community-based security.
    * Immunet is free for non-commercial use.
    * Commercial users should consider Cisco AMP.

* Cisco Advanced Malware Protection (AMP) for Endpoints
    * AMP for Endpoints prevents threats at point of entry, then continuously tracks every file it lets onto your endpoints. AMP can uncover even the most advanced threats, including fileless malware and ransomware.
    * AMP for Endpoints is subscription-based, managed through a web-based management console, and may be deployed on a variety of platforms to include Windows, macOS, and Linux operating systems.
    * For details, please visit the [AMP for Endpoints] website.

## What is the difference between ClamAV, Immunet, and ClamWin?

**ClamAV** is available for Windows with the same scanning and detection capabilities available when using ClamAV on macOS and Linux, with exception to the On-Access Scanning feature (Linux).

**Immunet** is a real-time fully featured desktop AV solution. It contains cloud based detection technologies and the enterprise grade ClamAV detection engine. The product is produced and maintained by Cisco which owns both ClamAV and Immunet.

**ClamWin** is a free application that provides a graphical front-end for ClamAV, similar to ClamTk. ClamWin is maintained by ClamWin Pty Ltd., and has no association with *ClamAV*, *Cisco*, or the *Immunet* product. Additionally, *ClamWin* does not contain an on-access real-time scanner, and can only be used to manually scan files.

## Is Immunet free for commercial use?

Immunet is not free for commercial use. [AMP for Endpoints] is our product that replaced the commercial version. If you are interested in deploying this in a commercial environment, we highly suggest checking that out.

## Will Immunet send any sensitive data from my computer to the cloud?

Immunet sends information about the files its scanning back to the cloud. This information is in the form of SHA hashes and file heuristics. Currently, this information is only collected for Windows PE files, or in other terms what most people refer to as executable files. No information is collected for other types of files, like Word, Excel, or PDF. Additionally, in some situations the entire PE file will be uploaded to the Cloud to determine if it is malicious.
For a complete overview please see the [privacy policy].

## Are you going to make use of the Cloud in the \*nix version of ClamAV?

The simple answer is “yes”.  The complex answer is “when”. We are currently working on that roadmap and will keep everyone informed as that information becomes available.

## Can I use Immunet with my current AV solution?

Yes. In fact it is encouraged.

## Where should I report false positives or undetected malware?

Please report __Undetected Malware__ [here](https://www.clamav.net/reports/malware).

Please report __False Positives__ [here](https://www.clamav.net/reports/fp).

## Are there 64 bit versions of ClamAV for Windows as well as 32 bit?

Yes. You can find both versions at [Clamav/downloads].

[privacy policy]: https://www.cisco.com/c/en/us/about/legal/privacy.html
[Clamav/downloads]: https://www.clamav.net/downloads#otherversions
[AMP for Endpoints]: https://www.cisco.com/c/en/us/products/security/amp-for-endpoints/index.html
