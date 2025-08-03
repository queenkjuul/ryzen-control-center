# ryzen-control-center

Quick and dirty wrapper for [RyzenAdj](https://github.com/FlyGoat/RyzenAdj) on Linux (and maybe Windows)

Maybe someday, less quick and dirty, and instead a D-Bus client for [`ryzend`](https://github.com/queenkjuul/ryzend)

## About

Inspired by the now-abandoned [Ryzen Controller](https://gitlab.com/ryzen-controller-team/ryzen-controller), designed for simple tray-focused interaction.

Built with Electron, Vite, React, and Tailwind.

Development is focused on compatibility with latest Ubuntu, but should be mostly platform-independent.

## Roadmap

### MVP

- [ ] per-interaction admin authentication (sudo/UAC) for getting and setting `ryzenadj`
- [ ] tray icon for showing current config and setting values
- [ ] main window for editing current config and setting tray options
- [ ] app runs with only tray icon after main window is closed
- [ ] settings persistence
- [ ] snap and AppImage packaging

### Planned

- [ ] Full config presets
- [ ] In-app documentation for each parameter
- [ ] Full light and dark mode support
- [ ] `.deb` / `.rpm` packaging

### Stretch

- [ ] `ryzenadj` snap packaging
- [ ] `ryzenadjd` systemd service to run with admin privileges (allow non-root settings adjustment)
- [ ] Integration with other power monitoring (e.g. show current battery draw, `powertop` interaction)
- [ ] `asusctl`/ROG Control Center integration
- [ ] Ubuntu PPA packaging

## Usage

It should be straightforward. For details on various parameters, see the RyzenAdj docs.

### Ubuntu

Due to an incompatibility between Ubuntu 25+, Node.js, and polkit, sudo operations called from a Node process can hang for a long time.

The issue is being tracked on the polkit github: [#572](https://github.com/polkit-org/polkit/issues/572)

This can be worked around by setting a lower `ulimit -Sn` or `ulimit -Hn` value. The app will do this automatically if it detects it is running on Ubuntu 25+, or if either the `ULIMIT_S` or `ULIMIT_H` environment variables are set. These variables set the threshold value for each limit. If the system limit is above the threshold value, it will be clamped to the provided value. If the system value is below the threshold, it is not adjusted.

My system works fine with both clamping values set to `524288`, so that's the default. Values can be as low as `1024`.

**SETTING VERY LOW OR VERY HIGH VALUES MAY CAUSE SYSTEM PROBLEMS. I TAKE NO RESPONSIBILITY FOR YOUR SYSTEM. USE THIS SOFTWARE AT YOUR OWN RISK**

## Development

### Project Setup

#### Install

```bash
$ npm install
```

#### Development

```bash
$ npm run dev
```

#### Build

```bash
# For windows
$ npm run build:win

# For Linux
$ npm run build:linux
```

#### Code of Conduct

be nice, stay woke; be gay, do crime; live long, and prosper.

## License

(C) 2025 queenkjuul

Distributed under the terms of the GNU General Public License Version 3 (GNU GPL v3)

AMD, Ryzen, and the AMD logo are trademarks of Advanced Micro Devices, Inc.; this project claims no rights to these trademarks.
