# Running ClamAV Services

Table Of Contents

- [Windows Services](#windows-services)
<!--- - [Unix Services](#unix) --->

## Windows Services

> _Note_: This feature requires ClamAV version 0.104 or newer.

On Windows, `clamd` and `freshclam` have options that enable them to run in the background. 

To install the services, first use the command:

```bash
clamd --install-service
```

Then use `net start clamd` and `net stop clamd` to start/stop the service.

To uninstall the service, use:

```bash
clamd --uninstall-service
```

Services can also be managed via the Services application on Windows.
