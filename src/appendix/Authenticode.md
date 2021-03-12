# Microsoft Authenticode Signature Verification

## About Microsoft Authenticode

Authenticode is Microsoft's system for using digital signatures to ensure that programs to be run/installed on Windows systems come from a verified source and has not been modified by anyone else.  At a high level, it works by having software developers:

1. Obtain a code-signing certificate from a certificate authority trusted by the Windows OS.
2. Compute digital signatures for executables and related software installation files using that certificate.
3. Include the signatures as part of the software execution/installation process so that Windows can use them in the verification process.

In addition, Authenticode signatures can be countersigned by a time-stamping service that allows signature verification to succeed even if the code-signing certificate expires or gets revoked.

For more information, check-out the following resources:

- [Everything you need to know about Authenticode code-signing](https://blogs.msdn.microsoft.com/ieinternals/2011/03/22/everything-you-need-to-know-about-authenticode-code-signing/)

- [Authenticode Digital Signatures](https://docs.microsoft.com/en-us/windows-hardware/drivers/install/authenticode)

- [Time Stamping Authenticode Signatures](https://docs.microsoft.com/en-us/windows/desktop/seccrypto/time-stamping-authenticode-signatures)

- [Caveats for Authenticode Code Signing](https://blogs.msdn.microsoft.com/ieinternals/2014/09/04/caveats-for-authenticode-code-signing/)

## Authenticode and ClamAV

ClamAV supports parsing the Authenticode section and performing signature verification on a given executable to determine whether it should be trusted (based on rules loaded in from ClamAV `.crb` files).  An overview of this process, including information on the `.crb` file format and on how to add new trusted certificate entries, is explained in the [Authenticode Certificate Chain Verification](https://blog.clamav.net/2013/02/authenticode-certificate-chain.html) ClamAV blog post.

There are a few things not covered in the blog post that are worth mentioning:

- As of ClamAV 0.102, leaf certificates (the ones actually issued to the entity signing the binary) may be used for certificate verification in addition to certificates that issued the leaf certificate (and certificates higher up in the chain) can be used.

- As of ClamAV 0.102, `.crb` rules may also be used to block malicious executables where in previous versions these block list entries just override `.crb` rules that would otherwise trust a given sample.

- sigtool offers the `--print-certs` flag, which can be used to show information about embedded Authenticode signatures without having to first match on a signature (which is currently a requirement for clamscan)

- External Authenticode signatures contained in `.cat` files can be loaded in to ClamAV by passing a `-d` flag and indicating the path to the .cat file from which to load signatures.  Note, however, that at least one certificate in the `.cat` file's certificate chain must be trusted (in other words, it must have a backing `.crb` trusted certificate rule.)

# Helpful Info for Working with Authenticode Signatures

Below is some useful information collected when improving ClamAV support for Authenticode signatures.

## Format Specifications

The Windows Authenticode 2008 specification document can be found at the link below.  Note, however, that it is not 100% accurate.  For instance, the documented steps for computing the Authenticode hash are not correct in the case where you have sections that overlap with the PE header or with one another.

- [Windows Authenticode PE Signature Format](http://download.microsoft.com/download/9/c/5/9c5b2167-8017-4bae-9fde-d599bac8184a/Authenticode_PE.docx)

## Verifying the Signature

On Linux, osslsigncode can be used to verify a signature:

```bash
    $ osslsigncode verify /path/to/signed/file
    Current PE checksum   : 00092934
    Calculated PE checksum: 00092934

    Message digest algorithm  : SHA256
    Current message digest    : 56924EB391B1B04572B1841ED5D5C10927CE7D6E9553A69F994B9BA855A73933
    Calculated message digest : 56924EB391B1B04572B1841ED5D5C10927CE7D6E9553A69F994B9BA855A73933

    Signature verification: ok

    Number of signers: 1
        Signer #0:
            Subject: /C=US/ST=California/L=Mountain View/O=Google Inc/CN=Google Inc
            Issuer : /C=US/O=Symantec Corporation/OU=Symantec Trust Network/CN=Symantec Class 3 SHA256 Code Signing CA

    Number of certificates: 2
        Cert #0:
            Subject: /C=US/ST=California/L=Mountain View/O=Google Inc/CN=Google Inc
            Issuer : /C=US/O=Symantec Corporation/OU=Symantec Trust Network/CN=Symantec Class 3 SHA256 Code Signing CA
        Cert #1:
            Subject: /C=US/O=Symantec Corporation/OU=Symantec Trust Network/CN=Symantec Class 3 SHA256 Code Signing CA
            Issuer : /C=US/O=VeriSign, Inc./OU=VeriSign Trust Network/OU=(c) 2006 VeriSign, Inc. - For authorized use only/CN=VeriSign Class 3 Public Primary Certification Authority - G5

    Succeeded
```

On Windows,

[AnalyzePESig](https://blog.didierstevens.com/programs/authenticode-tools/) is a great tool for displaying signature information.  In addition,
[signtool](https://docs.microsoft.com/en-us/dotnet/framework/tools/signtool-exe#examples) can be used.

NOTE that the machine on which these commands is run should have Internet connectivity so that revocation lists can be consulted.  Otherwise, Windows may default to assuming that none of the certificates are revoked.

There is also the [verify-sigs](http://code.google.com/p/verify-sigs) python script that performs verification, but this script is no longer maintained.

## Extracting the Signature

On Linux, the osslsigncode command can be used to extract the contents of the PE security section:

`osslsigncode extract-signature -in /path/to/exe -out /path/to/extracted`

> _Note_: This will also extract the 8-byte [WIN_CERTIFICATE](https://docs.microsoft.com/en-us/windows/desktop/api/wintrust/ns-wintrust-_win_certificate) structure data.
> To skip this data, use:
>
> ```bash
> dd if=/path/to/extracted of=/path/to/extracted.p7b bs=1 skip=8`
> ```

## Inspecting the Signature

On Linux, `openssl` has some useful functions for printing the certificate information and parsing the PKCS7 ASN1:

```bash
    $ openssl pkcs7 -inform der -print_certs -in extracted.p7b -noout -text
    Certificate:
        Data:
            Version: 3 (0x2)
            Serial Number:
                2a:9c:21:ac:aa:a6:3a:3c:58:a7:b9:32:2b:ee:94:8d
        Signature Algorithm: sha256WithRSAEncryption
            Issuer: C=US, O=Symantec Corporation, OU=Symantec Trust Network, CN=Symantec Class 3 SHA256 Code Signing CA
            Validity
                Not Before: Dec 16 00:00:00 2015 GMT
                Not After : Dec 16 23:59:59 2018 GMT
            Subject: C=US, ST=California, L=Mountain View, O=Google Inc, CN=Google Inc
            Subject Public Key Info:
                Public Key Algorithm: rsaEncryption
                    Public-Key: (2048 bit)
                    Modulus:
                        00:c4:0d:82:c4:41:29:28:e5:fd:0c:3f:a5:c7:0e:
                        66:bd:a5:c4:8b:b3:8a:ac:84:03:9f:84:2e:38:df:
                        06:b1:4e:fd:33:60:58:38:36:dd:22:cf:df:f1:50:
                        1f:47:f1:55:05:c1:81:01:e7:28:3e:ff:5f:89:12:
                        09:ea:df:aa:17:49:2c:71:ab:48:d1:9d:2e:f4:51:
                        e0:03:e0:f7:16:6c:7b:0c:22:75:6d:7e:1f:49:c4:
                        43:28:88:41:dc:6c:ed:13:2a:03:99:eb:62:14:f9:
                        35:26:6e:12:2c:03:e2:f7:81:b9:1a:05:67:06:7c:
                        a6:1a:5b:ed:20:15:e5:2d:83:de:8e:36:fa:1e:08:
                        41:1c:1a:48:9f:b6:f1:c3:2f:02:13:4b:a7:ca:ba:
                        ef:1c:58:6f:8e:d3:0f:14:a4:0b:2b:5d:ba:f4:5a:
                        a3:0d:64:34:a5:8a:d7:8f:4d:22:66:4d:a4:ae:e1:
                        f9:cd:c6:58:e6:c6:11:77:32:df:ba:df:39:48:8a:
                        d1:27:d7:33:77:a8:c9:e4:5e:ed:fa:12:cf:f3:fd:
                        fa:ee:ab:80:86:13:34:eb:5a:7e:6f:6c:1b:ee:d8:
                        4b:b2:cc:77:98:87:ac:ca:f5:bb:64:6f:49:1e:5b:
                        91:63:50:1f:63:2d:83:27:73:07:9f:2b:16:f4:7b:
                        71:29
                    Exponent: 65537 (0x10001)
            X509v3 extensions:
                X509v3 Basic Constraints:
                    CA:FALSE
                X509v3 Key Usage: critical
                    Digital Signature
                X509v3 Extended Key Usage:
                    Code Signing
                X509v3 Certificate Policies:
                    Policy: 2.16.840.1.113733.1.7.23.3
                    CPS: https://d.symcb.com/cps
                    User Notice:
                        Explicit Text: https://d.symcb.com/rpa

                X509v3 Authority Key Identifier:
                    keyid:96:3B:53:F0:79:33:97:AF:7D:83:EF:2E:2B:CC:CA:B7:86:1E:72:66

                X509v3 CRL Distribution Points:

                    Full Name:
                    URI:http://sv.symcb.com/sv.crl

                Authority Information Access:
                    OCSP - URI:http://sv.symcd.com
                    CA Issuers - URI:http://sv.symcb.com/sv.crt

                Netscape Cert Type:
                    Object Signing
                1.3.6.1.4.1.311.2.1.27:
                    0.......
        Signature Algorithm: sha256WithRSAEncryption
            23:e7:93:93:af:db:a8:4d:af:af:54:e8:d8:26:95:80:cd:23:
            91:70:ed:0b:5b:b1:e9:d8:dd:1e:40:37:78:97:18:ed:9f:e5:
            84:67:85:06:50:b5:f1:ab:e6:83:5a:17:7b:51:be:7f:18:c6:
            47:5e:2b:aa:f4:a0:1f:35:3e:05:9f:43:40:f7:9f:d1:f4:e1:
            a7:02:f3:8e:c9:71:fe:18:37:48:42:d7:e4:36:73:10:92:d4:
            d8:d9:1c:c4:26:58:18:67:b6:24:22:69:63:02:f7:49:51:6b:
            75:f6:b4:7d:56:ff:2c:f4:88:f7:67:6f:08:86:f3:8b:0b:30:
            02:7f:6d:92:d9:4e:bd:99:f7:7b:74:86:0c:cb:b9:ad:2c:bf:
            44:79:a8:00:82:9c:62:f4:aa:11:df:d2:bf:f0:e1:92:28:11:
            90:bb:5e:33:88:86:96:4d:dd:0b:af:c3:67:a1:95:2d:44:32:
            c6:fa:f7:b8:80:c1:4e:38:be:1f:b6:84:f7:f1:21:31:67:49:
            a8:9f:8a:75:07:df:3b:3a:c3:ea:72:cd:40:7f:a7:da:7c:c9:
            2e:7c:a9:0c:f1:5d:5c:82:42:62:b9:49:94:8f:70:e6:a5:c0:
            5f:17:fb:40:36:c1:3a:89:63:03:1c:3f:66:a0:3d:8f:a1:4c:
            4e:5c:ac:bf
    ...
```

```bash
    $ openssl asn1parse -inform der -i -in extracted.p7b
        0:d=0  hl=4 l=6984 cons: SEQUENCE
        4:d=1  hl=2 l=   9 prim:  OBJECT            :pkcs7-signedData
    15:d=1  hl=4 l=6969 cons:  cont [ 0 ]
    19:d=2  hl=4 l=6965 cons:   SEQUENCE
    23:d=3  hl=2 l=   1 prim:    INTEGER           :01
    26:d=3  hl=2 l=  15 cons:    SET
    28:d=4  hl=2 l=  13 cons:     SEQUENCE
    30:d=5  hl=2 l=   9 prim:      OBJECT            :sha256
    41:d=5  hl=2 l=   0 prim:      NULL
    43:d=3  hl=2 l=  92 cons:    SEQUENCE
    45:d=4  hl=2 l=  10 prim:     OBJECT            :1.3.6.1.4.1.311.2.1.4
    57:d=4  hl=2 l=  78 cons:     cont [ 0 ]
    59:d=5  hl=2 l=  76 cons:      SEQUENCE
    61:d=6  hl=2 l=  23 cons:       SEQUENCE
    63:d=7  hl=2 l=  10 prim:        OBJECT            :1.3.6.1.4.1.311.2.1.15
    75:d=7  hl=2 l=   9 cons:        SEQUENCE
    77:d=8  hl=2 l=   1 prim:         BIT STRING
    80:d=8  hl=2 l=   4 cons:         cont [ 0 ]
    82:d=9  hl=2 l=   2 cons:          cont [ 2 ]
    84:d=10 hl=2 l=   0 prim:           cont [ 0 ]
    86:d=6  hl=2 l=  49 cons:       SEQUENCE
    88:d=7  hl=2 l=  13 cons:        SEQUENCE
    90:d=8  hl=2 l=   9 prim:         OBJECT            :sha256
    101:d=8  hl=2 l=   0 prim:         NULL
    103:d=7  hl=2 l=  32 prim:        OCTET STRING      [HEX DUMP]:56924EB391B1B04572B1841ED5D5C10927CE7D6E9553A69F994B9BA855A73933
    ...
```

On Windows, the `certutil` executable has a great ASN parser:

```bash
    C:\>certutil -asn extracted.p7b
    0000: 30 82 1b 48                               ; SEQUENCE (1b48 Bytes)
    0004: |  06 09                                  ; OBJECT_ID (9 Bytes)
    0006: |  |  2a 86 48 86 f7 0d 01 07  02
        |  |     ; 1.2.840.113549.1.7.2 PKCS 7 Signed
    000f: |  a0 82 1b 39                            ; OPTIONAL[0] (1b39 Bytes)
    0013: |     30 82 1b 35                         ; SEQUENCE (1b35 Bytes)
    0017: |        02 01                            ; INTEGER (1 Bytes)
    0019: |        |  01
    001a: |        31 0f                            ; SET (f Bytes)
    001c: |        |  30 0d                         ; SEQUENCE (d Bytes)
    001e: |        |     06 09                      ; OBJECT_ID (9 Bytes)
    0020: |        |     |  60 86 48 01 65 03 04 02  01
        |        |     |     ; 2.16.840.1.101.3.4.2.1 sha256 (sha256NoSign)
    0029: |        |     05 00                      ; NULL (0 Bytes)
    002b: |        30 5c                            ; SEQUENCE (5c Bytes)
    002d: |        |  06 0a                         ; OBJECT_ID (a Bytes)
    002f: |        |  |  2b 06 01 04 01 82 37 02  01 04
        |        |  |     ; 1.3.6.1.4.1.311.2.1.4 SPC_INDIRECT_DATA_OBJID
    0039: |        |  a0 4e                         ; OPTIONAL[0] (4e Bytes)
    003b: |        |     30 4c                      ; SEQUENCE (4c Bytes)
    003d: |        |        30 17                   ; SEQUENCE (17 Bytes)
    003f: |        |        |  06 0a                ; OBJECT_ID (a Bytes)
    0041: |        |        |  |  2b 06 01 04 01 82 37 02  01 0f
        |        |        |  |     ; 1.3.6.1.4.1.311.2.1.15 SPC_PE_IMAGE_DATA_OBJID
    004b: |        |        |  30 09                ; SEQUENCE (9 Bytes)
    ...
```

There is also a website that offers ASN1 parser and allows you to interactively
hide/view parts of the structure:

- [ASN1 JavaScript Parser](https://lapo.it/asn1js/)

## Creating Signed Executables

For Linux, Didier Stevens has a great post about how to create signed binaries using self-signed certificates:

- [Signing Windows Executables on Kali](https://blog.didierstevens.com/2018/09/24/quickpost-signing-windows-executables-on-kali/)

On Windows, a program called signtool ships with the Windows SDK and can be used.  See the following for tutorials/examples:

- [Authenticode Code Signing with Microsoft SignTool](https://www.digicert.com/code-signing/signcode-signtool-command-line.htm)

- [Signtool Examples](https://docs.microsoft.com/en-us/dotnet/framework/tools/signtool-exe#examples)

## Samples with Interesting Authenticode Signatures

Below are some PE files with interesting Authenticode signatures.  These are probably only interesting to other researchers who are looking at Authenticode in-depth.  All samples are available via VirusTotal.

- SHA256-based code-signing signature without a countersignature
  - `8886d96e9ed475e4686ffba3d242e97836de8a56b75cc915e21bb324cc89de03`

- SHA256-based code-signing sig and SHA1-based timestamping countersig
  - `20367d0e3a5ad12154095d424b8d9818c33e7d6087525e6a3304ef6c22a53665`

- SHA384-based cert used in the code-signing chain
  - `2249611fef630d666f667ac9dc7b665d3b9382956e41f10704e40bd900decbb8`

- Uses SHA512 to compute the Authenticode hash
  - `eeb5469a214d5aac1dcd7e8415f93eca14edc38f47d1e360d3d97d432695207a`

- Signed by an MS root cert that doesn't have a KU or EKU specified
  - `69b61b2c00323cea3686315617d0f452e205dae10c47e02cbe1ea96fea38f582`

- Has a v1 x509 cert and uses MD2-based hashing
  - `1cb16f94cebdcad7dd05c8537375a6ff6379fcdb08528fc83889f26efaa84e2a`

- Countersignature with version 0 instead of version 1
  - `145fbbf59b1071493686bf41f4eb364627d8be3c9dc8fb927bbe853e593864ec`

- Countersignature with contentType == timestampToken instead of pkcs7-data
  - `8a364e0881fd7201cd6f0a0ff747451c9b93182d5699afb28ad8466f7f726660`

- Countersignature with AlgoIdentifier sha1WithRSAEncryption instead of SHA1
  - `2aa6b18d509090c60c3e4ecdd8aeb16e5f149807e3404c86892112710eab576d`

- Countersignature uses v1 x509 certs
  - `934860a4ac2446240e4c7053ddc27ff4c2463d4ad433cc28c9fcc2ea4690fb86`

- Certificate chain has old certificates without a version
  - `374a31b20fbafdcd31d52ae11a0dcad58baba556c8942a3cdfae0bb96ae117a1`

- Has extra data after the PKCS7, a violation of [MS13-098](https://docs.microsoft.com/en-us/security-updates/securitybulletins/2013/ms13-098)
  - `0ee196bb23f0eafe4f61d30bf6c676fd7365cb12ae66a6bde278851e91901ac1`

- Authenticode signature covers data not in a section
  - `0123c163ac981e639565caff72ee3af2df7174613ee12003ac89124be461c6e6`

- Authenticode signature with a section that overlaps the PE header (UPX-packed)
  - `0059fb3f225c5784789622eeccb97197d591972851b63d59f5bd107ddfdb7a21`

- Authenticode signature with overlapping sections
  - `014b66cf2cef39620e9a985d237971b8cf272043e9ac372d5dcef44db754a1d2`

- Uses certs with no NULL after AlgorithmIdentifier OID
  - `66b797b3b4f99488f53c2b676610dfe9868984c779536891a8d8f73ee214bc4b`

- Uses an ASN1 indefinite length object
  - `8ca912e397a9e1b0cc54c216144ff550da9d43610392208193c0781b1aa5d695`

- Unexpected contentType for embedded mode signature (copied from a .cat?)
  - `6ed9b5f6d32f94b3d06456b176c8536be123e1047763cc0a31c6e8fd6a0242b1`

- Security directory appears to overlap with the PE header
  - `ff482f69f2183b5fd3c1b45d9006156524b8f8a5f518e33d6e92ea079787e64d`

- x509 cert with a public key using exponent 3
  - `012760e582e541c6dd34a2cbd5d053f402eebcb8b60ed4a88fecb5589bd17bb9`

- x509 UTCDate is missing the seconds field
  - `05de45fd6a406dc147a4c8040a54eee947cd6eba02f28c0279ffd1a229e17130`

- x509 cert with a negative serial number
  - `6218d50eb5c898acd3482daaea8f615b4f1f87ef0d06220cc1d7f700bc35888b`

## Additional References

- [What are x509 certificates?](https://www.cryptologie.net/article/262/what-are-x509-certificates-rfc-asn1-der/) (Provides an overview of the ASN1 structure of x509 certificates)

- [Signed Malware](http://signedmalware.org/) (Research papers on signed malware with interactive tables of malicious code signing certs)
