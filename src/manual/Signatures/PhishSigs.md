# Phishing Signatures

ClamAV can detect HTML links that look suspicious when the display text is a URL that is a different domain than than in the actual URL. Unfortunately, it is pretty common for a company to contract out web services and to use HTML link display text to make it look like it is a link to the company website. Because this practice is commonplace, ClamAV only does phishing checks for specific websites that are popularly targeted by phishing campaigns. Signatures to identify domains that should be monitored for phishing attempts are listed in ClamAV `PDB` database files, such as `daily.pdb`, a file found in the `daily.cvd` archive. 

Unfortunately, many websites listed in the `PDB` phishing database also send emails with links that display a different domain than is in the actual link. To mitigate false positive detections in non-malicious links, ClamAV has allow list signatures in ClamAV `WDB` database files, such as `daily.wdb`, another file found in the `daily.cvd` archive. 

To help you identify what triggered a heuristic phishing alert, `clamscan` or `clamd` will print a message indicating the "Display URL" and "Real URL" involved in a heuristic phishing alert. 

For example, suppose that `amazon.com` were listed in ClamAV's loaded PDB database, you might observe this message before the alert when scanning an email with a link that claims to be for `https://www.amazon.com/` but is in fact linking to `https://someshadywebsite.example.com/`:

```
LibClamAV info: Suspicious link found!
LibClamAV info:   Real URL:    https://someshadywebsite.example.com
LibClamAV info:   Display URL: https://www.amazon.com
/path/to/suspicious/email.eml: Heuristics.Phishing.Email.SpoofedDomain FOUND
```

