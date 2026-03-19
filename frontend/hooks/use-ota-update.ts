import * as Updates from 'expo-updates'
import * as SecureStore from 'expo-secure-store'
import { useEffect, useState } from 'react'

const CHANGELOG_KEY = 'changelog'

type OTAStatus = 'idle' | 'show-changelog'

export function useOTAUpdate() {
  const [status, setStatus] = useState<OTAStatus>('idle')
  const [changelog, setChangelog] = useState<string | null>(null)

  useEffect(() => {
    showPendingChangelog().then(() => {
      checkAndInstallUpdate()
    })
  }, [])

  async function showPendingChangelog() {
    try {
      const pending = await SecureStore.getItemAsync(CHANGELOG_KEY)
      if (pending) {
        setChangelog(pending)
        setStatus('show-changelog')
        await SecureStore.deleteItemAsync(CHANGELOG_KEY)
      }
    } catch (error) {
      console.error('[OTA] Ошибка чтения changelog:', error)
    }
  }

  async function checkAndInstallUpdate() {
    if (__DEV__) return

    try {
      const update = await Updates.checkForUpdateAsync()

      if (!update.isAvailable) return

      const message = extractChangelog(update)
      if (message) {
        await SecureStore.setItemAsync(CHANGELOG_KEY, String(message))
      }

      await Updates.fetchUpdateAsync()
      await Updates.reloadAsync()

    } catch (error) {
      console.error('[OTA] Ошибка обновления:', error)
      await SecureStore.deleteItemAsync(CHANGELOG_KEY).catch(() => {})
    }
  }

  function dismissChangelog() {
    setStatus('idle')
    setChangelog(null)
  }

  return {
    showChangelog: status === 'show-changelog',
    changelog,
    dismissChangelog,
  }
}

function extractChangelog(update: Updates.UpdateCheckResultAvailable): string | null {
  try {
    const manifest = update.manifest as Record<string, unknown>

    const metadata = manifest?.metadata as Record<string, unknown> | undefined
    if (metadata?.message) return String(metadata.message)

    if (manifest?.message) return String(manifest.message)

    return null
  } catch {
    return null
  }
}
