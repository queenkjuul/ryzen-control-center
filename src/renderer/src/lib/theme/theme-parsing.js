// CODE BELOW THIS LINE IS FROM THE DAISYUI PROJECT
// UNDER THE FOLLOWING LICENSE TERMS:

// MIT License

// Copyright (c) 2020 Pouya Saadeghi

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import {
  validateBoolean,
  validateBorderWidth,
  validateColor,
  validateDepth,
  validateNoise,
  validateRadius,
  validateSize,
  validateThemeName
} from './theme-validation'

const roundToThreeDecimals = (num) => Math.round(num * 1000) / 1000

const convertOklchToPercentage = (color) => {
  const oklchRegex = /^oklch\((\d*\.?\d+)(%?) (\d*\.?\d+) (\d*\.?\d+)\)$/
  const match = color.match(oklchRegex)

  if (match) {
    let [_, lightness, unit, chroma, hue] = match
    lightness = unit === '%' ? parseFloat(lightness) : parseFloat(lightness) * 100
    lightness = roundToThreeDecimals(lightness)
    chroma = roundToThreeDecimals(parseFloat(chroma))
    hue = roundToThreeDecimals(parseFloat(hue))
    return `oklch(${lightness}% ${chroma} ${hue})`
  }

  return color
}

export function parseThemeCSS(text, currentThemeData) {
  const regex = /^@plugin "daisyui\/theme" \{[\s\S]*\}$/m
  const isValidStructure = regex.test(text)

  if (!isValidStructure) {
    throw new Error('Invalid CSS structure: Must start with @plugin "daisyui/theme" {')
  }

  const match = text.match(/[^{]*\{([^}]*)\}/)

  if (!match) {
    throw new Error('Failed to extract properties from CSS text')
  }

  const props = match[1]
    .split(';')
    .map((prop) => prop.trim())
    .filter(Boolean)

  // Log the extracted properties

  const newThemeData = { ...currentThemeData }
  let hasErrors = false

  for (const prop of props) {
    const [key, value] = prop.split(':').map((s) => s.trim())

    // Log each key-value pair

    // Handle base theme properties
    if (key === 'name') {
      const cleanName = value.replace(/['"]/g, '')
      if (!validateThemeName(cleanName)) {
        throw new Error(`Invalid theme name: ${cleanName} (must be 3-20 lowercase letters)`)
      }
      newThemeData.name = cleanName
    } else if (key === 'color-scheme') {
      const scheme = value.replace(/['"]/g, '')
      if (!['light', 'dark'].includes(scheme)) {
        throw new Error(`Invalid color-scheme: ${scheme} (must be "light" or "dark")`)
      }
      newThemeData['color-scheme'] = scheme
    } else if (key === 'default') {
      if (!validateBoolean(value.trim())) {
        throw new Error(`Invalid value for default: ${value} (must be "true" or "false")`)
      }
      newThemeData.default = value.trim() === 'true'
    } else if (key === 'prefersdark') {
      if (!validateBoolean(value.trim())) {
        throw new Error(`Invalid value for prefersdark: ${value} (must be "true" or "false")`)
      }
      newThemeData.prefersdark = value.trim() === 'true'
    }
    // Handle CSS custom properties
    else if (key.startsWith('--color-')) {
      if (!validateColor(value)) {
        throw new Error(`Invalid color value for ${key}: ${value}`)
      }
      const convertedColor = convertOklchToPercentage(value)
      if (value !== convertedColor) {
        console.log(value, '→', convertedColor)
      }
      if (convertedColor) {
        newThemeData[key] = convertedColor
      } else {
        throw new Error(`Failed to convert color to OKLCH: ${value}`)
      }
    } else if (key.startsWith('--radius-')) {
      if (!validateRadius(value)) {
        throw new Error(
          `Invalid radius value for ${key}: ${value} (must be 0, 0.25rem, 0.5rem, 1rem, or 2rem)`
        )
      }
      newThemeData[key] = value
    } else if (key.startsWith('--size-')) {
      if (!validateSize(value)) {
        throw new Error(`Invalid size value for ${key}: ${value}`)
      }
      newThemeData[key] = value
    } else if (key === '--border') {
      if (!validateBorderWidth(value)) {
        throw new Error(`Invalid border width for ${key}: ${value}`)
      }
      newThemeData[key] = value
    } else if (key === '--depth') {
      if (!validateDepth(value)) {
        throw new Error(`Invalid depth value for ${key}: ${value}`)
      }
      newThemeData[key] = value
    } else if (key === '--noise') {
      if (!validateNoise(value)) {
        throw new Error(`Invalid noise value for ${key}: ${value}`)
      }
      newThemeData[key] = value
    } else {
      throw new Error(`Unknown property: ${key}`)
    }
  }

  if (!hasErrors) {
    return newThemeData
  }
  return null
}

export const convertThemeToStyleString = (currentTheme) => {
  let styleString = Object.entries(currentTheme)
    .filter(([key]) => !['prefersdark', 'default', 'name', 'type', 'id'].includes(key))
    .map(([key, value]) => `${key}:${value}`)
    .join(';')
  return styleString
}
