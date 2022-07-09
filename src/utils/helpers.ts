const avatarURL = "https://avatars.dicebear.com/api/identicon/"

export const getAvatarURL = () => {
  const seed = Math.round(Math.random() * 99999)
  return `${avatarURL}${seed}.svg`
}

// mulberry32
export const getRandomFromSeed = (a: number) => {
  var t = (a += 0x6d2b79f5)
  t = Math.imul(t ^ (t >>> 15), t | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

export const getBrowserLocales = (options = {}) => {
  const defaultOptions = {
    languageCodeOnly: false,
  }
  const opt = {
    ...defaultOptions,
    ...options,
  }
  const browserLocales =
    navigator.languages === undefined
      ? [navigator.language]
      : navigator.languages
  if (!browserLocales) {
    return undefined
  }
  return browserLocales.map((locale) => {
    const trimmedLocale = locale.trim()
    return opt.languageCodeOnly ? trimmedLocale.split(/-|_/)[0] : trimmedLocale
  })
}
