# Safebrowsing  #

## About

[Google Safe Browsing](https://safebrowsing.google.com/) may be used to get advanced protection against emails with links to suspicious websites.

## Current Status

The Safe Browsing feature has now been spun off into a [related project](https://github.com/Cisco-Talos/clamav-safebrowsing).

ClamAV previously provided a "safebrowsing" signature database derived from Google's Safe Browsing API using our own account and API key. Due to changes to the terms of service, we can no longer provide the signature content for you. Users that desire Safe Browsing coverage for non-commercial purposes can still generate their own safebrowsing signature database using the clamav-safebrowsing tools with a Google Safe Browsing API key.

Briefly, clamav-safebrowsing tools are needed to:

1. Download the data from Google to a local MySQL database using Google's API [*];

2. Produce a local copy of the safebrowsing database file in a form suitable for use by the ClamAV tools;

You will have to decide how to distribute this database file to the systems which need it; and to notify any clamd daemons of the change so that they load the new signatures.

[*] For efficiency, the API permits downloading differences, in much the same way that ClamAV itself uses `.cdiff` files. The clamav-safebrowsing tool uses a MySQL database to store the Safe Browsing data so it can apply these differences the next time you use it.

For more information, please visit:

https://github.com/Cisco-Talos/clamav-safebrowsing


## History

ClamAV 0.95 introduced an optional "safebrowsing" signature database to provide advanced protection against emails with links to suspicious websites. This was generated using Google's Safe Browsing API.

The "safebrowsing" signature database which was distributed in the same way as the other ClamAV database files via the ClamAV mirror network. Downloading the database was disabled by default, and the feature was to be enabled only with extreme caution. In order to enable this feature it was necessary to add the option `SafeBrowsing Yes` to `freshclam.conf`.

As of Nov. 11, 2019, we stopped updating the "safebrowsing" signature database because Google announced changes to their Safe Browsing API terms of service. Google now requires commercial users to use the Google Web Risk API, a for-profit feature, instead of the Safe Browsing API. Though ClamAV itself is free and open-source, we cannot continue to provide Google Safe Browsing data to the general public.
