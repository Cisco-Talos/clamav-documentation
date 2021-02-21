# Private Local Mirrors

There are some situations in which it may be desirable to set up a private mirror for distributing CVD updates.

If you run ClamAV on many clients on your network, each installation will download a copy of new .cdiff files. This is a waste of bandwidth and resources for your network and for our mirrors network.

Sometimes the servers which perform the scan are not directly connected to Internet and can only download updates from a server in the same network segment.

For people who face these problems, we recommend using one of the following 3 setups.

## 1. Use an HTTP proxy

This solution is really easy to implement and is bandwidth efficient.

Install a proxy server (e.g. squid) and then tell your freshclam clients to use it. This can be done by setting the _HTTPProxyServer_ parameter in _freshclam.conf_ (see man 5 freshclam.conf for the details).

## 2. Serve CVD files from a local web server

This solution is really simple to implement but it's only effective if your clients are all on the same local network and bandwidth is not an issue for you.

Configure a local webserver on one of your machines (say `machine1.mylan`) and let freshclam download the `*.cvd` files from http://database.clamav.net to the webserver’s *DocumentRoot*.

Add the following line to `freshclam.conf` on `machine1.mylan`:

`ScriptedUpdates no`

First the database will be downloaded to the local webserver and then the other clients on the network will update their copy of the database from it. For this to work you have to change _freshclam.conf_ on each client so that it reads

`PrivateMirror machine1.mylan`

`ScriptedUpdates no`

## 3. Serve CVD and CDIFF files from a local web server

This solution is bandwidth efficient but it's a little bit trickier to set up and involves the use of custom scripts in place of freshclam.

Because of this, the scripts might need to be updated from time to time to cope with the corresponding changes in freshclam.

Configure a local webserver on one of your machines (say `machine1.mylan`) and use this script developed by Frederic Vanden Poel to download the `cvd` and `cdiff` files into the *DocumentRoot*.

`clamdownloader.pl` by *Frederic Vanden Poel*:

```bash
    #!/usr/bin/env perl
    #
    # File name: clamdownloader.pl
    # Author:    Frederic Vanden Poel
    #
    #############################################################################
    #
    use strict;
    use warnings;

    use Net::DNS;
    my $clamdb="/tmp/clam";
    # mirror where files such as daily-12133.cdiff exist
    my $mirror="http://database.clamav.net";

    # get the TXT record for current.cvd.clamav.net
    my $txt = getTXT("current.cvd.clamav.net");

    exit unless $txt;

    chdir($clamdb) || die ("Can't chdir to $clamdb : $!\n");

    # dump the record in a file
    print "TXT from DNS: $txt\n";
    open D, ">dns.txt";
    print D "$txt";
    close D;

    # temp dir for wget updates
    mkdir("$clamdb/temp");

    # get what we need
    my ( $clamv, $mainv , $dailyv, $x, $y, $z, $safebrowsingv, $bytecodev ) = split /:/, $txt ;

    print "FIELDS main=$mainv daily=$dailyv bytecode=$bytecodev\n";

    updateFile('main',$mainv);
    updateFile('daily',$dailyv);
    updateFile('bytecode',$bytecodev);

    sub getTXT {
      use Net::DNS;
      my $domain = shift @_;
      my $rr;
      my $res = Net::DNS::Resolver->new;
      my $txt_query = $res->query($domain,"TXT");
      if ($txt_query) {
      return ($txt_query->answer)[0]->txtdata;
      } else {
        warn "Unable to get TXT Record : ", $res->errorstring, "\n";
        return 0;
      }
    }

    sub getLocalVersion {
      my $file=shift @_;
      my $cmd="sigtool -i $clamdb/$file.cvd";
      open P, "$cmd |" || die("Can't run $cmd : $!");
      while (&lt;P&gt;) {
        next unless /Version: (\d+)/;
        return $1;
      }
      return -1;
    }

    sub updateFile {
      my $file=shift @_;
      my $currentversion=shift @_;
      my $old=0;
      if  ( ! -e "$file.cvd" ) {
        warn "file $file.cvd does not exists, skipping\n";
      }
      if  ( ! -z "$file.cvd" ) {
        $old = getLocalVersion($file);
        if ( $old > 0 ) {
          print "$file old: $old current: $currentversion\n";
           # mirror all the diffs
           for (my $count = $old + 1 ; $count <= $currentversion; $count++) {
             print `wget -nH -nd -N -nv $mirror/$file-$count.cdiff 2>&1`;
          }
        } else {
           warn "file $file.cvd version unknown, skipping cdiffs\n";
        }
      } else {
        warn "file $file.cvd is zero, skipping cdiffs\n";
      }

    return if ( $currentversion == $old );

    # update the full file using a copy, then move back
    print `cp -v -a $file.cvd temp/$file.cvd 2>&1`;
    print `cd temp && wget -nH -nd -N -nv $mirror/$file.cvd 2>&1`;
    if  ( -e "temp/$file.cvd" && ! -z "temp/$file.cvd" ) {
      if ( (stat("temp/$file.cvd"))[9] > (stat("$file.cvd"))[9] ) {
        print "file temp/$file.cvd is newer than $file.cvd\n";
        print `mv -v temp/$file.cvd $file.cvd 2>&1`;
      } else {
        print "file temp/$file.cvd not touched by wget\n";
        print `rm -v temp/$file.cvd`;
      }
    } else {
      warn "temp/$file.cvd is not valid, not copying back !\n";
      unlink "temp/$file.cvd";
      }
    }
    __END__
```

First the `cvd` and `cdiff` files will be downloaded to the local webserver and then the other clients on the network will update their copy of the database from it. For this to work you have to change `freshclam.conf` on your clients so that it reads:

```bash
    DatabaseMirror machine1.mylan
```

## 4. Serving a private mirror from Cloud Foundry

This solution isn't necessarily bandwidth efficient, but very easy to deploy with pre-existing Cloud Foundry deployments. In a nutshell, it downloads the CVDs and stores them in-memory to serve them as an uber-fast mirror. While it is storing definitions in-memory, if the app is restarted/rebooted, it will reach out and re-download the CVDs. You can find the app [here on Github](https://github.com/mxplusb/clamav), as well as instructions on how to push it to Cloud Foundry. The URL the app is configured with is where the ClamAV daemons can listen from.
