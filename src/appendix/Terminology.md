# Terminology

## General Terminology

| Term | Description |
| - | - |
| *adware* | Adware is software that injects extra advertisements into other applications like your browser, or extra advertisements bundled by a third party into software that is ordinarily free of advertisements. Adware is often considered to be a type of Potentially Unwanted Application (PUA) when the the advertisements aren't used to fund development of the application but are injected by a third party. |
| *bytecode* | Bytecode is a partially compiled executable that is platform agnostic but must be further compiled or otherwise interpreted in order to be executed. For ClamAV, "bytecode signature" refer to ClamAV plugin with a `.cbc` file extension. Some bytecode signatures detect specific types of malware, as the name suggests. Other bytecode signatures extend file parser support within ClamAV, enabling faster deployment of new ClamAV features. |
| *CLD* | A CLD is the uncompressed ClamAV signature database archive. CLD files are created by FreshClam when a CVD or CLD database archive is updated with a CDIFF patch file. |
| *CVD* | A CVD is an compressed ClamAV signature database archive that is signed and distributed by Cisco-Talos. "CVD" refers to the `.cvd` file extension, although when updated using a CDIFF database patch file, the extension is changed to `.cld`. |
| *CDIFF* | A CDIFF is a patch file for a CVD or CLD database archive. CDIFFs allow for frequent updates to the ClamAV database set without requiring a large download each time. |
| *endpoint* | An endpoint is a computer that a human interacts with, such as a laptop, desktop, or mobile device. |
| *endpoint security suite* | An endpoint security suite is software that bundles a variety of services to protect a computer system. In addition to scheduled malware scanning, this may include features like a firewall, on-access scanning, network traffic monitoring, process behavioral monitoring, and other real time protection features. |
| *false negative* | A false negative is when a scan fails to alert on a file. You can [report false negatives on clamav.net](https://www.clamav.net/reports/malware). |
| *false positive* | A false positive is when a scan incorrectly alerts on a file. You can [report false positive detections on clamav.net](https://www.clamav.net/reports/fp). |
| *malware* | Malware is a general term for software intended to cause harm, disrupt, or gain unauthorized access to a computer system. Trojans, worms, miners, rootkits, viruses, keyloggers, and ransomware are all examples of different types of malware. |
| *on-access* | On-access in the context of malware detection refers to a technology to scan files when they are created, opened, moved, or otherwise accessed. On-access scanning is one form of "real time protection". The scan may block access to the file and prevent access if an alert occurs, or it may simply scan as the file is being accessed to alert or take some action when the scan is complete. |
| *PUA* | A Potentially Unwanted Application (PUA) or Potentially Unwanted Program (PUP) is a program that probably isn't malware, but little benefit to the user and is considered to be undesirable by most people. This may include software like crypto currency mining software, adware, and other software that may be legitimate but may also be used to take advantage of unsuspecting users. See our [FAQ page about PUA signatures](../faq/faq-pua.md) for more information. |

 ## ClamAV Components

| Component | Description |
| - | - |
`clamav-config` | This is a script for checking how ClamAV was compiled. `clamav-config` is not present on Windows installations. |
| `clamav-milter` | ClamAV-Milter is a daemon that performs email filter scanning through `clamd`. |
| `clambc-compiler` | The ClamAV Bytecode Compiler (ClamBC-Compiler or ClamBCC) is a compiler for building bytecode executable signature plugins. The Bytecode Compiler installed separately. See the [ClamAV Bytecode Compiler project on Github](https://github.com/Cisco-Talos/clamav-bytecode-compiler) for more details. |
| `clambc` | ClamBC is another signature manipulation tool specifically for bytecode signatures. |
| `clamconf` | ClamConf is a tool to check or generate ClamAV configuration files and collect additional information that may be needed to help remotely debug issues. |
| `clamd` | ClamD is a multi threaded daemon that listens for scan requests on a network socket or unix socket. Client applications for `clamd` include `clamdtop`, `clamdscan`, `clamav-milter`, and `clamonacc`. The socket interface is documented and there are also a variety of third-party clients for `clamd`. See the [Community Projects page](../manual/Installing/Community-projects.md) for more details. |
| `clamdscan` | ClamDScan is a command line program to scan files and directories through `clamd`. |
| `clamdtop` | ClamDTop is a command line GUI to monitor ClamD. |
| `clamonacc` | ClamOnAcc is a daemon that receives on-access events from the kernel for real-time protection scanning through ClamD. ClamOnAcc is only available for Linux at this time. |
| `clamscan` | ClamScan is a command line program to scan files and directories that does not require the clamd daemon. |
| `freshclam` | FreshClam is the signature database (cvd) update tool. |
| `libclamav` | The ClamAV library enables you to build the ClamAV engine into your programs. The C programming API can be found in `clamav.h`. |
| `libfreshclam` | The FreshClam library enables you to build the signature update update features into your programs. The C programming API can be foudn in `libfreshclam.h`. |
| `sigtool` | SigTool is a signature database (cvd) manipulation tool for malware analysts and signature writers. |
