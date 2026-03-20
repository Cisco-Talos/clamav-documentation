# Usage

Table Of Contents

- [Usage](#usage)
  - [Purpose](#purpose)
  - [High-Level Software Diagram](#high-level-software-diagram)
  - [Rough Scan Flowchart](#rough-scan-flowchart)
  - [Daemon](#daemon)
  - [Scanner](#scanner)
  - [Signature Testing and Management](#signature-testing-and-management)
  - [Configuration](#configuration)

## Purpose

This user guide presents an overview of the various ways that *libclamav* can be used through the tools provided by ClamAV. To learn more about how to better use each facet of ClamAV that interests you, please follow the links provided.

## High-Level Software Diagram

```mermaid
flowchart TD
    subgraph CLAMAV[ClamAV Programs, Services, Libraries, and Data]
        DB[(Virus Databases)]
        NET[(ClamAV mirrors / update source)]

        LF[libfreshclam<br/>update library]

        FC[freshclam<br/>updates databases]
        CD[clamd<br/>scanner daemon]
        CS[clamscan<br/>standalone scanner]
        CDS[clamdscan<br/>client for clamd]
        CDT[clamdtop<br/>monitor for clamd]
        COA[clamonacc<br/>on-access scanner]
        CMI[clamav-milter<br/>mail filter]
        ST[sigtool<br/>signature/db utility]
        CBC[clambc<br/>bytecode utility]
        CCF[clamconf<br/>config/report utility]
        CSU[clamsubmit<br/>sample submission tool]

        NET --> FC
        LF --> FC
        FC --> DB

        DB --> CD
        DB --> CS
        DB --> ST
        DB --> CBC

        CDS --> CD
        CDT --> CD
        COA --> CD
        CMI --> CD
    end

```

## Rough Scan Flowchart

```mermaid
flowchart LR
    subgraph DIRECT[Direct scan flow]
        direction LR
        CS[clamscan]
        CS_VERDICT[Scan verdicts / alerts]
        CS_META[Logs / metadata]

        CS -->|report verdict| CS_VERDICT
        CS -->|emit logs / metadata| CS_META
    end

    subgraph CLIENTSERVER[Client/server scan flow]
        direction LR

        subgraph CLIENTS[ ]
            direction TB
            CDS[clamdscan]
            COA[clamonacc]
            CMI[clamav-milter]
        end

        subgraph DAEMON[ ]
            direction TB
            CD[clamd]
        end

        subgraph OUTPUTS[ ]
            direction TB
            CD_VERDICT[Scan verdicts / alerts]
            CD_META[Logs / metadata]
        end

        CDS -->|request scan| CD
        COA -->|request scan| CD
        CMI -->|request scan| CD

        CDS -->|report verdict| CD_VERDICT
        COA -->|report verdict| CD_VERDICT
        CMI -->|report verdict| CD_VERDICT

        CDS -->|emit logs / metadata| CD_META
        COA -->|emit logs / metadata| CD_META
        CMI -->|emit logs / metadata| CD_META
    end

```

## Daemon

The ClamAV Daemon, or [`clamd`](Usage/Scanning.md#clamd), is a multi-threaded daemon that uses *libclamav* to [scan files for viruses](Usage/Scanning.md). ClamAV provides a number of tools which interface with this daemon. They are, as follows:

  - [`clamdscan`](Usage/Scanning.md#clamdscan) - a simple scanning client
  - [`clamonacc`](Usage/Scanning.md#On-access-scanning) - provides on-access scanning (aka real-time protection via a `clamd` instance
  - [`clamav-milter`](Usage/Scanning.md#On-access-scanning) - a mail filtering plugin for the Sendmail email processing server software to scan emails
  - [`clamdtop`](Usage/Scanning.md#clamdtop) - a resource monitoring interface for `clamd`

## Scanner

ClamAV also provides a command-line tool for [simple scanning](Usage/Scanning.md) tasks with *libclamav* called [`clamscan`](Usage/Scanning.md#clamscan). Unlike the daemon, `clamscan` is not a persistent process and is best suited for use cases where one-time scanning with minimal setup is needed.

## Signature Testing and Management

A number of tools allow for [testing and management of signatures](Usage/SignatureManagement.md). Of note are the following:

  - [`clambc`](Usage/SignatureManagement.md#clambc) - specifically for testing bytecode
  - [`sigtool`](Usage/SignatureManagement.md#sigtool) - for general signature testing and analysis
  - [`freshclam`](Usage/SignatureManagement.md#freshclam) - used to update signature database sets to the latest version

## Configuration

The more complex tools ClamAV provides each require some degree of [configuration](Usage/Configuration.md). ClamAV supplies two example configuration files:

  - [`clamd.conf`](Usage/Configuration.md#clamdconf) - for configuring the behavior of the ClamAV Daemon `clamd` and associated tools
  - [`freschclam.conf`](Usage/Configuration.md#freshclamconf) - for configuring the behavior of the signature database update tool, `freshclam`

Additionally, a tool called [`clamconf`](Usage/Configuration.md#clamconf) allows users to check the configurations used by each other tool, pulling information from the configuration files listed above, alongside other relevant information.
