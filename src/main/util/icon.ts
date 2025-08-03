import { nativeTheme } from 'electron'
import amd_logo_dark from '/@res/amd-logo-dark.png?asset'
import amd_logo_light from '/@res/amd-logo-light.png?asset'
import amd_logo_white from '/@res/amd-logo-white.png?asset'
import amd_logo_black from '/@res/amd_logo_black.png?asset'

const icons: Array<Array<string>> = [
  [amd_logo_dark, amd_logo_black],
  [amd_logo_light, amd_logo_white]
]

function getDark(hiC: boolean, invert: boolean): string {
  return icons[invert ? 1 : 0][hiC ? 1 : 0]
}

function getLight(hiC: boolean, invert: boolean): string {
  return icons[invert ? 0 : 1][hiC ? 1 : 0]
}

export function getIconPath(): string {
  const {
    shouldUseDarkColors: dark,
    shouldUseHighContrastColors: hiC,
    shouldUseInvertedColorScheme: invert
  } = nativeTheme
  return dark ? getDark(hiC, invert) : getLight(hiC, invert)
}
