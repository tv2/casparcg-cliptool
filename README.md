
## Caspar CG Clip Tool
A little Clip player, that looks into a mediafolder and show all the clips with a play and loop.
Tested on MacOS

### Based on:
Using SuperflyTV CasparCG-Connection:
```
https://github.com/SuperFlyTV/casparcg-connection
```

### React-Electron boilerplate from:
Minimal Electron, React and Webpack boilerplate

```
 https://github.com/alexdevero/electron-react-webpack-boilerplate.git
```

### Install:
```
git clone https://github.com/olzzon/CasparCG-ClipTool.git nameofyourproject
cd nameofyourproject
yarn
```

### settings.json:
```
cp settings.example.json /Users/{your_user_name}/Library/Application Support/CasparCGClient/settings.json
````
In the file you can set:
server: (ip-address)
port: (port number)
subFolder: (subfolder containing media)

### Run the app
```
yarn start
```

### Build the app (automatic)
```
yarn package
```

### Build the app (manual)
```
yarn build
```

### Test the app (`yarn run build`)
```
yarn prod
```

### Code of Conduct for electron-react-webpack-boilerplate:

[Contributor Code of Conduct](code-of-conduct.md). By participating in this project you agree to abide by its terms.

### License for electron-react-webpack-boilerplate:

MIT © [Alex Devero](https://alexdevero.com).
