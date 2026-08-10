# Using YARA rules in ClamAV

ClamAV can process YARA rules. ClamAV virus database file names ending with `.yar` or `.yara` are parsed as YARA rule files. The link to the YARA rule grammar documentation may be found at <https://virustotal.github.io/yara/>. There are currently a few limitations on using YARA rules within ClamAV:

- YARA modules are not yet supported by ClamAV. This includes the “import” keyword and any YARA module-specific keywords.

- Global rules (`global` keyword) are not supported by ClamAV.

- External variables(`contains` and `matches` keywords) are not supported.

- YARA rules pre-compiled with the `yarac` command are not supported.

- As in the ClamAV logical and extended signature formats, YARA strings and segments of strings separated by wild cards must represent at least two octets of data.

- There is a maximum of 64 strings per YARA rule.

- YARA rules in ClamAV must contain at least one literal, hexadecimal, or regular expression string.

In addition, there are a few more ClamAV processing modes that may affect the outcome of YARA rules.

- *File decomposition and decompression* - Since ClamAV uses file decomposition and decompression to find viruses within de-archived and uncompressed inner files, YARA rules executed by ClamAV will match against these files as well.

- *Normalization* - By default, ClamAV normalizes HTML, JavaScript, and ASCII text files. YARA rules in ClamAV will match against the normalized result. The effects of normalization of these file types may be captured using `clamscan --leave-temps --tempdir=mytempdir`. YARA rules may then be written using the normalized file(s) found in `mytempdir`. Alternatively, starting with ClamAV 0.100.0, `clamscan --normalize=no` will prevent normalization and only scan the raw file. To obtain similar behavior prior to 0.99.2, use `clamscan --scan-html=no`. The corresponding parameters for clamd.conf are `Normalize` and `ScanHTML`.

- *YARA conditions driven by string matches* - All YARA conditions are driven by string matches in ClamAV. This saves from executing every YARA rule on every file. Any YARA condition may be augmented with a string match clause which is always true, such as:

```perl
rule CheckFileSize
{
  strings:
    $abc = "abc"
  condition:
    ($abc or not $abc) and filesize < 200KB
}
```

This will ensure that the YARA condition always performs the desired action (checking the file size in this example).

## YARA Hexadecimal String Negation

ClamAV supports YARA 4.3-style hexadecimal byte and nibble negation in hex strings (ClamAV 1.6+, functionality level 240). This allows matching any byte *except* a specific value or nibble pattern within a hex string pattern.

### Supported Forms

- `~HH`: Match any byte except `0xHH`. Example: `{ 41 ~00 42 }` matches `41` followed by any byte except `0x00`, followed by `42`.
- `~H?`: Match any byte whose high nibble is not `H`. Example: `{ 41 ~0? 42 }` matches `41` followed by any byte where the high nibble is not `0x0`, followed by `42`.
- `~?H`: Match any byte whose low nibble is not `H`. Example: `{ 41 ~?0 42 }` matches `41` followed by any byte where the low nibble is not `0x0`, followed by `42`.

### Invalid Forms

The following forms are not supported and will be rejected with a parser error:

- `~~00` (double negation)
- `~??` (negating all bytes)
- `~` without hex digits
- `~( AA | BB )` (negation combined with alternates)
- `~[1-2]` (negation combined with gap ranges)
- `~` before character classes

### Distinction from YARA Condition Bitwise-NOT

**Important:** YARA hex string negation (`~HH`, `~H?`, `~?H`) is **not** the same as the bitwise-NOT operator (`~`) in YARA conditions:
- Hex string negation operates inside hex strings and matches one byte with a negated value/pattern predicate.
- Condition bitwise-NOT (`~ primary_expression`) is an integer operator in YARA condition expressions and performs bitwise negation of condition values.

Example to illustrate the difference:

```perl
rule HexNegationExample
{
  strings:
    $hex = { 41 ~00 42 }      // Hex string negation: match 41, any byte except 00, and 42
  condition:
    $hex
}

rule ConditionNegationExample
{
  strings:
    $marker = "example"

  condition:
    $marker and (~1 == -2)    // Condition bitwise-NOT: bitwise negation of integer 1 equals -2
}
```
