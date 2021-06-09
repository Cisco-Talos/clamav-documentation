# Development Tips & Tricks

The following are a collection of tips that may help you be a more productive ClamAV developer.

- [Development Tips & Tricks](#development-tips--tricks)
  - [Downloading the Official Ruleset](#downloading-the-official-ruleset)
  - [General Debugging](#general-debugging)
    - [Useful clamscan Flags](#useful-clamscan-flags)
    - [Using gdb](#using-gdb)
  - [Hunting for Memory Leaks](#hunting-for-memory-leaks)

## Downloading the Official Ruleset

If you plan to use custom rules for testing, you can invoke `clamscan` via `./installed/bin/clamscan`, specifying your custom rule files via `-d` parameters.

If you want to download the official ruleset to use with `clamscan`, do the following:

1. Run `mkdir -p installed/share/clamav`
2. Comment out line 8 of etc/freshclam.conf.sample
3. Run `./installed/bin/freshclam --config-file etc/freshclam.conf.sample`

## General Debugging

NOTE: Some of the debugging/profiling tools mentioned in the sections below are specific to Linux

### Useful clamscan Flags

The following are useful flags to include when debugging clamscan:

- `--debug --verbose`: Print lots of helpful debug information

- `--gen-json`: Print some additional debug information in a JSON format

- `--statistics=pcre --statistics=bytecode`: Print execution statistics on any PCRE and bytecode rules that were evaluated

- `--dev-performance`: Print per-file statistics regarding how long scanning took and the times spent in various scanning stages

- `--alert-broken`: This will attempt to detect broken executable files. If an executable is determined to be broken, some functionality might not get invoked for the sample, and this could be an indication of an issue parsing the PE header or file. This causes those binary to generate an alert instead of just continuing on. This flag replaces the `--detect-broken` flag from releases prior to 0.101.

- `--max-filesize=2000M --max-scansize=2000M --max-files=2000000 --max-recursion=2000000 --max-embeddedpe=2000M --max-htmlnormalize=2000000 --max-htmlnotags=2000000 --max-scriptnormalize=2000000 --max-ziptypercg=2000000 --max-partitions=2000000 --max-iconspe=2000000 --max-rechwp3=2000000 --pcre-match-limit=2000000 --pcre-recmatch-limit=2000000 --pcre-max-filesize=2000M --max-scantime=2000000`:

  Effectively disables all file limits and maximums for scanning. This is useful if you'd like to ensure that all files in a set get scanned, and would prefer clam to just run slowly or crash rather than skip a file because it encounters one of these thresholds

The following are useful flags to include when debugging rules that you're
writing:

- `-d`: Allows you to specify a custom ClamAV rule file from the command line

- `--bytecode-unsigned`: If you are testing custom bytecode rules, you'll need this flag so that `clamscan` actually runs the bytecode signature

- `--all-match`: Allows multiple signatures to match on a file being scanned

- `--leave-temps --tmpdir=/tmp`: By default, ClamAV will attempt to extract embedded files that it finds, normalize certain text files before looking for matches, and unpack packed executables that it has unpacking support for. These flags tell ClamAV to write these intermediate files out to the directory specified. Usually when a file is written, it will mention the file name in the --debug output, so you can have some idea at what stage in the scanning process a tmp file was created.

- `--dump-certs`: For signed PE files that match a rule, display information about the certificates stored within the binary.
  > _Note_: sigtool has this functionality as well and doesn't require a rule match to view the cert data

### Using gdb

Given that you might want to pass a lot of arguments to `gdb`, consider taking advantage of the `--args` parameter. For example:

```bash
gdb --args ./installed/bin/clamscan -d /tmp/test.ldb -d /tmp/block_list.crb -d --dumpcerts --debug --verbose --max-filesize=2000M --max-scansize=2000M --max-files=2000000 --max-recursion=2000000 --max-embeddedpe=2000M --max-iconspe=2000000 f8f101166fec5785b4e240e4b9e748fb6c14fdc3cd7815d74205fc59ce121515
```

When using ClamAV without libclamav statically linked, if you set breakpoints on libclamav functions by name, you'll need to make sure to indicate that the breakpoints should be resolved after libraries have been loaded.

For other documentation about how to use `gdb`, check out the following resources:

- [A Guide to gdb](http://www.cabrillo.edu/~shodges/cs19/progs/guide_to_gdb_1.1.pdf)
- [gdb Quick Reference](http://users.ece.utexas.edu/~adnan/gdb-refcard.pdf)

## Hunting for Memory Leaks

You can easily hunt for memory leaks with valgrind. Check out this guide to get started: [Valgrind Quick Start](http://valgrind.org/docs/manual/quick-start.html)

If checking for leaks, be sure to run `clamscan` with samples that will hit as many of the unique code paths in the code you are testing. An example invocation is as follows:

```bash
valgrind --leak-check=full ./installed/bin/clamscan -d /tmp/test.ldb --leave-temps --tempdir /tmp/test --debug --verbose /tmp/upx-samples/ > /tmp/upx-results-2.txt 2>&1
```

Alternatively, on Linux, you can use glibc's built-in leak checking functionality:

```bash
MALLOC_CHECK_=7 ./installed/bin/clamscan
```

See the [mallopt man page](http://manpages.ubuntu.com/manpages/trusty/man3/mallopt.3.html) for more details
