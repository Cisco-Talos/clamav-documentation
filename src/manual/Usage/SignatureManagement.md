# Signature Testing and Management

Table Of Contents

- [Signature Testing and Management](#signature-testing-and-management)
  - [FreshClam](#freshclam)
  - [SigTool](#sigtool)
  - [ClamBC](#clambc)
  - [Next Steps](#next-steps)
  - [Create your own signatures](#create-your-own-signatures)

> _Tip_: The commands on Windows are generally the same, but you may need to add the `.exe` extension to run the ClamAV applications.

## FreshClam

Before you can start the ClamAV scanning engine (using either `clamd` or `clamscan`), you must _first_ have ClamAV Virus Database (.cvd) file(s) installed in the appropriate location on your system.

The tool `freshclam` is used to download and update ClamAV’s official virus signature databases. While easy to use in its base configuration, `freshclam` does require a working [`freshclam.conf` configuration file](Configuration.md#freshclamconf) to run (the location of which can be passed in via command line if the default search location does not fit your needs).

Once you have a valid configuration file, you can invoke FreshClam with the following command:

```bash
freshclam
```

By default, `freshclam` will then attempt to connect to ClamAV's virus signature database distribution network. If no databases exist in the directory specified, `freshclam` will do a fresh download of the requested databases. Otherwise, `freshclam` will attempt to update existing databases, pairing them against downloaded cdiffs. If a database is found to be corrupted, it is not updated and instead replaced with a fresh download.

Of course, all this behavior--and more--can be changed to suit your needs by [modifying `freshclam.conf` and/or using various command line options](Configuration.md#freshclamconf).

You can find more information about FreshClam with the commands:

Unix/Linux:

```bash
freshclam --help
```

Or (Unix/Linux only):

```bash
man freshclam
```

> _Tip_: Newer versions of FreshClam will create your database directory if it doesn't already exist. Older versions won't, and may fail unless you create it first.

> _Important_: It is common on Ubuntu after a fresh install to see the following error the first time you use ClamAV:
> ```bash
> freshclam
>
> freshclam: error while loading shared libraries: libclamav.so.7: cannot open shared object   file: No such file or directory
> ```
>
> You can fix this error by using `ldconfig` to rebuild the library search path.
> ```bash
> sudo ldconfig
> ```

If you are having issues updating the signature databases with `freshclam`, please review [the `freshclam` FAQ](../../faq/faq-freshclam.md).

## SigTool

ClamAV provides `sigtool` as a command-line testing tool for assisting users in their efforts creating and working with virus signatures. While sigtool has many uses--including crafting signatures--of particular note, is sigtool's ability to help users and analysts in determining if a file detected by *libclamav*'s virus signatures is a false positive.

This can be accomplished by using the command:

```bash
sigtool --unpack=FILE
```

Where FILE points to your virus signature databases. Then, once `sigtool` has finished unpacking the database into the directory from which you ran the command, you can search for the offending signature name (provided either by [`clamscan`](Scanning.md#clamscan) scan reports or [`clamd`](Scanning.md#clamd) logs). As an example:

```bash
grep "Win.Test.EICAR" ./*
```

Or, do all that in one step with:

```bash
sigtool --find="Win.Test.EICAR"
```

This should give you the offending signature(s) in question, which can then be included as part of your [false positive report](https://www.clamav.net/reports/fp).

To learn more in depth information on how `sigtool` can be used to help create virus signatures and work with malicious (and non-malicious) files please reference the many online tutorials on the topic.

Otherwise, information on available sigtool functions can be easily referenced with:

```bash
sigtool --help
```

Or (Unix/Linux only):

```bash
man sigtool
```

## ClamBC

`clambc` is Clam Anti-Virus’ bytecode signature testing tool. It can be used to test newly crafted bytecode signatures or to help verify existing bytecode is executing against a sample as expected.

For more detailed help, please use:

```bash
clambc --help
```

Or (Unix/Linux only):

```bash
man clambc
```

## Next Steps

Now that you know more about FreshClam and tools to work with the signature databases, it's time to [run your first scan](Scanning.md).

## Create your own signatures

There is a whole community of malware researchers and signature writers. If you'd like to learn how to [craft your own signatures](../Signatures.md), you can!
