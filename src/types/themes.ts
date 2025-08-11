export enum Themes {
  'amd-dark' = 'amd-dark',
  'amd-light' = 'amd-light',
  'amd-dark-hic' = 'amd-dark-hic',
  'amd-light-hic' = 'amd-light-hic',
  abyss = 'abyss',
  acid = 'acid',
  aqua = 'aqua',
  autumn = 'autumn',
  black = 'black',
  bumblebee = 'bumblebee',
  business = 'business',
  caramellatte = 'caramellatte',
  cmyk = 'cmyk',
  coffee = 'coffee',
  corporate = 'corporate',
  cupcake = 'cupcake',
  cyberpunk = 'cyberpunk',
  dark = 'dark',
  dim = 'dim',
  dracula = 'dracula',
  emerald = 'emerald',
  fantasy = 'fantasy',
  forest = 'forest',
  garden = 'garden',
  halloween = 'halloween',
  lemonade = 'lemonade',
  light = 'light',
  lofi = 'lofi',
  luxury = 'luxury',
  night = 'night',
  nord = 'nord',
  pastel = 'pastel',
  retro = 'retro',
  silk = 'silk',
  sunset = 'sunset',
  synthwave = 'synthwave',
  valentine = 'valentine',
  winter = 'winter',
  wireframe = 'wireframe'
}

export type Theme = keyof typeof Themes

export const lightThemes: Theme[] = [
  Themes['amd-light'],
  Themes['amd-light-hic'],
  Themes.light,
  Themes.cupcake,
  Themes.bumblebee,
  Themes.emerald,
  Themes.corporate,
  Themes.retro,
  Themes.cyberpunk,
  Themes.valentine,
  Themes.garden,
  Themes.lofi,
  Themes.pastel,
  Themes.fantasy,
  Themes.wireframe,
  Themes.cmyk,
  Themes.autumn,
  Themes.acid,
  Themes.lemonade,
  Themes.winter,
  Themes.nord,
  Themes.caramellatte,
  Themes.silk
]

export const darkThemes = Object.keys(Themes).filter(
  (theme) => !lightThemes.includes(theme as Theme)
)

export function getDefaultTheme(dark, highContrast) {
  return dark
    ? highContrast
      ? Themes['amd-dark-hic']
      : Themes['amd-dark']
    : highContrast
      ? Themes['amd-light-hic']
      : Themes['amd-light']
}
