# ClamAV-Rust FAQ

## Why is Rust required to compile ClamAV in version 0.105?

For those unfamiliar with [the Rust programming language](https://www.rust-lang.org/), Rust is a systems programming language that guarantees memory-safety and thread-safety without relying on garbage collection. Rust does not guarantee against memory leaks, but its modern type sytem and novel ownership model all but eliminate accidental memory leaks. You can write "unsafe" Rust code that disables some of Rust's safety checks and offers the same flexibility that C has when complex optimizations are needed or when interfacing with C code.

Runtime performance for software written in Rust is also comparable to that of C and C++. Rust has a vibrant and growing ecosystem of libraries and tools. Rust's build system and package manager is called Cargo. Cargo makes it easy to leverage third party libraries.

Linus Torvalds once described programming in the C language to be "like juggling chainsaws." We agree. To mitigate the pitfalls of the C and C++ programming langauges, the ClamAV team decided to switch to write new components and rewrite select existing components in the Rust programming language.

Starting with ClamAV v0.105, the Rust toolchain is required to compile ClamAV.

We believe that by switching from C to Rust, it will be possible for us to focus less on preventing accidental memory safety issues or fixing critical vulnerabilities, and to focus more during development on actual feature correctness.

We're also leveraging Rust's vibrant ecosystem to provide valuable tools for processing different file types, such as those used for our new image fuzzy hash matching feature.

## If Rust is required, should I run Cargo instead of CMake to build ClamAV?

No. ClamAV is still mostly written in C. Our CMake build system will automatically detect the Rust toolchain and use it behind the scenes to compile the Rust componets into the overall project.

## I've heard that Rust requires an internet connection to work. Will I need the internet to compile ClamAV?

Yes and no.

If you're using the release tarball from [clamav.net/downloads](https://www.clamav.net/downloads) then the third-party libraries from the Rust ecosystem will be vendored into the tarball and an internet connection **will not** be required for the build.

If you're using some other means to obtain the ClamAV source code, such as Git or the release artifacts provided automatically by GitHub, then an internet connection **will** be required in order to build ClamAV.
