# ClamAV on Microsoft Windows FAQ

ClamAV offers a versions of ClamAV for Microsoft Windows compatible with both 32bit and 64bit versions of Windows 7 and newer.

We provide both two install packages for Windows:

* Portable Install Package
    * Zip file containing all you need to run ClamAV without running an installer.

* Install Program
    * Traditional executable installer that will install ClamAV in the "Program Files" directory.

In addition to the above ClamAV versions that run on Windows, Cisco offers more endpoint security products powered in-part by ClamAV. These are:

* Cisco Secure Endpoint (formerly Advanced Malware Protection (AMP) for Endpoints)
    * Secure Endpoint prevents threats at point of entry, then continuously tracks every file it lets onto your endpoints. AMP can uncover even the most advanced threats, including fileless malware and ransomware.
    * Secure Endpoint is subscription-based, managed through a web-based management console, and may be deployed on a variety of platforms to include Windows, macOS, and Linux operating systems.
    * For details, please visit the [Cisco Secure Endpoint] website.

## What is the difference between ClamAV and ClamWin?

**ClamAV** is available for Windows with the same scanning and detection capabilities available when using ClamAV on macOS and Linux, with exception to the On-Access Scanning feature (Linux).

**ClamWin** is a free application that provides a graphical front-end for ClamAV, similar to ClamTk. ClamWin is maintained by ClamWin Pty Ltd., and has no association with *ClamAV* or *Cisco*.

## Are you going to make use of the Cloud in ClamAV?

No. Users that want a lighter memory footprint and additional advanced detection features of an endpoint security suite should look to Cisco Secure Endpoint.

## Where should I report false positives or undetected malware?

Please report __Undetected Malware__ [here](https://www.clamav.net/reports/malware).

Please report __False Positives__ [here](https://www.clamav.net/reports/fp).

## Are there 64 bit versions of ClamAV for Windows as well as 32 bit?

Yes. You can find both versions at [ClamAV/downloads].

[privacy policy]: https://www.cisco.com/c/en/us/about/legal/privacy.html
[ClamAV/downloads]: https://www.clamav.net/downloads#otherversions
[Cisco Secure Endpoint]: https://www.cisco.com/site/us/en/products/security/endpoint-security/secure-endpoint/index.html
