# Building and Testing ClamAV with Fuzzing Sanitizers


## Build & Reproduce Fuzz Reports using OSS-Fuzz Tools

Check out [the google/oss-fuzz repository](https://github.com/google/oss-fuzz.git) and the `clamav` repo side by side. .

Then inside the `oss-fuzz` directory, run:

```bash
python3 infra/helper.py build_image clamav
python3 infra/helper.py build_fuzzers --sanitizer address clamav ../clamav
python3 infra/helper.py reproduce clamav clamav_scanmap_fuzzer /path/to/poc_file
```

> _Tip_: You can substitute `address` argument in the second command that selects the Address Sanitizer (ASan) with `memory` or `undefined` to use the Memory Sanitizer (MSan) or the Undefined Behavior Sanitizer (UBSan).

See <https://google.github.io/oss-fuzz/advanced-topics/reproducing/> for more details.

## Build & Test Fuzz Targets Sanitizers in CMake (v0.104 and newer)

Inside your `clamav` git clone, run:

```bash
mkdir build-fuzz && cd build-fuzz

export CC=`which clang` && \
    export CXX=`which clang++` && \
    export SANITIZER=address && \
    cmake .. -G Ninja \
        -D OPTIMIZE=OFF \
        -D CMAKE_BUILD_TYPE="Debug" \
        -D ENABLE_FUZZ=ON \
    && \
    ninja
```

This will build the fuzz target executables in the `build-fuzz/fuzz/` directory. You can run them just like a regular program, passing the file as input.

E.g.:
```bash
./fuzz/clamav_scanfile_fuzzer /path/to/poc_file
```

## ClamAV with Address Sanitizer (ASAN) in Autotools (v0.103 and older)

Building ClamAV with ASAN support can be extremely useful in detecting memory corruption and memory leaks. To build with ASAN, use a `..\configure` line like the following:

```bash
CFLAGS="-ggdb -O0 -fsanitize=address -fno-omit-frame-pointer" LDFLAGS="-fsanitize=address" CXXFLAGS="-ggdb -O0 -fsanitize=address -fno-omit-frame-pointer" OBJCFLAGS="-ggdb -O0 -fsanitize=address -fno-omit-frame-pointer" ../configure --prefix=`pwd`/../installed --enable-debug --enable-libjson --with-systemdsystemunitdir=no --enable-experimental --enable-clamdtop --enable-libjson --enable-xml --enable-pcre --disable-llvm
```
