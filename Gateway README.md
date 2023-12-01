# Cliptool Gateway

## Table of Content<!-- omit from toc -->

-   [Installing Cliptool Gateway](#installing-cliptool-gateway)
-   [Running Cliptool Gateway](#running-cliptool-gateway)
    -   [AMP Protocol](#amp-protocol)
    -   [OSC Protocol](#osc-protocol)

## Installing Cliptool Gateway

Cliptool Gateway is prebuilt for Windows. Simply download the desired version from the [release page](https://github.com/tv2/casparcg-cliptool/releases).
Ones you have downloaded the desired version of `cliptool-gateway.exe`, drop it into the folder for CasparCG.

## Running Cliptool Gateway

Cliptool Gateway allows Cliptool to be controlled from outside by use of OSC and/or AMP remote control protocols.
The `cliptool-gateway.exe` file is used for remote controlling ClipTool from e.g. a video mixer.

For the Cliptool Gateway to work, Cliptool itself also needs to run.
Another requirement of the Cliptool Gateway is that it needs an arguement upon start to determin if it should use OSC or AMP.

The argument can be supplied in any way you want. Examples include but are not limited to.

-   Giving it as an argument to a shortcut
-   Giving it as an argument when executing from commandline.
-   Giving is as an argument when configuraing with CasparCG Launcher.

### AMP Protocol

To start Cliptool Gateway as an AMP gateway, then the argument `-type=amp` has to be given to the execuable at launch.
There is a couble of ways to supply the arguement.
Regardless of how it is supplied, the Cliptool Gateway will create an AMP gateway on port 3811.

-   Shortcut

```txt
Target: "<your-casparcg-server-installation-folder>\cliptool-gateway.exe" -type=amp
```

-   Commandline

```bash
cd <your-casparcg-server-installation-folder>
cliptool-gateway.exe -type=amp
```

-   CasparCG Launcher Argument

```txt
Executable: cliptool-gateway.exe
Arguments: -type=amp
```

### OSC Protocol

To start Cliptool Gateway as an OSC gateway, then the argument `-type=osc` has to be given to the execuable at launch.
There is a couble of ways to supply the arguement.
Regardless of how it is supplied, the Cliptool Gateway will create an OSC gateway on port 5256.

-   Shortcut

```txt
Target: "<your-casparcg-server-installation-folder>\cliptool-gateway.exe" -type=osc
```

-   Commandline

```bash
cd <your-casparcg-server-installation-folder>
cliptool-gateway.exe -type=osc
```

-   CasparCG Launcher Argument

```txt
Executable: cliptool-gateway.exe
Arguments: -type=osc
```

The OSC protocol has the following commands.

```
/channel/{output}/play
/channel/{output}/load
```
