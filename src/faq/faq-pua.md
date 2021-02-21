# Potentially Unwanted Applications (PUA)

ClamAV supports the detection of Potentially Unwanted Applications (PUA).

## PUA Config Options

You can customize PUA detection for ClamD with these `clamd.conf` options:

  ```bash
    DetectPUA yes        # Detect Possibly Unwanted Applications
    ExcludePUA CAT       # Skip PUA sigs of category CAT
    IncludePUA CAT       # Load PUA sigs of category CAT
  ```

You can customize PUA detection for ClamScan with these command-line options:

  ```bash
    --detect-pua         # Detect Possibly Unwanted Applications
    --exclude-pua=CAT    # Skip PUA sigs of category CAT
    --include-pua=CAT    # Load PUA sigs of category CAT
  ```

The category name is a string match with the 2nd token in a `PUA.*` signature name.

  ```bash
    PUA.category.subcategory.description-version
  ```

Some examples:

- `PUA.Win.Packer.BorlandDelphi-5` : The category name is `Win`.

- `PUA.Cert.Revoked.PEAuthenticode-5750538-0` : The category name is `Cert`.

There is presently _no_ support for including or excluding by subcategory.

## Current PUA Categories

PUA categories are the product of signature naming conventions. These vary over time as new signatures are added.

_Disclaimer_ - PUA signatures are not as carefully curated as malware signatures because they are not as commonly used. You should expect more false positives when using PUA signatures. Further, inclusion or exclusion of specific categories may not be very intuitive or predictable. Specifically, excluding the `Win` category will not exclude all Windows application PUA signatures. There are undoubtedly more Windows PUA signatures in the `Packed`, `Tool`, `Spy`, `NetTool`, etc categories that target Windows applications. Similarly, excluding the `Packed` category will not guarantee that you exclude signatures like `PUA.Win.Packer.Whatever-0123`. In short, the inclusion and exclusion of PUA signatures will likely be frustrating. Improvements to PUA include/exclude options to support subcategories as well as SigTool features to enumerate current PUA categories and subcategores would be a good candidate for a community contribution project.

_Disclaimer 2_ - The `Virus`/`Ransomeware`/`Trojan`/etc malware categories or subcategories for PUA signatures were mistakenly selected by automated tools. Those tools have since been fixed and no new signatures should appear with these names. The existing malware-name categories for these PUA signatures are expected to be removed/renamed as time permits.

The following is a snapshot of the PUA signature name categories and subcategories from daily.cvd & main.cvd (Jan 29, 2020):

  ```bash
    PUA.Andr.Adware
    PUA.Andr.Downloader
    PUA.Andr.Dropper
    PUA.Andr.Tool
    PUA.Andr.Trojan
    PUA.Andr.Virus
    PUA.Cert.Revoked
    PUA.Doc.Dropper
    PUA.Doc.Packed
    PUA.Doc.Tool
    PUA.Doc.Trojan
    PUA.Email.Phishing
    PUA.Email.Trojan
    PUA.Embedded.File
    PUA.Html.Exploit
    PUA.Html.Tool
    PUA.Html.Trojan
    PUA.Java.Exploit
    PUA.Java.Packer
    PUA.Js.Exploit
    PUA.Osx.File
    PUA.Osx.Trojan
    PUA.Packed.Tool
    PUA.Pdf.Exploit
    PUA.Pdf.Trojan
    PUA.Php.Trojan
    PUA.Rtf.Exploit
    PUA.Spy.Tool
    PUA.Swf.Spyware
    PUA.Tool.Countermeasure
    PUA.Tool.Tool
    PUA.Unix.Adware
    PUA.Unix.Coinminer
    PUA.Unix.Downloader
    PUA.Unix.File
    PUA.Unix.Malware
    PUA.Unix.Tool
    PUA.Unix.Trojan
    PUA.Unix.Virus
    PUA.Win.Adware
    PUA.Win.Coinminer
    PUA.Win.Downloader
    PUA.Win.Dropper
    PUA.Win.Exploit
    PUA.Win.File
    PUA.Win.Ircbot
    PUA.Win.Joke
    PUA.Win.Keylogger
    PUA.Win.Malware
    PUA.Win.Packed
    PUA.Win.Packer
    PUA.Win.Proxy
    PUA.Win.Ransomware
    PUA.Win.Spyware
    PUA.Win.Tool
    PUA.Win.Trojan
    PUA.Win.Virus
  ```

## PUA Category Descriptions

The following category descriptions should give you some idea of how the PUA signature naming conventions are used. Please note this list is not exhaustive. As noted above, PUA signatures are not as carefully curated and there will be exceptions:

* Andr

    Potentially unwanted applications for Android mobile devices.

* Java

    Potentially unwanted applications written for the Java runtime.

* NetTool

    Applications that can be used to sniff, filter, manipulate or scan network traffic or networks.  While a networkscanner - for example - can be a extremely helpful tool for admins, you may not want to see an average user playing around with it. Same goes for tools like netcat and the like.

* P2P

    Peer to Peer clients can be used to generate a lot of unwanted traffic and sometimes it happens that copyrights are violated by downloading copyright protected content (Music, Movies) - therefore we consider them possibly unwanted as well.

* Packed

    This is a detection for files that use some kind of runtime packer. A runtime packer  can be used to reduce the size of executable files without the need for an external unpacker. While this can't be considered malicious in general, runtime packers are widely used with malicious files since they can prevent a already known malware from detection by an Antivirus product.

* PwTool

    Password tools are all applications that can be used to recover or decrypt passwords for various applications - like mail clients or system passwords. Such tools can be quite helpful if a password is lost, however, it can also be used to spy out passwords.

* IRC

    IRC Clients can be a productivity killer and depending on the client - a powerful platform for malicious scripts (take mIRC for example).

* Osx

    Potentially unwanted applications for macOS systems.

* RAT

    Remote Access Trojans are used to remotely access systems, but can be used also by system admins, for example VNC or RAdmin.

* Server

    Server based badware like DistributedNet.

* Script

    Known "problem" scripts written in JavaScript, ActiveX or similar.

* Spy

    Keyloggers, spying tools.

* Tool

    General system tools, like process killers/finders.

* Unix

    Potentially unwanted applications for Unix systems.

* Win

    Potentially unwanted applications for Windows systems.
