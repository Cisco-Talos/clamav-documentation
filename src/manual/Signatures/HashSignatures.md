# File hash signatures

The easiest way to create signatures for ClamAV is to use filehash checksums, however this method can be only used against static malware.

## MD5 hash-based signatures

To create a MD5 signature for `test.exe` use the `--md5` option of
sigtool:

```bash
zolw@localhost:/tmp/test$ sigtool --md5 test.exe > test.hdb
zolw@localhost:/tmp/test$ cat test.hdb
48c4533230e1ae1c118c741c0db19dfb:17387:test.exe
```

That’s it! The signature is ready for use:

```bash
zolw@localhost:/tmp/test$ clamscan -d test.hdb test.exe
test.exe: test.exe FOUND

----------- SCAN SUMMARY -----------
Known viruses: 1
Scanned directories: 0
Engine version: 0.92.1
Scanned files: 1
Infected files: 1
Data scanned: 0.02 MB
Time: 0.024 sec (0 m 0 s)
```

You can change the name (by default sigtool uses the name of the file) and place it inside a `*.hdb` file. A single database file can include any number of signatures. To get them automatically loaded each time `clamscan`/`clamd` starts just copy the database file(s) into the local virus database directory (eg. `/usr/local/share/clamav`).

*The hash-based signatures shall not be used for text files, HTML and any other data that gets internally preprocessed before pattern matching. If you really want to use a hash signature in such a case, run `clamscan` with `--debug` and `--leave-temps` flags as described above and create a signature for a preprocessed file left in `/tmp`. Please keep in mind that a hash signature will stop matching as soon as a single byte changes in the target file.*

## SHA1 and SHA256 hash-based signatures

ClamAV 0.98 has also added support for SHA1 and SHA256 file checksums. The format is the same as for MD5 file checksum. It can differentiate between them based on the length of the hash string in the signature. For best backwards compatibility, these should be placed inside a `*.hsb` file. The format is:

```
HashString:FileSize:MalwareName
```

## Special hash-based signatures for PE files (Windows EXE, DLL, and SYS files)

### PE section based hash signatures

You can create a hash signature for a specific section in a PE file. Such signatures shall be stored inside `.mdb` (MD5) and `.msb` files in the following format:

```
PESectionSize:PESectionHash:MalwareName
```

Note that the order of `PESectionSize` and `PESectionHash` are essentially reversed from the `.hdb` signature format.

You can generate your own PE section hash signatures using `sigtool`:
```
sigtool --mdb /path/to/32bit/PE/file
```

```
❯ ./sigtool/sigtool --mdb ~/Downloads/ChromeSetup.exe
LibClamAV debug: cli_peheader: SizeOfHeader is not aligned to the SectionAlignment
LibClamAV debug: Section{0}: 83456:83620eda4d054fe35c19faaa89d515f3
LibClamAV debug: Section{1}: 28160:ebb39bf5679d566074c9666fd9548d22
LibClamAV debug: Section{2}: 2560:3cbd45b86866e61bd3cbd759aa40888d
LibClamAV debug: Section{3}: 1199616:6555d93d90a4642c9b3feb4bdb075ec1
LibClamAV debug: Section{4}: 4608:80335bb2fda8c0e537fcf4d0af14bc89
LibClamAV debug: hashtab: Freeing hashset, elements: 0, capacity: 0
LibClamAV debug: Cleaning up phishcheck
LibClamAV debug: Phishcheck cleaned up
```

ClamAV also has support for SHA1 and SHA256 section based signatures. The format is the same as for MD5 PE section based signatures. It can differentiate between them based on the length of the hash string in the signature. For best backwards compatibility, these should be placed inside a `*.msb` file.

> *Known issues*: 
> 
> Support for 64-bit PE files is missing at this time. You can create an section-hash signatures using sigtool. But as of 0.105, the parser stops processing 64bit PE files (PE32+ files) a little before it would try to match those hashes, so they will never alert.

### PE import table hash signatures (func. level 90)

You can create a hash signature for the import table in a PE file. Such signatures shall be stored inside `.imp` files in the following format:

```
PEImportTableHash:PEImportTableSize:MalwareName
```

Unlike with PE section hash signatures, the file format for PE import table hash signatures is essentially the same as HDB signatures.

Some example sigs:
```
f93b5d76132f6e6068946ec238813ce1:154:calc.exe
1ac946b228ebba41514c52672b33d623:140:calc64.exe
```

You can generate your own PE import table hash signatures using `sigtool`:
```
sigtool --imp /path/to/32bit/PE/file
```

The details will be in debug log output, like:
```
❯ ./sigtool/sigtool --imp ./unit_tests/input/clamav_hdb_scanfiles/clam.exe
LibClamAV debug: cli_peheader: SizeOfHeader is not aligned to the SectionAlignment
LibClamAV debug: Imphash: 98c88d882f01a3f6ac1e5f7dfd761624:39
LibClamAV debug: hashtab: Freeing hashset, elements: 0, capacity: 0
LibClamAV debug: Cleaning up phishcheck
LibClamAV debug: Phishcheck cleaned up
```

The hash is an MD5 hash. 

Unlike some signature features, you *may not* rely on the `clamscan` debug-log to provide imp-hashes. `clamscan` will only every log out the imp-hash info if you have one or more imp-hash sig loaded. If not, you won't see it.

Given the `Imphash:` line from the `sigtool` debug log, all that is left is to add a signature name. Like this:
```
98c88d882f01a3f6ac1e5f7dfd761624:39:clam.exe
```

> *Known issues*: 
> 
> Support for 64-bit PE files is missing at this time. You can create an imp-hash signatures using sigtool. But as of 0.105, the parser stops processing 64bit PE files (PE32+ files) a little before it would try to match those hashes, so they will never alert.
> 
> Support for `*`-wildcard import hash table sizes is broken in every release up through 0.105. The size field can technically be a wildcard using the `*`. But, because of a known issue with the all-match feature, the signature will only alert in all-match mode, which is not the default scanning mode.

## Hash signatures with unknown size

ClamAV 0.98 has also added support for hash signatures where the size is not known but the hash is. It is much more performance-efficient to use signatures with specific sizes, so be cautious when using this feature. For these cases, the ’\*’ character can be used in the size field. To ensure proper backwards compatibility with older versions of ClamAV, these signatures must have a minimum functional level of 73 or higher. Signatures that use the wildcard size without this level set will be rejected as malformed.

Sample .hsb signature matching any size:
```
HashString:*:MalwareName:73
```

Sample .msb signature matching any size:
```
*:PESectionHash:MalwareName:73
```
