const HIGH_SCORES_KEY = 'space_strike_high_scores'
const SETTINGS_KEY = 'space_strike_settings'

export function getHighScores() {
  try {
    const raw = localStorage.getItem(HIGH_SCORES_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((s) => typeof s === 'number').sort((a, b) => b - a).slice(0, 5)
  } catch {
    return []
  }
}

export function saveHighScore(score) {
  const scores = getHighScores()
  scores.push(Math.floor(score))
  const top = scores.sort((a, b) => b - a).slice(0, 5)
  try {
    localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(top))
  } catch {
    // ignore
  }
  return top
}

export function getSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (!raw) return { soundOn: true }
    const parsed = JSON.parse(raw)
    return { soundOn: parsed.soundOn !== false }
  } catch {
    return { soundOn: true }
  }
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  } catch {
    // ignore
  }
}