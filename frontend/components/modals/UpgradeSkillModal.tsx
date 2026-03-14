import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Branch, SkillNode } from '@/types/skills'

interface Props {
  node: SkillNode | null
  branch: Branch | null
  level: number
  status: 'locked' | 'available' | 'partial' | 'maxed'
  onCancel: () => void
  onConfirm: () => void
}

export const UpgradeSkillModal = ({ node, branch, level, status, onCancel, onConfirm }: Props) => {
  if (!node || !branch) return null

  const canUpgrade = status === 'available' || status === 'partial'

  return (
    <View style={styles.modalCard}>
      <View style={[styles.modalHeader, { backgroundColor: branch.bgColor }]}>
        <Text style={styles.modalEmoji}>{node.emoji}</Text>
        <View style={{ flex: 1 }}>
          <Text style={[styles.modalTitle, { color: branch.color }]}>
            {node.name}
          </Text>
          <Text style={styles.modalBranch}>{branch.label}</Text>
        </View>
        <TouchableOpacity onPress={onCancel} style={styles.closeBtn}>
          <Text style={styles.closeBtnText}>✕</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.modalBody}>
        <Text style={styles.modalDesc}>{node.desc}</Text>

        <View style={styles.modalProgress}>
          <Text style={styles.modalProgressLabel}>
            Уровень: {level} / {node.maxLevel}
          </Text>
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${(level / node.maxLevel) * 100}%`,
                  backgroundColor: branch.color
                }
              ]}
            />
          </View>
        </View>

        {node.requires && (
          <View style={styles.modalRequires}>
            <Text style={styles.modalRequiresText}>
              🔗 Требует: максимального уровня предыдущего таланта
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.upgradeBtn,
            { backgroundColor: canUpgrade ? branch.color : '#E5E7EB' }
          ]}
          disabled={!canUpgrade}
          onPress={onConfirm}
        >
          <Text
            style={[
              styles.upgradeBtnText,
              { color: canUpgrade ? '#fff' : '#9CA3AF' },
            ]}
          >
            {canUpgrade
              ? `Улучшить (${node.cost} ОТ)`
              : status === 'maxed'
              ? '✅ Максимальный уровень'
              : '🔒 Заблокировано'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000050',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    gap: 12,
  },
  modalEmoji: {
    fontSize: 32,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  modalBranch: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#00000015',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: {
    fontSize: 14,
    color: '#555',
    fontWeight: '600',
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingBottom: 36,
    paddingTop: 16,
    gap: 16,
  },
  modalDesc: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
  },
  modalProgress: {
    gap: 8,
  },
  modalProgressLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
  },
  modalRequires: {
    backgroundColor: '#FEF3C7',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  modalRequiresText: {
    fontSize: 13,
    color: '#92400E',
  },
  upgradeBtn: {
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  upgradeBtnText: {
    fontSize: 15,
    fontWeight: '700',
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#EDE9FE',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#A78BFA',
    borderRadius: 999,
  },
})