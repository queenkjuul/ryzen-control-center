# ryzen-control-center

Quick and dirty wrapper for [RyzenAdj](https://github.com/FlyGoat/RyzenAdj) on Linux (and maybe Windows)

## About

Inspired by the now-abandoned [Ryzen Controller](https://gitlab.com/ryzen-controller-team/ryzen-controller), designed for simple tray-focused interaction.

Built with Electron, Vite, and Svelte.

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
- [ ] Rewrite `IpcClient` to use Promises/async

## Development

### Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) + [Svelte](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode)

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

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```

#### Code of Conduct

be nice; stay woke; be gay, do crime; live long, and prosper.

## License

(C) 2025 queenkjuul

Distributed under the terms of the GNU General Public License Version 3 (GNU GPL v3)

AMD, Ryzen, and the AMD logo are trademarks of Advanced Micro Devices, Inc.; this project claims no rights to these trademarks.

---

Normally I just release everything under something permissive, e.g. MIT or CC0. However, I plan to copy documentation from the RyzenAdj Wiki, and RyzenAdj is under GPLv3, and I might technically be taking "source code" from RyzenAdj in the form of the Wiki contents.

IANAL so I'll just stick with GPLv3. You win this one, Stallman.
