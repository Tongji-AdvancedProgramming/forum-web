const baseUrl = "http://10.80.43.196"

export function getAvatarUrl(uid: string) {
  return `${baseUrl}/avatar/${uid}`
}

export function getCardBackgroundUrl(uid: string) {
  return `${baseUrl}/card/${uid}`
}
