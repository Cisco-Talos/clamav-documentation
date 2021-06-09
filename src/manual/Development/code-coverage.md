# Computing Code Coverage

## Code coverage when using CMake (v0.104 and newer)

> _TO-DO_: Help us figure out how to compute code coverage and document the process here.

## Code coverage when using Autotools (v0.103 and older)

gcov/lcov can be used to produce a code coverage report indicating which lines of code were executed on a single run or by multiple runs of `clamscan`. NOTE: for these metrics to be collected, ClamAV needs to have been configured with the `--enable-coverage` option.

First, run the following to zero out all of the performance metrics:

```bash
lcov -z --directory . --output-file coverage.lcov.data
```

Next, run ClamAV through whatever test cases you have. Then, run lcov again to collect the coverage data as follows:

```bash
lcov -c --directory . --output-file coverage.lcov.data
```

Finally, run the genhtml tool that ships with lcov to produce the code coverage report:

```bash
genhtml coverage.lcov.data --output-directory report
```

The report directory will have an `index.html` page which can be loaded into any web browser.

For more information, visit the [lcov webpage](http://ltp.sourceforge.net/coverage/lcov.php)