Table of Contents
- [Phishing Signatures](#phishing-signatures)
  - [Database file format](#database-file-format)
    - [PDB format](#pdb-format)
    - [GDB format](#gdb-format)
    - [WDB format](#wdb-format)
    - [Hints](#hints)
    - [Examples of PDB signatures](#examples-of-pdb-signatures)
    - [Examples of WDB signatures](#examples-of-wdb-signatures)
    - [Example for how the URL extractor works](#example-for-how-the-url-extractor-works)
    - [How matching works](#how-matching-works)
      - [RealURL, DisplayedURL concatenation](#realurl-displayedurl-concatenation)
      - [What happens when a match is found](#what-happens-when-a-match-is-found)
      - [Extraction of `RealURL`, `DisplayedURL` from HTML tags](#extraction-of-realurl-displayedurl-from-html-tags)
      - [Example](#example)
    - [Simple patterns](#simple-patterns)
    - [Regular expressions](#regular-expressions)
    - [Flags](#flags)
  - [Introduction to regular expressions](#introduction-to-regular-expressions)
    - [Special characters](#special-characters)
    - [Character classes](#character-classes)
    - [Escaping](#escaping)
    - [Alternation](#alternation)
    - [Optional matching, and repetition](#optional-matching-and-repetition)
    - [Groups](#groups)
  - [How to create database files](#how-to-create-database-files)
    - [How to create and maintain the allow list (daily.wdb)](#how-to-create-and-maintain-the-allow-list-dailywdb)
    - [How to create and maintain the domain list (daily.pdb)](#how-to-create-and-maintain-the-domain-list-dailypdb)
    - [Dealing with false positives, and undetected phishing mails](#dealing-with-false-positives-and-undetected-phishing-mails)
      - [False positives](#false-positives)
      - [Undetected phish mails](#undetected-phish-mails)

## Database file format

### PDB format

This file contains urls/hosts that should be monitored for phishing attempts.
It contains lines in the following format:

```
R:DisplayedURL[:FuncLevelSpec]
H:DisplayedHostname[:FuncLevelSpec]
```

- `R`

  Regular expression, for the concatenated URL. The last 3 characters of the regular expression cannot regex special characters and much be an exact match.

- `H`

  Matches the `DisplayedHostname` as a simple pattern (literally, no regular expression).

  - The pattern can match either the full hostname.

  - Or a subdomain of the specified hostname.

  - To avoid false matches in case of subdomain matches, the engine checks that there is a dot(`.`) or a space(` `) before the matched portion.

- `RealURL`

  Is the URL the user is sent to, example: `href` attribute of an html anchor (`<a>` tag).

- `DisplayedURL`

  Is the URL description displayed to the user, where its *claimed* they are sent, example: contents of an html anchor (`<a>` tag).

- `DisplayedHostname`

  Is the hostname portion of the `DisplayedURL`.

- `FuncLevelSpec`

  An (optional) functionality level, 2 formats are possible:

  - `minlevel` all engines having functionality level `>= minlevel` will load this line.

  - `minlevel-maxlevel` engines with functionality level `>= minlevel`, and `< maxlevel` will load this line.

### GDB format

This file contains URL hashes in the following format:

```
S:P:HostPrefix[:FuncLevelSpec]
S:F:Sha256hash[:FuncLevelSpec]
S1:P:HostPrefix[:FuncLevelSpec]
S1:F:Sha256hash[:FuncLevelSpec]
S2:P:HostPrefix[:FuncLevelSpec]
S2:F:Sha256hash[:FuncLevelSpec]
S:W:Sha256hash[:FuncLevelSpec]
```

- `S:`

  These are hashes for Google Safe Browsing - malware sites, and should not be used for other purposes.

- `S2:`

  These are hashes for Google Safe Browsing - phishing sites, and should not be used for other purposes.

- `S1:`

  Hashes for blocking phishing sites. Virus name: `Phishing.URL.Blocked`.

- `S:W:`

  Locally allowed hashes.

- `HostPrefix`

  4-byte prefix of the sha256 hash of the last 2 or 3 components of the hostname. If prefix doesn’t match, no further lookups are performed.

- `Sha256hash`

  sha256 hash of the canonicalized URL, or a sha256 hash of its prefix/suffix according to the Google Safe Browsing “Performing Lookups” rules. There should be a corresponding `:P:HostkeyPrefix` entry for the hash to be taken into consideration.

To see which hash/URL matched, look at the `clamscan --debug` output, and look for the following strings: `Looking up hash`, `prefix matched`, and `Hash matched`. To ignore .gdb entries, create a local.gdb file, and adding a line `S:W:<HASH>`.

### WDB format

This file contains url pairs for links that may look suspicious but are safe and should be allowed. It contains lines in the following format:

```
X:RealURL:DisplayedURL[:FuncLevelSpec]
M:RealHostname:DisplayedHostname[:FuncLevelSpec]
```

- `X`

  Regular expression, for the *entire URL*, not just the hostname.

  - The regular expression is by default anchored to start-of-line and end-of-line, as if you have used `^RegularExpression$`

  - A trailing `/` is automatically added both to the regex, and the input string to avoid false matches.

  - The regular expression matches the *concatenation* of the `RealURL`, a colon(`:`), and the `DisplayedURL` as a single string. It doesn’t separately match `RealURL` and `DisplayedURL`!

  - The last 3 characters of the regular expression cannot regex special characters and much be an exact match.

- `M`

  Matches hostname, or subdomain of it, see notes for H above.

### Hints

- Empty lines are ignored

- The colons are mandatory

- Don’t leave extra spaces on the end of a line!

- If any of the lines don’t conform to this format, ClamAV will abort with a Malformed Database Error

- See section [Extraction-of-RealURL](#Extraction-of-RealURL,-DisplayedURL-from-HTML-tags) for more details on `RealURL`/`DisplayedURL`

### Examples of PDB signatures

To check for phishing mails that target `amazon.com`, or subdomains of `amazon.com`:

```
H:amazon.com
```

To do the same, but for `amazon.co.uk`:

```
H:amazon.co.uk
```

Alternatively, you could use a regex PDB signature to check both:

```
R:.+\.amazon\.(com|co\.uk)([/?].*)?
```

You can limit the signatures to certain [engine versions](../../appendix/FunctionalityLevels.md). For example...

1. Restrict so that engine versions 20 through 30 can load it, but not 31+:
    ```
    H:amazon.co.uk:20-30
    ```

2. Restrict so that engine versions `>= 20` can load it:
    ```
    H:amazon.co.uk:20-
    ```

3. Restrict so that engine versions `<= 20` can load it:
    ```
    H:amazon.co.uk:0-20
    ```

In a real situation, you’d probably use the second form. A situation like that would be if you are using a feature of the signatures not available in earlier versions, or if earlier versions have bugs with your signature. Its neither case here, the above examples are for illustrative purposes only.

### Examples of WDB signatures

To allow Amazon’s country specific domains and `amazon.com`, to mix domain names in `DisplayedURL`, and `RealURL`:

```
X:.+\.amazon\.(at|ca|co\.uk|co\.jp|de|fr)([/?].*)?:.+\.amazon\.com([/?].*)?:17-
```

Explanation of this signature:

- `X:`

  this is a regular expression

- `:17-`

  load signature only for engines with [functionality level](../../appendix/FunctionalityLevels.md) >= 17

The regular expression is the following (`X:`, `:17-` stripped, and a `/` appended)

```
.+\.amazon\.(at|ca|co\.uk|co\.jp|de|fr)([/?].*)?:.+\.amazon\.com([/?].*)?/
```

Explanation of this regular expression (note that it is a single regular expression, and not 2 regular expressions splitted at the `:`).

- `.+`

  any subdomain of

- `\.amazon\.`

  domain we are allowing (`RealURL` part)

- `(at|ca|co\.uk|co\.jp|de|fr)`

  country-domains: at, ca, co.uk, co.jp, de, fr

- `([/?].*)?`

  recomended way to end the real-url, this protects against embedded URLs (`evilurl.example.com/amazon.co.uk/`)

- `:`

  `RealURL` and `DisplayedURL` are concatenated via a `:`, so match a literal `:` here

- `.+`

  any subdomain of

- `\.amazon\.com`

  allowed `DisplayedURL`

- `([/?].*)?`

  recommended way to end displayed url part, to protect against embedded URLs

- `/`

  automatically added to further protect against embedded URLs

When you add an entry, make sure you check that both domains are owned by the same entity. This signature allows links claiming to point to amazon.com (`DisplayedURL`), when in fact they really go to a country-specific domain of amazon (`RealURL`).

### Example for how the URL extractor works

Consider the following HTML file:

```html
<html>
<a href="http://1.realurl.example.com/">
  1.displayedurl.example.com
</a>
<a href="http://2.realurl.example.com">
  2 d<b>i<p>splayedurl.e</b>xa<i>mple.com
</a>
<a href="http://3.realurl.example.com">
  3.nested.example.com
  <a href="http://4.realurl.example.com">
    4.displayedurl.example.com
  </a>
</a>
<form action="http://5.realurl.example.com">
  sometext
  <img src="http://5.displayedurl.example.com/img0.gif"/>
  <a href="http://5.form.nested.displayedurl.example.com">
    5.form.nested.link-displayedurl.example.com
  </a>
</form>
<a href="http://6.realurl.example.com">
  6.displ
  <img src="6.displayedurl.example.com/img1.gif"/>
  ayedurl.example.com
</a>
<a href="http://7.realurl.example.com">
  <iframe src="http://7.displayedurl.example.com">
</a>
```

The phishing engine extract the following
`RealURL`/`DisplayedURL` pairs from it:

```
http://1.realurl.example.com/
1.displayedurl.example.com

http://2.realurl.example.com
2displayedurl.example.com

http://3.realurl.example.com
3.nested.example.com

http://4.realurl.example.com
4.displayedurl.example.com

http://5.realurl.example.com
http://5.displayedurl.example.com/img0.gif

http://5.realurl.example.com
http://5.form.nested.displayedurl.example.com

http://5.form.nested.displayedurl.example.com
5.form.nested.link-displayedurl.example.com

http://6.realurl.example.com
6.displayedurl.example.com

http://6.realurl.example.com
6.displayedurl.example.com/img1.gif
```

### How matching works

#### RealURL, DisplayedURL concatenation

The phishing detection module processes pairs of RealURL/DisplayedURL. Matching against `daily.wdb` is done as follows: the RealURL is concatenated with a `:`, and with the DisplayedURL, then that *line* is matched against the lines in `daily.wdb`/`daily.pdb`

So if you have this line in `daily.wdb`:

```
M:www.google.ro:www.google.com
```

This href: `<a href='http://www.google.ro'>www.google.com</a>` then it will be allowed, but: `<a href='http://images.google.com'>www.google.com</a>` will not.

#### What happens when a match is found

In the case of the allow list, a match means that the RealURL/DisplayedURL combination is considered clean, and no further checks are performed on it.

In the case of the domain list, a match means that the RealURL/DisplayedURL is going to be checked for phishing attempts.

Furthermore you can restrict what checks are to be performed by specifying the 3-digit hexnumber.

#### Extraction of `RealURL`, `DisplayedURL` from HTML tags

The html parser extracts pairs of `RealURL`/`DisplayedURL` based on the following rules.

After URLs have been extracted, they are normalized, and cut after the hostname. `http://test.example.com/path/somecgi?queryparameters` becomes `http://test.example.com/`

- `a`

  (anchor) the `href` is the `RealURL`, its `contents` is the `DisplayedURL`

  - `contents`

    is the tag-stripped contents of the `<a>` tags, so for example `<b>` tags are stripped (but not their contents)

  nesting another `<a>` tag withing an `<a>` tag (besides being invalid html) is treated as a `</a><a`...

- `form`

  the `action` attribute is the `RealURL`, and a nested `<a>` tag is the `DisplayedURL.`

- `img/area`

  if nested within an `<a>` tag, the RealURL is the `href` of the a tag, and the `src`/`dynsrc`/`area` is the `DisplayedURL` of the `img`

  if nested withing a `form` tag, then the action attribute of the `form` tag is the `RealURL`.

- `iframe`

  if nested withing an `<a>` tag the `src` attribute is the `DisplayedURL`, and the `href` of its parent `a` tag is the `RealURL.`

  if nested withing a `form` tag, then the action attribute of the `form` tag is the `RealURL`.

#### Example

Consider this html file:

```html
<a href=”evilurl”>www.paypal.com</a>
<a href=”evilurl2” title=”www.ebay.com”>click here to sign in</a>
<form action=”evilurl_form”>
Please sign in to <a href=”cgi.ebay.com”>Ebay</a>using this form
<input type=’text’ name=’username’>Username</input>
....
</form>
<a href=”evilurl”><img src=”images.paypal.com/secure.jpg”></a>
```

The resulting `RealURL`/`DisplayedURL` pairs will be (note that one tag can generate multiple pairs):

- `evilurl` / `www.paypal.com`

- `evilurl2` / `click here to sign in`

- `evilurl2` / `www.ebay.com`

- `evilurl_form` / `cgi.ebay.com`

- `cgi.ebay.com` / `Ebay`

- `evilurl` / `image.paypal.com/secure.jpg`

### Simple patterns

Simple patterns are matched literally, i.e. if you say:

```
www.google.com
```

it is going to match *www.google.com*, and only that. The *. (dot)* character has no special meaning (see the section on regexes [\[sec:Regular-expressions\]](#sec:Regular-expressions) for how the *.(dot)* character behaves there)

### Regular expressions

POSIX regular expressions are supported, and you can consider that internally it is wrapped by *^*, and *$.* In other words, this means that the regular expression has to match the entire concatenated (see section [RealURL,-DisplayedURL-concatenation](#RealURL,-DisplayedURL-concatenation) for details on concatenation) url.

It is recomended that you read section [Introduction-to-regular](#Introduction-to-regular) to learn how to write regular expressions, and then come back and read this for hints.

Be advised that clamav contains an internal, very basic regex matcher to reduce the load on the regex matching core. Thus it is recomended that you avoid using regex syntax not supported by it at the very beginning of regexes (at least the first few characters).

Currently the clamav regex matcher supports:

- `.` (dot) character

- `\` (escaping special characters)

- `|` (pipe) alternatives

- `[]` (character classes)

- `()` (parenthesis for grouping, but no group extraction is performed)

- other non-special characters

Thus the following are not supported:

- `+` repetition

- `*` repetition

- `{}` repetition

- backreferences

- lookaround

- other “advanced” features not listed in the supported list ;)

This however shouldn’t discourage you from using the “not directly supported features “, because if the internal engine encounters unsupported syntax, it passes it on to the POSIX regex core (beginning from the first unsupported token, everything before that is still processed by the internal matcher). An example might make this more clear:

```re
*www\(\backslash\).google\(\backslash\).(com|ro|it) (\[a-zA-Z\])+\(\backslash\).google\(\backslash\).(com|ro|it)*
```

Everything till `(\[a-zA-Z\])+` is processed internally, that parenthesis (and everything beyond) is processed by the posix core.

Examples of url pairs that match:

- `www.google.ro` `images.google.ro`

- `www.google.com` `images.google.ro`

Example of url pairs that don’t match:

- `www.google.ro` `images1.google.ro`

- `images.google.com` `image.google.com`

### Flags

Flags are a binary OR of the following numbers:

| Flag                 | Value |
| -------------------- | ----- |
| HOST_SUFFICIENT      | 1     |
| DOMAIN_SUFFICIENT    | 2     |
| DO_REVERSE_LOOKUP    | 4     |
| CHECK_REDIR          | 8     |
| CHECK_SSL            | 16    |
| CHECK_CLOAKING       | 32    |
| CLEANUP_URL          | 64    |
| CHECK_DOMAIN_REVERSE | 128   |
| CHECK_IMG_URL        | 256   |
| DOMAINLIST_REQUIRED  | 512   |

The names of the constants are self-explanatory.

These constants are defined in `libclamav/phishcheck.h`, you can check there for the latest flags.

There is a default set of flags that are enabled, these are currently:

```c
( CLEANUP_URL | CHECK_SSL | CHECK_CLOAKING | CHECK_IMG_URL )
```

ssl checking is performed only for a tags currently.

You must decide for each line in the domain list if you want to filter any flags (that is you don’t want certain checks to be done), and then calculate the binary OR of those constants, and then convert it into a 3-digit hexnumber. For example you devide that domain_sufficient shouldn’t be used for ebay.com, and you don’t want to check images either, so you come up with this flag number: `2|256 => 258(decimal) => 102(hexadecimal)`

So you add this line to `daily.wdb`:

```
R102 www.ebay.com .+
```

## Introduction to regular expressions

Recomended reading:

- regex quick start: <http://www.regular-expressions.info/quickstart.html>

- regex tutorial: <http://www.regular-expressions.info/tutorial.html>

- regex(7) man-page: <https://linux.die.net/man/7/regex>

### Special characters

- `[`

  the opening square bracket - it marks the beginning of a character class, see section[Character-classes](#Character-classes)

- `\`

  the backslash - escapes special characters, see section [Escaping](#Escaping)

- `^`

  the caret - matches the beginning of a line (not needed in clamav regexes, this is implied)

- `$`

  the dollar sign - matches the end of a line (not needed in clamav regexes, this is implied)

- `.`

  the period or dot - matches *any* character

- `|`

  the vertical bar or pipe symbol - matches either of the token on its left and right side, see [Alternation](#Alternation)

- `?`

  the question mark - matches optionally the left-side token, see [Optional-matching, and Repetition](#optional-matching-and-repetition)

- `*`

  the asterisk or star - matches 0 or more occurences of the left-side token, see [Optional-matching, and Repetition](#optional-matching-and-repetition)

- `+`

  the plus sign - matches 1 or more occurences of the left-side token, see [Optional-matching, and Repetition](#optional-matching-and-repetition)

- `(`

  the opening round bracket - marks beginning of a group, see section [Groups](#Groups)

- `)`

  the closing round bracket - marks end of a group, see section[Groups](#Groups)

### Character classes

### Escaping

Escaping has two purposes:

- It allows you to actually match the special characters themselves, for example to match the literal `+`, you would write `\+`

- It also allows you to match non-printable characters, such as the tab (`\t`) and newline (`\n`)

However since non-printable characters are not valid inside an url, you won’t have a reason to use them.

### Alternation

### Optional matching, and repetition

### Groups

Groups are usually used together with repetition, or alternation. For example: `(com|it)+` means: match 1 or more repetitions of `com` or `it`, that is it matches: `com`, `it`, `comcom`, `comcomcom`, `comit`, `itit`, `ititcom`,... you get the idea.

Groups can also be used to extract substring, but this is not supported by the ClamAV, and not needed either in this case.

## How to create database files

### How to create and maintain the allow list (daily.wdb)

If the phishing code claims that a certain mail is phishing, but it's not, you have 2 choices:

- Examine your rules `daily.pdb`, and fix them if necessary (see: [How to create database files](#how-to-create-database-files))

- Add it to the allow list (discussed here)

Lets assume you are having problems because of links like this in a mail:

```html
<a href=''http://69.0.241.57/bCentral/L.asp?L=XXXXXXXX''>`
  http://www.bcentral.it/`
</a>`
```

After investigating those sites further, you decide they are no threat, and create a line like this in daily.wdb:

```
R http://www\(\backslash\).bcentral\(\backslash\).it/.+
http://69\(\backslash\).0\(\backslash\).241\(\backslash\).57/bCentral/L\(\backslash\).asp?L=.+
```

> _Note_: urls like the above can be used to track unique mail recipients, and thus know if somebody actually reads mails (so they can send more spam). However since this site required no authentication information, it is safe from a phishing point of view.

### How to create and maintain the domain list (daily.pdb)

When not using `--phish-scan-alldomains` (production environments for example), you need to decide which urls you are going to check.

Although at a first glance it might seem a good idea to check everything, it would produce false positives. Particularly newsletters, ads, etc. are likely to use URLs that look like phishing attempts.

Lets assume that you’ve recently seen many phishing attempts claiming they come from Paypal. Thus you need to add paypal to daily.pdb:

```
R .+ .+\(\backslash\).paypal\(\backslash\).com
```

The above line will block (detect as phishing) mails that contain urls that claim to lead to paypal, but they don’t in fact.

Be careful not to create regexes that match a too broad range of urls though.

### Dealing with false positives, and undetected phishing mails

#### False positives

Whenever you see a false positive (mail that is detected as phishing, but its not), ou might need to modify `daily.pdb` (if one of yours rules in there are too broad), or you need to add the url to `daily.wdb`. If you think the algorithm is incorrect, please file a bug report.

#### Undetected phish mails

If the mail is detected, if yes, then you need to add an appropriate line to `daily.pdb` (see [How to create database files](#how-to-create-database-files)).

If the mail is not detected, then try using:

```bash
$clamscan/clamscan --debug undetected.eml | less
```

Then see what urls are being checked, see if any of them is in an allow list, see if all urls are detected, etc.
