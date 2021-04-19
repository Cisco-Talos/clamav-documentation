# Private Local Mirrors

There are some situations in which it may be desirable to set up a private mirror for distributing CVD updates.

If you run ClamAV on many clients on your network, each installation will download a copy of new .cdiff files. This is a waste of bandwidth and resources for your network and for our mirrors network.

Sometimes the servers which perform the scan are not directly connected to Internet and can only download updates from a server in the same network segment.

For people who face these problems, we recommend using one of the following 3 setups.

## 1. Use an HTTP proxy

This solution is really easy to implement and is bandwidth efficient.

Install a proxy server (e.g. squid) and then tell your FreshClam clients to use it. This can be done by setting the _HTTPProxyServer_ parameter in _freshclam.conf_ (see `man 5 freshclam.conf` for the details).

## 2. Serve CVD files from a local web server

This solution is really simple to implement but it's only effective if your clients are all on the same local network and bandwidth is not an issue for you.

Configure a local webserver on one of your machines (say `machine1.mylan`) and let FreshClam download the `*.cvd` files from http://database.clamav.net to the webserver’s *DocumentRoot*.

Add the following line to `freshclam.conf` on `machine1.mylan`:

`ScriptedUpdates no`

First the database will be downloaded to the local webserver and then the other clients on the network will update their copy of the database from it. For this to work you have to change _freshclam.conf_ on each client so that it reads

`PrivateMirror machine1.mylan`

`ScriptedUpdates no`

## 3. Serve CVD and CDIFF files from a local web server

This solution will be more bandwidth efficient for you. It will allow you to host a mirror that functions in the same way as the official database CDN, serving CVD and CDIFF files.

These instructions use a tool named [cvdupdate](https://github.com/Cisco-Talos/cvdupdate). `cvdupdate` requires:

- Python 3.6 or newer.
- An internet connection with DNS enabled.
- It should work fine on Linux/Unix and on Windows.

**IMPORTANT**: Please do NOT use [cvdupdate](https://github.com/Cisco-Talos/cvdupdate) if you don't need to host a private database mirror. FreshClam is far more efficient, even for a small cluster of installs, because it will update with CDIFF patches after the initial database downloads.

You can easily install `cvdupdate` Python3's Pip package manager:

`pip3 install cvdupdate`

(optional) Once installed, you may wish to configure where the databases are stored:

`cvd config set --dbdir <your www path>`

Now run this as often as you need, or at least once a day to download/update the databases:

`cvd update`

If you didn't set a custom database path, the databases will be stored in `~/.cvdupdate/database`

You can use `--help` with any `cvd` command to learn more. For ore detailed instructions, or to report issues, please visit: https://github.com/Cisco-Talos/cvdupdate](https://github.com/Cisco-Talos/cvdupdate)

Once you have the database files, host them with your favorite webserver, or use the `cvd serve` test-webserver (not intended for production).

Set up your FreshClam clients' `freshclam.conf` config file to point to:

`DatabaseMirror http://machine1.mylan`

You may wish to set up a proxy to enable HTTPS. If you do, use:

`DatabaseMirror https://machine1.mylan`

## 4. Serving a private mirror from Cloud Foundry

This solution isn't necessarily bandwidth efficient, but very easy to deploy with pre-existing Cloud Foundry deployments. In a nutshell, it downloads the CVDs and stores them in-memory to serve them as an uber-fast mirror. While it is storing definitions in-memory, if the app is restarted/rebooted, it will reach out and re-download the CVDs. You can find the app [here on Github](https://github.com/mxplusb/clamav), as well as instructions on how to push it to Cloud Foundry. The URL the app is configured with is where the ClamAV daemons can listen from.
