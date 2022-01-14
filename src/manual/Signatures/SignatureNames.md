# Official Signature Naming Guidelines

New official signatures published by Cisco-Talos in the `daily`, `main`, and `bytecode` signature databases follow this format:
```
{platform}.{category}.{name}-{signature id}-{revision}
```

## Signature Naming Rules

Guidelines for creating new official signatures are as follows.

### `platform`

Start names with targeted *platform* (or file format).

Options for this field in official signatures include: *Andr, Archive, Asp, Cert, Clamav, Clean, Css, Doc, Dos, Eicar, Email, Embedded, Emf, Gif, Heuristics, Html, Hunting, Hwp, Img, Ios, Java, Js, Legacy, Lnk, Midi*

### `category`

Follow with the *category*.

Options for this field in official signatures include: *Adware, Backdoor, Coinminer, Countermeasure, Downloader, Dropper, Exploit, File, Filetype, Infostealer, Ircbot, Joke, Keylogger, Loader, Macro, Malware, Packed, Packer, Phishing, Proxy, Ransomware, Revoked, Rootkit, Spyware, Test*

### `name`

Finish with a representative *name* of your choosing. This is often a malware family name. It is common to choose "Agent" if you can’t come up with a meaningful name.

Some examples: *Zbot, CVE_2012_0003, Sality, FakeAV, Koobface*

Rules for the name field:

1. "Must"
    a. Only use alphanumeric characters, dot (.), underscores (_) in signature names
2. "Must not"
    a. Use space, apostrophe or quote marks.
    b. Use company names, brand names, or names of living people, except where the virus is probably written by the person. Common first names are permissible, but be careful – avoid if possible. In particular, avoid names associated with the anti-virus world. If a virus claims to be written by a particular person or company do not believe it without further proof.
    c. Use an existing Family_Name, unless the viruses belong to the same family
    d. Invent a new name if there is an existing, acceptable name.
    e. Use obscene or offensive names.
3. "Should"
    a. When possible reuse the most common family name used by other vendors
    b. Avoid geographic names which are based on the discovery site – the same virus might appear simultaneously in several different places

### `signature id` and `revision`

The `signature id` in combination with the `revision` form a unique value that can be used to identify any official signature without requiring the descriptive name.

The `revision` will increment each time a new signature replaces an older version. Revisions higher than 0 indicate that the older versions of the signature were dropped because they caused false positive alerts or because a newer signature was crafted with a higher detection rate.

## Examples Official Signatures

- Win.Trojan.Zusy-9935890-0
- Win.Malware.Zusy-9935891-0
- Win.Dropper.DarkKomet-9935892-0
- Html.Malware.Agent-9915974-0
- Java.Malware.CVE_2021_44228-9915817-0
- Xls.Downloader.Qbot12211-9916030-0
