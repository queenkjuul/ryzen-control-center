import { nativeTheme } from 'electron'
import amd_logo_black from '/@res/amd-logo-black.png?asset'
import amd_logo_dark from '/@res/amd-logo-dark.png?asset'
import amd_logo_light from '/@res/amd-logo-light.png?asset'
import amd_logo_white from '/@res/amd-logo-white.png?asset'

export function getIconPath(
  dark = nativeTheme.shouldUseDarkColors,
  hiC = nativeTheme.shouldUseHighContrastColors
): string {
  return hiC ? (dark ? amd_logo_white : amd_logo_black) : dark ? amd_logo_dark : amd_logo_light
}
