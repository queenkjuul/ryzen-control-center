// The contents of this file are licensed as follows:

// ISC License

// Copyright 2017 martinlevesque

// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.

// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
// REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
// AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
// INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
// LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
// OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
// PERFORMANCE OF THIS SOFTWARE.

'use strict'

import fs from 'fs'
import { logger } from '../logger'

export function lsbRelease(): {
  DISTRIB_ID?: string
  DISTRIB_RELEASE?: string
  DISTRIB_CODENAME?: string
  DISTRIB_DESCRIPTION?: string
} {
  const result = {}

  try {
    const relContent = fs.readFileSync('/etc/lsb-release').toString()

    if (!relContent) {
      return {}
    }

    const lines = relContent.split(/\r?\n/)

    for (const l of lines) {
      const row = l.split('=')

      if (row.length == 2) {
        result[row[0]] = row[1]
      }
    }
  } catch (error) {
    logger.warn('Error parsing lsb-release', error)
    return {}
  }

  return result
}
