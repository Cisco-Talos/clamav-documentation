# Setting up a `clamav` service user account

If you're planning to run `freshclam` or `clamd` as a service on a Linux or Unix system, you should create a service account. The following instructions assume that you will use the an account named "clamav" for both services, although you may create a different account name for each if you wish.

## Create a service user account (and group)

### Linux / Unix

```sh
sudo groupadd clamav && \
sudo useradd -g clamav -s /bin/false -c "Clam Antivirus" clamav
```

If your operating system does not have the `groupadd` and `useradd` utilities, consult a system manual. **Don’t forget to lock access to the account!**

### macOS

Prep by identifying an unused group id (gid), and an unused user UniqueID.

This command will display all current group PrimaryGroupIDs:
```bash
dscl . list /Groups PrimaryGroupID | tr -s ' ' | sort -n -t ' ' -k2,2
```

This command will display all current user UniqueIDs:
```bash
dscl . list /Users UniqueID | tr -s ' ' | sort -n -t ' ' -k2,2
```

Then, these commands can be used to create the `clamav` group and `clamav` user.
```bash
sudo dscl . create /Groups/clamav
sudo dscl . create /Groups/clamav RealName "Clam Antivirus Group"
sudo dscl . create /Groups/clamav gid 799           # Ensure this is unique!
sudo dscl . create /Users/clamav
sudo dscl . create /Users/clamav RealName "Clam Antivirus User"
sudo dscl . create /Users/clamav UserShell /bin/false
sudo dscl . create /Users/clamav UniqueID 599       # Ensure this is unique!
sudo dscl . create /Users/clamav PrimaryGroupID 799 # Must match the above gid!
```

## About how the service accounts are used

At present, the behavior differs slightly between `clamd` and `freshclam`. When run as root:

- `freshclam` will always switch to run as the "DatabaseOwner" user account. The default account name is "clamav", or may be customized by specifying the "DatabaseOwner" setting in `freshclam.conf`.

- `clamd` will only switch to run as the "User" user account if the "User" setting is specified in `clamd.conf`. If you do not specify a "User" in the config, `clamd` will continue to run as the root user! We may change this behavior in a future version to prevent `clamd` from being run as root.

> _Caution_: We do not recommend running `clamd` as root for safety reasons because ClamAV scans untrusted files that may be _malware_. Always configure the "User" setting in `clamd.conf` if you plan to run `clamd` as a service.

On Unix/Linux systems, `freshclam` and `clamd` will switch to run as a different user if you start them as the root user, or using `sudo`. By default, that user account is named "clamav". The purpose is t

If you are running `freshclam` and `clamd` as root or with `sudo`, and you did not explicitly configure with `--disable-clamav`, you will want to ensure that the `DatabaseOwner` user specified in `freshclam.conf` owns the database directory so it can download signature updates.

The user that `clamd`, `clamdscan`, and `clamscan` run as may be the same user, but if it isn't -- it merely needs _read_ access to the database directory.

If you choose to use the default `clamav` user to run `freshclam` and `clamd`, you'll need to create the clamav group and the clamav user account the first time you install ClamAV.

## *After installation*: Make the service account own the database directory

After you've installed ClamAV, you will want to make it so that the database directory is owned by the same service account as you're using for `freshclam`.

For example:
```bash
sudo chown -R clamav:clamav /usr/local/share/clamav
```
