# Crownfall desktop (Electron)

Windows x64 package for the same game that lives in `../index.html`. The app loads the HTML from its own resources. It does not write executables, unpack itself, or launch Edge or Chrome.

## Build on Linux (Wine not required)

```bash
cd desktop
npm install --save-dev electron electron-builder resedit
export CSC_IDENTITY_AUTO_DISCOVERY=false
npm run pack
npm run stamp
```

`signAndEditExecutable` is false so electron-builder does not need Wine. `stamp-win-exe.js` then writes the Windows version resource and icon with [resedit](https://www.npmjs.com/package/resedit):

- Product name: Crownfall
- Company: Weston Langer
- Version: 1.5.1 (1.5.1.0)
- Description: Crownfall — a world-conquest strategy game

Zip the `dist/win-unpacked` folder as `Crownfall/Crownfall.exe` plus its sibling files. Do not pack or obfuscate the exe. Do not commit `node_modules`, `dist`, or the copied `index.html`.
