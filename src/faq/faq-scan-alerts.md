# Interpreting Scan Alerts FAQ

## ClamAV alerted on a file during a scan. What do I do?

ClamAV may have found a malicious or suspicious file. However, you're probably asking yourself if the alert is a False Positive (FP). It may well be, so don't just delete the file out-of-hand.

### Online Research

First, consider the file itself and whether or not the alert makes sense. If you're concerned, start by searching the name of the signature on Google. If FP's are being reported, you may see others complaining about the same thing, or you may be able to get an understanding of what the signature is trying to find.

### Technical Investigation

Second, if you're technically inclined, you may want to try to read the signature details to understand how it works and what, specifically, it's alerting on. Take heed, this investigation might leave you more confused than when you started. ClamAV doesn't post write-ups on how each signature in-part because a good number of our signatures these days are generated automatically and not by a human mind.

1. Start by opening a command prompt in a new empty directory, for example:

    ```bash
    user@laptop:~$  mkdir /tmp/sigdump

    user@laptop:~$  cd /tmp/sigdump
    ```

2. Use the `sigtool` program to unpack the ClamAV databases into their separate components. SigTool should be installed alongside clamscan, probably in `/usr/local/bin/sigtool`. The ClamAV databases are traditionally installed in `/usr/local/share/clamav` although if you installed from a package manager, your paths may vary:

    ```bash
    user@laptop:/tmp/sigdump$  sigtool -u /usr/local/share/clamav/main.cvd

    user@laptop:/tmp/sigdump$  sigtool -u /usr/local/share/clamav/daily.cvd        # May be: daily.cld

    user@laptop:/tmp/sigdump$  sigtool -u /usr/local/share/clamav/bytecode.cvd     # May be: bytecode.cld
    ```

3. Use `ls` to verify that you've successfully unpacked the databases:

    ```bash
    user@laptop:/tmp/sigdump$  ls

    3986187.cbc    3986230.cbc    3986303.cbc    4553522.cbc    6335443.cbc    6399052.cbc    daily.cfg      daily.msb
    3986188.cbc    3986231.cbc    3986305.cbc    4970075.cbc    6335540.cbc    6404655.cbc    daily.crb      daily.msu
    3986206.cbc    3986232.cbc    3986306.cbc    5044126.cbc    6335560.cbc    6428210.cbc    daily.fp       daily.ndb
    3986212.cbc    3986233.cbc    3986310.cbc    5588995.cbc    6335564.cbc    6428556.cbc    daily.ftm      daily.ndu
    3986214.cbc    3986234.cbc    3986321.cbc    5819336.cbc    6335669.cbc    6441308.cbc    daily.hdb      daily.pdb
    3986215.cbc    3986235.cbc    3986322.cbc    5999914.cbc    6336023.cbc    6442366.cbc    daily.hdu      daily.sfp
    3986216.cbc    3986236.cbc    3986327.cbc    5999936.cbc    6336035.cbc    6447941.cbc    daily.hsb      daily.wdb
    3986217.cbc    3986242.cbc    3986328.cbc    6300337.cbc    6336074.cbc    6453673.cbc    daily.hsu      main.crb
    3986218.cbc    3986244.cbc    3986334.cbc    6311970.cbc    6336259.cbc    6471051.cbc    daily.idb      main.fp
    3986219.cbc    3986249.cbc    3986337.cbc    6316126.cbc    6336260.cbc    6497366.cbc    daily.ign      main.hdb
    3986220.cbc    3986259.cbc    4306126.cbc    6324281.cbc    6336630.cbc    6539706.cbc    daily.ign2     main.hsb
    3986221.cbc    3986282.cbc    4306157.cbc    6327695.cbc    6336737.cbc    6566834.cbc    daily.info     main.info
    3986222.cbc    3986283.cbc    4307467.cbc    6329916.cbc    6336739.cbc    6614848.cbc    daily.ldb      main.mdb
    3986223.cbc    3986289.cbc    4416867.cbc    6329917.cbc    6364361.cbc    COPYING        daily.ldu      main.msb
    3986224.cbc    3986292.cbc    4510302.cbc    6335400.cbc    6380163.cbc    bytecode.info  daily.mdb      main.ndb
    3986229.cbc    3986301.cbc    4526683.cbc    6335427.cbc    6395243.cbc    daily.cdb      daily.mdu      main.sfp
    ```

