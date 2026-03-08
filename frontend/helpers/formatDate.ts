export const formatDate = (unlockedAt: string): string | null => unlockedAt
  ? new Date(unlockedAt).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  : null