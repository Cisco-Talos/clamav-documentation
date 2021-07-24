# ClamAV Virus Database FAQ

## How do I keep my virus database up to date?

ClamAV comes with _FreshClam_, a tool which periodically checks for new database releases and keeps your database up to date. It is encouraged that you update to at least version 0.103.2, which respects our bandwidth limitations.

## How often is the virus database updated?

The virus database is usually updated once or twice per day. Sign up for our [VirusDB mailing list](https://lists.clamav.net/mailman/listinfo/clamav-virusdb) to see our response times to new threats. The virusdb team tries to keep up with the latest threats in the wild. You can contribute to make the virusdb updating process more efficient by submitting samples of viruses via our "[Contact](https://www.clamav.net/contact)" page on ClamAV.net.

## The last CVD update crashed my ClamAV installation. Why?

Before publishing a CVD update, we verify that it can be correctly loaded by the last two stable release series of ClamAV.

## The last CVD update detects a lot of false positives on my system. Why?

Before publishing a CVD update, we test it for false positives using the latest stable release of ClamAV. If you want to avoid problems with false positives, you must run the latest stable version of ClamAV.  Please stay tuned to our [EOL policy](faq-eol.md) for what versions are actively supported.

## I tried to submit a sample through the web interface, but it said the sample is already recognized by ClamAV. My ClamScan tells me it's not. I have already updated my database and ClamAV engine, what's wrong with my setup?

Please run ClamScan with the `--alert-broken` option. Also check that FreshClam and ClamScan are using the same path for storing/reading the database.

## I found an infected file in my HD/USB/mailbox, but ClamAV doesn't recognize it yet. Can you help me?

Our virus database is kept up to date with the help of the community. Whenever you find a new virus which is not detected by ClamAV you should [complete this form](https://www.clamav.net/reports/malware). The virusdb team will review your submission and update the database if necessary. Before submitting a new sample: - check that the value of `DatabaseDirectory`, in both `clamd.conf` and `freshclam.conf`, is the same - and update your database by running FreshClam to ensure you've scanned it with the latest virus database.

## I'm running ClamAV on a lot of clients on my local network. Can I serve the cvd files from a local server so that each client doesn't have to download them from your servers?

Sure, you can find more details on our [Private Local Mirror page](../appendix/CvdPrivateMirror.md).

1. If you want to take advantage of incremental updates, install a proxy server and then configure your FreshClam clients to use it (watch for the HTTPProxyServer parameter in `freshclam.conf`).

2. The second possible solution is to:

  * Configure a local webserver on one of your machines (say `machine1.mylan`)

  * Let FreshClam download the `*.cvd` files from [http://database.clamav.net](http://database.clamav.net) to the webserver's *DocumentRoot*.

  * Finally, change `freshclam.conf` on your clients so that it includes:

    ```ini
    DatabaseMirror machine1.mylan

    ScriptedUpdates off
    ```

    First the database will be downloaded to the local webserver and then the other clients on the network will update their copy of the database from it.

    _Important_:  For this to work, you have to add `ScriptedUpdates off` on all of your machines!

## I can't wait for you to update the database! I need to use the new signature NOW!

No problem, save your own signatures in a text file with the appropriate extension (see [our signature writing documentation](../manual/Signatures.md) for more information). Put the signature files in the same directory where the `.cvd` files are located. This is typically `/usr/local/share/clamav` or `/var/lib/clamav`. ClamAV will load it after the official `.cvd` files. You do not need to sign your custom database files.

## Can I download the virus database manually?

This practice is discouraged, please use either FreshClam or CVDUpdate to update your definitions.  Please check out our [FreshClam FAQ](faq-freshclam.md) and our [Private Mirror Documentation](../appendix/CvdPrivateMirror.md) for further information and links to CVDUpdate.

## I am getting error codes such as 403, 429, etc when FreshClam (or other update system) attempts to download updates

Are you attempting to download `safebrowsing.cvd` and getting a 403?  If so, [take a look at this blog post](https://blog.clamav.net/2021/04/are-you-still-attempting-to-download.html), otherwise check out our [Freshclam FAQ](faq-freshclam.md) under the section on "Error Codes".

----

For other questions regarding issues with FreshClam, see our [FreshClam Troubleshooting FAQ](faq-troubleshoot.md).