4. Use `grep` to search for the signature in question. For example:

    ```bash
    user@laptop:/tmp/sigdump$  grep -r Win.Downloader.DDECmdExec-6683887-5

    Win.Downloader.DDECmdExec-6683887-5;Engine:81-255,Target:0;4;0:1f8b;0:255044462d;0:4d5a{-100}50450000;7c27{-255}2721;(0=0&1=0&2=0)&3/(?<!\x20)[=+\-@]\s*?(\w+\s*?\x28)?.{0,50}(certutil|cmd|cmstp|cscript|dnscmd|msiexec|netsh|regsvr32|rpcping|rundll32|schtasks|telnet|tscon|tsdiscon|wmic|wscript).{0,50}\|\s*?\x27[^\x27]{5,255}\x27\s*?\x21/i
    ```

5. Reading ClamAV signatures is hard. You can familiarize yourself with the ClamAV signature format by reading the documentation on [writing ClamAV Signatures](https://github.com/Cisco-Talos/clamav/blob/dev/0.101/docs/UserManual/Signatures.md#introduction).

    To get a jump start, you can make `sigtool` print out a more human readable represenation of what the signature is looking for. Pipe the output from grep directly into sigtool by using the `--decode-sigs` option:

    ```bash
    user@laptop:/tmp/sigdump$  grep Win.Downloader.DDECmdExec-6683887-5 -r . | ../../bin/sigtool --decode-sigs
    ```

    The output will look something like this:

    ```bash
        VIRUS NAME: ./daily.ldb:Win.Downloader.DDECmdExec-6683887-5
        TDB: Engine:81-255,Target:0
        LOGICAL EXPRESSION: 4
         * SUBSIG ID 0
         +-> OFFSET: 0
         +-> SIGMOD: NONE
         +-> DECODED SUBSIGNATURE:
        �
         * SUBSIG ID 1
         +-> OFFSET: 0
         +-> SIGMOD: NONE
         +-> DECODED SUBSIGNATURE:
        %PDF-
         * SUBSIG ID 2
         +-> OFFSET: 0
         +-> SIGMOD: NONE
         +-> DECODED SUBSIGNATURE:
        MZ{WILDCARD_ANY_STRING(LENGTH<=100)}PE
         * SUBSIG ID 3
         +-> OFFSET: ANY
         +-> SIGMOD: NONE
         +-> DECODED SUBSIGNATURE:
        |'{WILDCARD_ANY_STRING(LENGTH<=255)}'!
         * SUBSIG ID 4
         +-> OFFSET: ANY
         +-> SIGMOD: NONE
         +-> DECODED SUBSIGNATURE:
             +-> TRIGGER: (0=0&1=0&2=0)&3
             +-> REGEX: (?<!\x20)[=+\-@]\s*?(\w+\s*?\x28)?.{0,50}(certutil|cmd|cmstp|cscript|dnscmd|msiexec|netsh|regsvr32|rpcping|rundll32|schtasks|telnet|tscon|`tsdiscon|wmic|wscript).{0,50}\|\s*?\x27[^\x27]{5,255}\x27\s*?\x21
             +-> CFLAGS: i
    ```

6. Interpret the results. ClamAV signatures can be as simple as a hash-based signature of a known-malicious file, but they can also be a complex logical test. You may not learn enough to make an educated decision. The above example is a pretty complicated one, so I will try to walk you through it.

    You can see that there are 5 subsignatures (numbered 0 - 4). The `LOGICICAL EXPRESSION` indicates which subsignature(s) matter and why. This could be something like `0 AND 1` to indicate that 2 subsignatures must both trigger in order for the overall signature to alert. In this case, only subsignature `4` is required by the `LOGICAL EXPRESSION`.

    If you look at `SUBSIG ID 4`, you'll see that has a has a `TRIGGER` which acts in much the same way as the above `LOGICAL EXPRESSION`. If the subsignatures in the logical expression are satisfied, then the regular expression `REGEX` will be tested. If the regular expression matches, then the SUBSIG ID 4 will trigger and the overall signature will alert.

### Reporting

If you believe that the signature alerted on a benign file, please report the False Positive so our analysts can refine or remove the faulty signature. You can report false positives [on our website](https://www.clamav.net/reports/fp) or you can submit the report using the `clamsubmit` command-line program.

If you're concerned that the file may be malicious, and aren't comfortable quarantining and/or deleting the file, feel free to ask in the user mailing lists for advice. Please subscribe to [clamav-users](https://lists.clamav.net/mailman/listinfo/) and then post a message to all the list members by sending an email to clamav-users -at- lists -dot- clamav -dot- net.
