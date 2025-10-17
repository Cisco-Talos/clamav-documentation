// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded "><a href="Introduction.html"><strong aria-hidden="true">1.</strong> Introduction</a></li><li class="chapter-item expanded "><a href="manual/Installing.html"><strong aria-hidden="true">2.</strong> Installing</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="manual/Installing/Packages.html"><strong aria-hidden="true">2.1.</strong> Packages</a></li><li class="chapter-item expanded "><a href="manual/Installing/Docker.html"><strong aria-hidden="true">2.2.</strong> Docker</a></li><li class="chapter-item expanded "><a href="manual/Installing/Installing-from-source-Unix.html"><strong aria-hidden="true">2.3.</strong> Unix from source</a></li><li class="chapter-item expanded "><a href="manual/Installing/Installing-from-source-Windows.html"><strong aria-hidden="true">2.4.</strong> Windows from source</a></li><li class="chapter-item expanded "><a href="manual/Installing/Community-projects.html"><strong aria-hidden="true">2.5.</strong> Community Projects</a></li><li class="chapter-item expanded "><a href="manual/Installing/Add-clamav-user.html"><strong aria-hidden="true">2.6.</strong> Add a service user account</a></li></ol></li><li class="chapter-item expanded "><a href="manual/Usage.html"><strong aria-hidden="true">3.</strong> Usage</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="manual/Usage/Configuration.html"><strong aria-hidden="true">3.1.</strong> Configuration</a></li><li class="chapter-item expanded "><a href="manual/Usage/SignatureManagement.html"><strong aria-hidden="true">3.2.</strong> Updating Signature Databases</a></li><li class="chapter-item expanded "><a href="manual/Usage/Scanning.html"><strong aria-hidden="true">3.3.</strong> Scanning</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="manual/OnAccess.html"><strong aria-hidden="true">3.3.1.</strong> On-Access Scanning</a></li></ol></li><li class="chapter-item expanded "><a href="manual/Usage/Services.html"><strong aria-hidden="true">3.4.</strong> Running ClamAV Services</a></li><li class="chapter-item expanded "><a href="manual/Usage/ReportABug.html"><strong aria-hidden="true">3.5.</strong> Report a Bug</a></li></ol></li><li class="chapter-item expanded "><a href="manual/Signatures.html"><strong aria-hidden="true">4.</strong> Signatures</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="manual/Signatures/DatabaseInfo.html"><strong aria-hidden="true">4.1.</strong> CVD Info File</a></li><li class="chapter-item expanded "><a href="manual/Signatures/DynamicConfig.html"><strong aria-hidden="true">4.2.</strong> Dynamic Configuration Settings</a></li><li class="chapter-item expanded "><a href="manual/Signatures/AuthenticodeRules.html"><strong aria-hidden="true">4.3.</strong> Trusted and Revoked EXE Certificates</a></li><li class="chapter-item expanded "><a href="manual/Signatures/FileTypeMagic.html"><strong aria-hidden="true">4.4.</strong> File Type Recognition</a></li><li class="chapter-item expanded "><a href="manual/Signatures/AllowLists.html"><strong aria-hidden="true">4.5.</strong> Allow Lists</a></li><li class="chapter-item expanded "><a href="manual/Signatures/HashSignatures.html"><strong aria-hidden="true">4.6.</strong> Hash-based Signatures</a></li><li class="chapter-item expanded "><a href="manual/Signatures/BodySignatureFormat.html"><strong aria-hidden="true">4.7.</strong> Content-based Signature Format</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="manual/Signatures/LogicalSignatures.html"><strong aria-hidden="true">4.7.1.</strong> Logical Signatures</a></li><li class="chapter-item expanded "><a href="manual/Signatures/ExtendedSignatures.html"><strong aria-hidden="true">4.7.2.</strong> Extended Signatures</a></li></ol></li><li class="chapter-item expanded "><a href="manual/Signatures/YaraRules.html"><strong aria-hidden="true">4.8.</strong> YARA Rules</a></li><li class="chapter-item expanded "><a href="manual/Signatures/PhishSigs.html"><strong aria-hidden="true">4.9.</strong> Phishing Signatures</a></li><li class="chapter-item expanded "><a href="manual/Signatures/BytecodeSignatures.html"><strong aria-hidden="true">4.10.</strong> Bytecode Signatures</a></li><li class="chapter-item expanded "><a href="manual/Signatures/ContainerMetadata.html"><strong aria-hidden="true">4.11.</strong> Container Metadata Signatures</a></li><li class="chapter-item expanded "><a href="manual/Signatures/EncryptedArchives.html"><strong aria-hidden="true">4.12.</strong> Archive Passwords (experimental)</a></li><li class="chapter-item expanded "><a href="manual/Signatures/SignatureNames.html"><strong aria-hidden="true">4.13.</strong> Signature Names</a></li></ol></li><li class="chapter-item expanded "><a href="manual/Development.html"><strong aria-hidden="true">5.</strong> For Developers</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="manual/Development/github-pr-basics.html"><strong aria-hidden="true">5.1.</strong> Pull Request Basics</a></li><li class="chapter-item expanded "><a href="manual/Development/clamav-git-work-flow.html"><strong aria-hidden="true">5.2.</strong> ClamAV Git Work Flow</a></li><li class="chapter-item expanded "><a href="manual/Development/personal-forks.html"><strong aria-hidden="true">5.3.</strong> Working with Your Fork</a></li><li class="chapter-item expanded "><a href="manual/Development/testing-pull-requests.html"><strong aria-hidden="true">5.4.</strong> Reviewing Pull Requests</a></li><li class="chapter-item expanded "><a href="manual/Development/development-builds.html"><strong aria-hidden="true">5.5.</strong> Building for Development</a></li><li class="chapter-item expanded "><a href="manual/Development/build-installer-packages.html"><strong aria-hidden="true">5.6.</strong> Building the Installer Packages</a></li><li class="chapter-item expanded "><a href="manual/Development/tips-and-tricks.html"><strong aria-hidden="true">5.7.</strong> Dev Tips &amp; Tricks</a></li><li class="chapter-item expanded "><a href="manual/Development/performance-profiling.html"><strong aria-hidden="true">5.8.</strong> Performance Profiling</a></li><li class="chapter-item expanded "><a href="manual/Development/code-coverage.html"><strong aria-hidden="true">5.9.</strong> Computing Code Coverage</a></li><li class="chapter-item expanded "><a href="manual/Development/fuzzing-sanitizers.html"><strong aria-hidden="true">5.10.</strong> Fuzzing Sanitizers</a></li><li class="chapter-item expanded "><a href="manual/Development/libclamav.html"><strong aria-hidden="true">5.11.</strong> libclamav</a></li><li class="chapter-item expanded "><a href="manual/Development/Contribute.html"><strong aria-hidden="true">5.12.</strong> Contribute</a></li></ol></li><li class="chapter-item expanded "><a href="faq/faq.html"><strong aria-hidden="true">6.</strong> Frequently Asked Questions</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="faq/faq-whichversion.html"><strong aria-hidden="true">6.1.</strong> Selecting the Right Version of ClamAV for You</a></li><li class="chapter-item expanded "><a href="faq/faq-freshclam.html"><strong aria-hidden="true">6.2.</strong> FreshClam (Signature Updater)</a></li><li class="chapter-item expanded "><a href="faq/faq-cvd.html"><strong aria-hidden="true">6.3.</strong> Signature Database (CVD)</a></li><li class="chapter-item expanded "><a href="faq/faq-malware-fp-reports.html"><strong aria-hidden="true">6.4.</strong> Malware and False Positive Report</a></li><li class="chapter-item expanded "><a href="faq/faq-misc.html"><strong aria-hidden="true">6.5.</strong> Misc</a></li><li class="chapter-item expanded "><a href="faq/faq-ml.html"><strong aria-hidden="true">6.6.</strong> Mailing Lists</a></li><li class="chapter-item expanded "><a href="faq/faq-safebrowsing.html"><strong aria-hidden="true">6.7.</strong> Safe Browsing</a></li><li class="chapter-item expanded "><a href="faq/faq-troubleshoot.html"><strong aria-hidden="true">6.8.</strong> Troubleshooting</a></li><li class="chapter-item expanded "><a href="faq/faq-scan-alerts.html"><strong aria-hidden="true">6.9.</strong> Interpreting Scan Alerts</a></li><li class="chapter-item expanded "><a href="faq/faq-upgrade.html"><strong aria-hidden="true">6.10.</strong> Upgrading</a></li><li class="chapter-item expanded "><a href="faq/faq-rust.html"><strong aria-hidden="true">6.11.</strong> Rust</a></li><li class="chapter-item expanded "><a href="faq/faq-win32.html"><strong aria-hidden="true">6.12.</strong> Win32</a></li><li class="chapter-item expanded "><a href="faq/faq-pua.html"><strong aria-hidden="true">6.13.</strong> PUA (Potentially Unwanted Application)</a></li><li class="chapter-item expanded "><a href="faq/faq-ignore.html"><strong aria-hidden="true">6.14.</strong> Ignore</a></li><li class="chapter-item expanded "><a href="faq/faq-uninstall.html"><strong aria-hidden="true">6.15.</strong> Uninstall</a></li><li class="chapter-item expanded "><a href="faq/faq-eol.html"><strong aria-hidden="true">6.16.</strong> ClamAV EOL Policy</a></li></ol></li><li class="chapter-item expanded "><li class="spacer"></li><li class="chapter-item expanded "><a href="community_resources/CommunityResources.html"><strong aria-hidden="true">7.</strong> Community Resources</a></li><li class="chapter-item expanded affix "><li class="spacer"></li><li class="chapter-item expanded "><a href="appendix/Appendix.html"><strong aria-hidden="true">8.</strong> Appendix</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="appendix/Terminology.html"><strong aria-hidden="true">8.1.</strong> Terminology</a></li><li class="chapter-item expanded "><a href="appendix/CvdPrivateMirror.html"><strong aria-hidden="true">8.2.</strong> Hosting a Private Database Mirror</a></li><li class="chapter-item expanded "><a href="appendix/Authenticode.html"><strong aria-hidden="true">8.3.</strong> Microsoft Authenticode Signature Verification</a></li><li class="chapter-item expanded "><a href="appendix/FileTypes.html"><strong aria-hidden="true">8.4.</strong> ClamAV File Types and Target Types</a></li><li class="chapter-item expanded "><a href="appendix/FunctionalityLevels.html"><strong aria-hidden="true">8.5.</strong> ClamAV Versions and Functionality Levels</a></li></ol></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0].split("?")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
