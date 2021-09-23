# Private Local Mirrors

There are some situations in which it may be desirable to set up a private mirror for distributing ClamAV databases.

If you run ClamAV on many clients on your network, each new installation will download a copy of the database files. This is a waste of bandwidth and resources for your network and for our mirrors network.

Sometimes the servers which perform the scan are not directly connected to Internet and can only download updates from a server in the same network segment.

For people who face these problems, we recommend using one of the following solutions:
  - [Use `cvdupdate` to serve whole databases and database patch files from a private mirror](#use-cvdupdate-to-serve-whole-databases-and-database-patch-files-from-a-private-mirror)
  - [Use `freshclam` to serve only whole database files from a private mirror](#use-freshclam-to-serve-only-whole-database-files-from-a-private-mirror)
  - [Use an HTTP proxy](#use-an-http-proxy)

## Use `cvdupdate` to serve whole databases and database patch files from a private mirror

You may use a tool named `cvdupdate` on a private mirror to maintain the latest CVD databases *and* CDIFF patch files.

This solution will allow you to host a mirror that functions in the same way as the official database CDN, serving CVD and CDIFF files. This means that your downstream `freshclam` clients will be able to update using the CDIFF patch files, which should save some bandwidth between your private mirror and your clients.

These instructions use a tool named [cvdupdate](https://github.com/Cisco-Talos/cvdupdate). `cvdupdate` requires:

- Python 3.6 or newer.
- An internet connection with DNS enabled.
- It should work fine on Linux/Unix and on Windows.

**IMPORTANT**: Please do NOT use `cvdupdate` if you don't need to host a private database mirror. `freshclam` is far more efficient, even for a small cluster of installs, because it will update with CDIFF patches after the initial database downloads. `cvdupdate`, on the otherhand, will download both the new daily CDIFF *and* the daily CVD every day.

You can easily install `cvdupdate` using Python 3's Pip package manager:
```bash
pip3 install cvdupdate
```

(optional) Once installed, you may wish to configure where the databases are stored:
```bash
cvd config set --dbdir <your www path>
```

Now run this as often as you need, or at least once a day to download/update the databases:
```bash
cvd update
```

You may wish to [set up a `cron` job](https://github.com/Cisco-Talos/cvdupdate#cron-example) to check for updates.

If you didn't set a custom database path, the databases will be stored in `~/.cvdupdate/database`

> _Tip_: You can use `--help` with any `cvd` command to learn more. For ore detailed instructions, or to report issues, please visit: https://github.com/Cisco-Talos/cvdupdate](https://github.com/Cisco-Talos/cvdupdate)

Once you have the database files, host them with your favorite webserver, or use the `cvd serve` test-webserver (not intended for production).

Next, you'll need to configure the `freshclam` clients so they'll update from your private mirror.

For `freshclam.conf` on your downstream `freshclam` clients, set:
```ini
# Replace `mirror.mylan` and `8000` with your domain and port number.
DatabaseMirror http://mirror.mylan:8000
```

You may wish to set up a proxy to enable HTTPS. If you do, you can specify `https` instead of `http`:
```ini
DatabaseMirror https://mirror.mylan
```

You could also host the files in a subdirectory. E.g.:
```ini
DatabaseMirror http://mirror.mylan:8000/clamav
```

When you run `freshclam` on your client machines, they will still use a DNS query to clamav.net to find out if there should be an update before attempting to update from your private server. If your `freshclam` clients attempt to update before your private mirror updates, that's okay. The `freshclam` clients will tolerate being 1 version behind what was advertised on clamav.net.

> _Tip_: If the `freshclam` clients will not have access to the internet to perform that DNS lookup, you may wish to set `DNSDatabaseInfo no` in your `freshclam.conf` file. `freshclam` may complain that the DNS lookup to "no" failed, which is fine. It will fall-back to checking the database version using an HTTP Range-request to your server.

> _CAUTION_: If your `freshclam` clients cannot use DNS to check if there is an update, be certain that your private mirror's webserver supports HTTP Range-requests, or else it may serve the ENTIRE database CVD file when a `freshclam` client means to check if a newer version exists, and not just a small portion containing the database version.
>
> The Python `simple.http` server does _NOT_ support HTTP Range requests.

## Use `freshclam` to serve only whole database files from a private mirror

You may use `freshclam` on a private mirror to maintain the latest CVD or CLD databases.

The `freshclam` program running on your private mirror will update using the CDIFF patch files. When you update a CVD database with ClamAV's CDIFF patching process, it produces a CLD "local" database. With this solution for hosting a private mirror, you will serve those CVD or CLD databases to downstream `freshclam` clients. Unlike when using `cvdupdate`, this option will not allow you to serve CDIFF patch files.

> _Tip_: This method may be best if your public IP address is shared with other clients. At present we rate-limit CVD downloads by IP address. So if your public IP address is used by others, `cvdupdate` may be rate-limited when it attempts to download `daily.cvd`. But `freshclam` should never be rate limited for attempting to download the lateset CDIFF patch file.

This solution is simple to implement. But because you will not be serving CDIFF patch files, it is only effective if your clients are all on the same local network or if bandwidth between your private mirror and your clients is not an issue for you.

To get started, configure a local webserver on one of your machines (say `mirror.mylan`). Set up `freshclam` on that server so it downloads the database files from http://database.clamav.net and stores them in your webserver’s *DocumentRoot* directory.

For `freshclam.conf` on your private mirror, set:
```ini
# The private mirror will update from database.clamav.net.
DatabaseMirror database.clamav.net

# Customize the DatabaseDirectory so that FreshClam will update the DocumentRoot.
DatabaseDirectory /your/server/www

# Enable CLD compression to save bandwidth between your mirror and your clients.
CompressLocalDatabase yes
```

Set up `freshclam` to run as a service or in a cron job so that your private mirror always serves the latest databases.

Next, you'll need to configure the `freshclam` clients so they'll update from your private mirror.

For `freshclam.conf` on your downstream `freshclam` clients, set:
```ini
# PrivateMirror is used instead of DatabaseMirror so that FreshClam will:
# 1. Accept CVD or CLD files, not just CVD files.
# 2. Use an HTTP Range-request to check if there is an update, rather than DNS.
PrivateMirror http://mirror.mylan:8000

# ScriptedUpdates is needed because you won't be serving CDIFF files.
ScriptedUpdates no
```

When you run `freshclam` on your client machines, they should check for updates from your private server over HTTP by downloading just the database header`*`. If there is a new version, the client will download the whole CVD or CLD file from your private server to update.

> `*`_Important_: Make sure your HTTP server will accept and handle HTTP Range requests. If yours does not, then each time a client checks for an update it will download the whole database!
>
> The Python `simple.http` server does _NOT_ support HTTP Range requests.

## Use an HTTP proxy

This solution is really easy to implement and is bandwidth efficient.

Install a proxy server that supports caching files (e.g. squid) and then tell your `freshclam` clients to use it. This can be done by setting the _HTTPProxyServer_ parameter in _freshclam.conf_ (see `man 5 freshclam.conf` for the details).
