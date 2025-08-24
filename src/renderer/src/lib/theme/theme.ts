import { setSetting } from '/@renderer/lib/ipc-client'
import { convertThemeToStyleString, parseThemeCSS } from '/@renderer/lib/theme/theme-parsing'
import type { AppSettings } from '/@types/app-settings'
import { Themes } from '/@types/themes'

export function setTheme(themeController: HTMLInputElement, settings: Partial<AppSettings>): void {
  themeController.checked = !!(
    settings.useCustomTheme ||
    settings.highContrast ||
    settings.forceHighContrast
  )

  try {
    const rootElem = document.querySelector('html')!
    if (settings.useCustomCss) {
      rootElem.style = convertThemeToStyleString(parseThemeCSS(settings.customCss))
      return
    } else {
      rootElem.style = ''
    }
  } catch (_error) {
    // swallow error, fall back to other settings
  }
  const systemDark = matchMedia('(prefers-color-scheme: dark)').matches
  if (!settings.useCustomTheme) {
    console.log('updating dark', systemDark)
    setSetting('dark', systemDark)
    settings.dark = systemDark
  }
  const theme =
    settings.theme && settings.useCustomTheme
      ? settings.theme
      : settings.highContrast || settings.forceHighContrast
        ? settings.dark
          ? Themes['amd-dark-hic']
          : Themes['amd-light-hic']
        : settings.dark
          ? Themes['amd-dark']
          : Themes['amd-light']
  themeController.value = theme
  if (settings.dark) {
    document.querySelector('html')?.classList.add('dark')
  } else {
    document.querySelector('html')?.classList.remove('dark')
  }
}
