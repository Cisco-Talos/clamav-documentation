# How do I ignore a ClamAV signature?

## Creating an ignore file

Change Directory into the location where your ClamAV databases are stored.  Create a file called `ignore_list.ign2`, for example, like this:

`touch ignore_list.ign2`

## Ignore individual signatures

Place the signatures you'd like to ignore, each on it's own line, within the file `ignore_list.ign2`.

For example:

`Signature.Ignore-1`

`Signature.Ignore-2`
