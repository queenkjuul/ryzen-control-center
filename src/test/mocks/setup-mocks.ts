import { vi } from 'vitest'

vi.mock('@electron-toolkit/utils', async () => {
  return {
    is: {
      dev: false
    }
  }
})
