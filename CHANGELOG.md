# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [2.4.1](https://github.com/olzzon/CasparCG-ClipTool/compare/v2.4.0...v2.4.1) (2021-05-22)

### Bug Fixes

-   in prebuild .exe settings was not stores as storage folder was not created ([0cc20e1](https://github.com/olzzon/CasparCG-ClipTool/commit/0cc20e1b445cd02c4e1b07336e04530065979da9))
-   prebuild casparcg-clip-tool.exe was not build correctly ([3c16109](https://github.com/olzzon/CasparCG-ClipTool/commit/3c16109b4c9eda9c6bef66012a474c2e81476ab6))

## [2.4.0](https://github.com/olzzon/CasparCG-ClipTool/compare/v2.3.0...v2.4.0) (2021-05-22)

### Features

-   textview /?textview=1 for quing on small screens e.q. a small raspberry pi ([70f19a4](https://github.com/olzzon/CasparCG-ClipTool/commit/70f19a48bf3a4e21f61969503b6e87f7bd1095be))

## [2.3.0](https://github.com/olzzon/CasparCG-ClipTool/compare/v2.2.0...v2.3.0) (2021-04-21)

### Features

-   controlgateway - select gateway type as cli args ([bab2271](https://github.com/olzzon/CasparCG-ClipTool/commit/bab22718f4072a5bbfa2ac5344672d78aeb0d306))
-   gateway - cli args handling - OSC controller, play,load working ([ca0a276](https://github.com/olzzon/CasparCG-ClipTool/commit/ca0a276f19ec6284f6ca1146c392f4636fd0447e))
-   Gateway - OSC server initial setup ([7e018f9](https://github.com/olzzon/CasparCG-ClipTool/commit/7e018f9d4c5573431138c258f1381bdaf76f9ce6))
-   package .exe files of ClipTool AND Gateway ([7c9b074](https://github.com/olzzon/CasparCG-ClipTool/commit/7c9b07467472d4346702fc3579f75912f7b64350))

### Bug Fixes

-   GUI - css thumbs was scrolling over settings. Scaling on small screen ([09a1dff](https://github.com/olzzon/CasparCG-ClipTool/commit/09a1dffa7a8812350f78da4e7366628e5b827dab))
-   Order of initial loading of webpage, settings are now passed upon connection. And pages loaded imidiately ([651249c](https://github.com/olzzon/CasparCG-ClipTool/commit/651249cc69103fd74d6b3feca020c56d84b80534))

## [2.2.0](https://github.com/olzzon/CasparCG-ClipTool/compare/v2.1.0...v2.2.0) (2021-04-14)

### Features

-   Settings - enable/disable scaling (disable will scale to outputformat) ([b706693](https://github.com/olzzon/CasparCG-ClipTool/commit/b7066939b90d6a9bcba1b60a66744168e775b330))

### Bug Fixes

-   Scaling - set default store to 1920x1080 ([25771dd](https://github.com/olzzon/CasparCG-ClipTool/commit/25771ddc9251c77d4d97613ad1ee749c87b5b0a7))

## 2.1.0 (2021-04-12)

### Features

-   added check for not reloading an already loaded template when calling a invoke ([2a49b2a](https://github.com/olzzon/CasparCG-ClipTool/commit/2a49b2a87c4d926071e9407c671681098cf068bf))
-   added invoke start & end to default reducer ([1c31c7c](https://github.com/olzzon/CasparCG-ClipTool/commit/1c31c7cf938ca000de104a24a4340ceca7947749))
-   changes invoke to invokeSteps[] so multiple steps can be controlled. ([1ab5c1c](https://github.com/olzzon/CasparCG-ClipTool/commit/1ab5c1cd4c1dc504ef02d43300149c1442cf45e9))
-   client can build - preparing move to socket-io ([2bac765](https://github.com/olzzon/CasparCG-ClipTool/commit/2bac765d755e72a4bf47a79b814771de85022579))
-   ClipTool only settings. Disables OVERLAY and AUTONEXT function on clint (if more than one client is connected, only one should add overlay and control autonext) ([6dad196](https://github.com/olzzon/CasparCG-ClipTool/commit/6dad196d59eda3fc65d65fea26b4b5d2b13f4645))
-   countdown instead of count up. Mix and autoplay button -ready to implement ([45a00d1](https://github.com/olzzon/CasparCG-ClipTool/commit/45a00d1fe94bd14348bb3c62171160de8b4977de))
-   dropdown selectors for dataFolder and overlayFolder in settings ([67cbe27](https://github.com/olzzon/CasparCG-ClipTool/commit/67cbe27484a3ebaea8dac7ead8ffc1ab46259aa8))
-   express nodejs based initial commit ([3288e92](https://github.com/olzzon/CasparCG-ClipTool/commit/3288e92a05689d6bfc32d872ac02688e48eddab2))
-   first working draft of Invoke ([18736c7](https://github.com/olzzon/CasparCG-ClipTool/commit/18736c72288bb1a81f74d84e7bf329fafd2d1777))
-   Folders - extract folders from filenames. Select folder in settings ([d9ed75e](https://github.com/olzzon/CasparCG-ClipTool/commit/d9ed75e04f9c6206e9cb4a86d1abf970fedaf056))
-   GraphQl mediaFolders implemented ([fd806cd](https://github.com/olzzon/CasparCG-ClipTool/commit/fd806cdd2c52d5d413f068a531cd11584b6bbaee))
-   mediadat and thumbnails pr output based on selected folder ([4962f6d](https://github.com/olzzon/CasparCG-ClipTool/commit/4962f6d9bef985d00da5c562f1056e8d20c8fbb1))
-   mix implemented ([77fba63](https://github.com/olzzon/CasparCG-ClipTool/commit/77fba631b0e139682d00fa19cee08041facf5cd8))
-   Optimization - only rerender updated components (time and tally) ([c4fb14d](https://github.com/olzzon/CasparCG-ClipTool/commit/c4fb14dca4de0f13d208236b73481dd10dfc78ab))
-   prepare output settings ([3e542c1](https://github.com/olzzon/CasparCG-ClipTool/commit/3e542c1a3359e59bbbfc12b4fa4629f11e841562))
-   refactor - basic rendering of thumbs in client working ([9bff267](https://github.com/olzzon/CasparCG-ClipTool/commit/9bff2676de44ffc8b9c7e89dd3cb6424577a3bb6))
-   refactor - functional components - tabs recieved from Caspar CG settings ([3959dfe](https://github.com/olzzon/CasparCG-ClipTool/commit/3959dfe4be34ce5bacd52cb09cdbb98b75333197))
-   refactor - Header timer ccs align, manualplay instead of autoplay (as autoplay is default) ([42e7320](https://github.com/olzzon/CasparCG-ClipTool/commit/42e7320362ab7255b63db229f7c409478ad86683))
-   refactor - loop implemented ([77da4e5](https://github.com/olzzon/CasparCG-ClipTool/commit/77da4e5de2eaef3c692731e3e4559d45cfd20e71))
-   refactor - play media when clicking on thumb ([6b0a4d7](https://github.com/olzzon/CasparCG-ClipTool/commit/6b0a4d78cc15ee9bab0ada574eacc1726ecffae5))
-   refactor - remove channelsReducer and leftovers from autonext feature ([9096b6e](https://github.com/olzzon/CasparCG-ClipTool/commit/9096b6ede76a762d1ee5e74a4affc6cf832dca4e))
-   refactor - setting up socketIO client ([82cd33f](https://github.com/olzzon/CasparCG-ClipTool/commit/82cd33f6721bfe8b5a45cfc15cf6e9eb700d9d12))
-   refactor - time object parsed to client instead of full channels object ([c348464](https://github.com/olzzon/CasparCG-ClipTool/commit/c348464270a09925960025936030ff003d3dca79))
-   refactor - timer on client ([4c75380](https://github.com/olzzon/CasparCG-ClipTool/commit/4c7538056df68459647bb48e2d05e7bd651c2095))
-   refactor manual start implemented ([08490b3](https://github.com/olzzon/CasparCG-ClipTool/commit/08490b3b858995379507d6da8d27c326369d20f5))
-   refactoring - further refact and rewrite. Focus on Server-side ([0c4dca3](https://github.com/olzzon/CasparCG-ClipTool/commit/0c4dca38f5676f377a845019cd4eece12a155189))
-   refactoring - serverside casparCg connection and datastructure ([4065e35](https://github.com/olzzon/CasparCG-ClipTool/commit/4065e35b95dd59d135a457e5006f0f9f814ea917))
-   scaling - individual scaling of outputs ([dc221d5](https://github.com/olzzon/CasparCG-ClipTool/commit/dc221d5e2368bb7dd2191f32debb2dc72fdf6381))
-   scaling in pixel format - fix: state buttons ([29b6f25](https://github.com/olzzon/CasparCG-ClipTool/commit/29b6f25461d5c4c92f6c458eb1cd9d2041febc7f))
-   Select folder from pull-down menu in settings, gets folderlist by query mediaFolders to casparcg-state-scanner ([1659c99](https://github.com/olzzon/CasparCG-ClipTool/commit/1659c998c277aba2173129fd3bf6a4354582fb14))
-   Select MediaFolder CCS improvements ([87b774a](https://github.com/olzzon/CasparCG-ClipTool/commit/87b774a88c7063058c955fd805acc6101e091387))
-   settings - css on buttons and fields ([e921a09](https://github.com/olzzon/CasparCG-ClipTool/commit/e921a099d126aacb01d673cd810f2f26706a30a7))
-   Settings Tab label implemented ([fe96674](https://github.com/olzzon/CasparCG-ClipTool/commit/fe96674806cbe1cc6c4a97892caac321927285d2))
-   settings.json storage implemented. Basic setttings working ([138220c](https://github.com/olzzon/CasparCG-ClipTool/commit/138220cf6d59c81484654d79cb1c7194445d622b))
-   uptimize update tally info to only send updates when changed ([117b6a8](https://github.com/olzzon/CasparCG-ClipTool/commit/117b6a8b0b39255af4406cf45b47bba615791e43))

### Bug Fixes

-   added indexChannel instead of static 1 so all channels can have gfx ([bb72d4e](https://github.com/olzzon/CasparCG-ClipTool/commit/bb72d4eac11c6167e13d884e1d7e9d7cb735c813))
-   added subfolder .filter as CCG 2.2 does not support subfolder argument in the CLS command. ([09d6332](https://github.com/olzzon/CasparCG-ClipTool/commit/09d6332fd18acbf1eda0155cc456dcc12040703c))
-   Autonext and Loop buttons did not work after refactoring ([29afbc6](https://github.com/olzzon/CasparCG-ClipTool/commit/29afbc60f446f38fed75adda5c0bebe230907acc))
-   Autonext and Loop type when refactoring ([195496f](https://github.com/olzzon/CasparCG-ClipTool/commit/195496f6813ed295ff87e03dd156b54bcfe4e486))
-   Autonext didn´trestart when stopped (randomly) - lastTimeCounter was shared among all channels. Now array ([5611f9c](https://github.com/olzzon/CasparCG-ClipTool/commit/5611f9c1a834031356be58f8245dd55e9f39c8e7))
-   Avoid calling an overlay template or the wipe 2 frames in a row. ([56f7363](https://github.com/olzzon/CasparCG-ClipTool/commit/56f736376b8d907273c332c40bf854f56bc50788))
-   checking index againts length was missing subtracktion of -1 to length ([40223f0](https://github.com/olzzon/CasparCG-ClipTool/commit/40223f0bf25c69190a26a0347d2c6c414f2b4a65))
-   Clear gfx instead of Stop when mix or play a new clip, so both XML and INVOKE based templates will be cleared. ([2187b0f](https://github.com/olzzon/CasparCG-ClipTool/commit/2187b0ffa50e49af8419be2fffd89dc02f51f0f2))
-   Clear overlayIsStarted when loading clip ([55cb4de](https://github.com/olzzon/CasparCG-ClipTool/commit/55cb4de8bc472da19657d1001475244042d0b823))
-   Clear Wipe layer 11 when loading new clip without AutoNext on. ([29bd386](https://github.com/olzzon/CasparCG-ClipTool/commit/29bd3869a66cdb6c187cf2e483d34289bc467af3))
-   data folder, media filename could include subfolders. ([5c698bc](https://github.com/olzzon/CasparCG-ClipTool/commit/5c698bccdef517461930f0326c787952194793ce))
-   Error when updating playingStatus and thumblist is not yet loaded ([2469d34](https://github.com/olzzon/CasparCG-ClipTool/commit/2469d341acbf8c1aa0362c1705d8fad20e122506))
-   forgot foreground in object so it kept loading overlay if it started at zero ([f2c91e0](https://github.com/olzzon/CasparCG-ClipTool/commit/f2c91e067a35483b2fbd57eb8f994790e2dc5ece))
-   handle wipe didn´t include item in function declaration ([16d12b5](https://github.com/olzzon/CasparCG-ClipTool/commit/16d12b5a3091366be46c8f3dee922012c9a1afd3))
-   ipreset layer 20, if meteFile doesn´t include layer ([5837407](https://github.com/olzzon/CasparCG-ClipTool/commit/5837407e9d0a987f2032660004400693092f1a6d))
-   moved set connection status to last part ofv initialistion, so it´s not setting it online if an error happens ([857d38e](https://github.com/olzzon/CasparCG-ClipTool/commit/857d38ecb412bd2d7fdd4240549184481d0c9153))
-   multiple outputs now working ([12388b5](https://github.com/olzzon/CasparCG-ClipTool/commit/12388b504fca4ca76a45dc5a72af39c6989a232b))
-   only create tabs for existing outputs ([d3667f3](https://github.com/olzzon/CasparCG-ClipTool/commit/d3667f339b138fe3ea16b5daa553452c3d7738a3))
-   Output did reference to folderslist instead of configured outputfolders ([15a0199](https://github.com/olzzon/CasparCG-ClipTool/commit/15a0199813944bc409225063ea05cd2f227e94fe))
-   removed filter out media/ in cleanUpFilename() as the folder is now selected from a list, and therefore safe. ([0d85e42](https://github.com/olzzon/CasparCG-ClipTool/commit/0d85e429f1b6a415e7c2487629ed4f5d516cc25d))
-   removed setting starting to 0.08 as lowest value ([ffd6d4b](https://github.com/olzzon/CasparCG-ClipTool/commit/ffd6d4b332b2ad549931c7eb499ccb1457c9da6e))
-   selfcontaines package-builds did not include client part. (/package/*linux & *win) ([bf606e9](https://github.com/olzzon/CasparCG-ClipTool/commit/bf606e9a099c5674f3df66b2f312c58a1c5447af))
-   settings - select folder css width to small ([6e80f9b](https://github.com/olzzon/CasparCG-ClipTool/commit/6e80f9b8443fe3c886db0a5f71c3ed2aa0d78404))
-   Settings screen scrollable ([622e907](https://github.com/olzzon/CasparCG-ClipTool/commit/622e907d3a4b2e9ce6cab2736c10a25705abb2fa))
-   type in all variable names: loadClipToolCommonrSettings -> loadClipToolCommonSettings ([5675472](https://github.com/olzzon/CasparCG-ClipTool/commit/56754727642748df7b6fb27746fe5b32a54ec546))
-   update local settings if common (server stored) settings are changed ([2ed1b46](https://github.com/olzzon/CasparCG-ClipTool/commit/2ed1b46b8b2b216bb0905baaab3e6e81d0506e36))
-   update loop state clientside when restarting server ([c8b207c](https://github.com/olzzon/CasparCG-ClipTool/commit/c8b207c27f01fde26142549ce12298982137eb58))
