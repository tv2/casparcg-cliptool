## Caspar CG Clip Tool

CasparCG ClipTool is a playout tool with a thumbnail based GUI.

### Normal View:

<img src="docs/images/main-view.png">

### Text View for small touchscreen:

<img src="docs/images/text-view.png" height="152">

## Features:

-   Each output is in it´s own separate Tab, so it´s easy to change a loop on one screen without messing with the others. Only the number of the connected CasparCG server are available.

-   Click on a thumbnail to play the file

-   "LOOP" is ON: Clip will loop whan started

-   "MIX" is ON: CasparCG will mix from currentclip to the next one (e.g. Mix from one loop on a screen to another)

-   "MANUAL" is ON: When clicking on a thumb it will be loaded on CasparCG, pressing "START" to play the clip

### Settings:

<img src="docs/images/settings.png">

-   On each output you can set Label, Folder (CasparCG Media subfolders) and Scaling

## Install and run:

### Prebuild versions:

CasparCG-ClipTool is prebuild for Linux and Windows. The Pre-builds are located in the /package folder on the repository

### Build:

```
git clone https://github.com/olzzon/CasparCG-ClipTool.git nameofyourproject
cd nameofyourproject
yarn
yarn build-server
yarn build-client
yarn start
```

### Run the app

```
yarn start
```

Open GUI in browser: http://localhost:5555

### Build the app

```
yarn package
```

### Based on:

Using SuperflyTV CasparCG-Connection ACMP protocol:

```
https://github.com/SuperFlyTV/casparcg-connection
```
