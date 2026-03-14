import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { useCallback, useMemo, useState } from 'react'
import { UpgradeSkillModal } from '@/components/modals/UpgradeSkillModal'
import { useModal } from '@/context/modal-context'
import { Branch, SkillLevels, SkillNode, SkillNodeStatus } from '@/types/skills'
import { BRANCHES, INITIAL_POINTS } from '@/helpers/branches'
import { Connector, SkillsHeader, SkillNodeCard } from '@/components/skills'
import { MainLayout } from '@/components/layouts/MainLayout'

function getNodeStatus(node: SkillNode, branch: Branch, levels: SkillLevels, points: number): SkillNodeStatus {
  const current = levels[node.id] ?? 0

  if (current >= node.maxLevel) return 'maxed'

  if (node.requires) {
    const reqNode = branch.nodes.find((n) => n.id === node.requires)

    if (!reqNode) return 'locked'

    const reqLevel = levels[node.requires] ?? 0

    if (reqLevel < reqNode.maxLevel) return 'locked'
  }

  if (current > 0) return 'partial'

  if (points >= node.cost) return 'available'

  return 'locked'
}

const totalNodes = BRANCHES.reduce((s, b) => s + b.nodes.length, 0)

export default function SkillTreeScreen() {
  const { showModal, hideModal } = useModal()

  const [talentPoints, setTalentPoints] = useState(INITIAL_POINTS)
  const [levels, setLevels] = useState<SkillLevels>({})

  const unlockedNodes = useMemo(
    () => Object.values(levels).filter((l) => l > 0).length,
    [levels]
  )

  const handleUpgrade = useCallback(
    (node: SkillNode) => {
      const current = levels[node.id] ?? 0

      if (current >= node.maxLevel) return
      if (talentPoints < node.cost) return

      setLevels((prev) => ({ ...prev, [node.id]: current + 1 }))

      setTalentPoints((p) => p - node.cost)

      hideModal()
    },
    [levels, talentPoints, hideModal]
  )

  const handleNodePress = useCallback(
    (node: SkillNode, branch: Branch) => {
      showModal(
        <UpgradeSkillModal
          node={node}
          branch={branch}
          level={levels[node.id] ?? 0}
          status={getNodeStatus(node, branch, levels, talentPoints)}
          onCancel={hideModal}
          onConfirm={() => handleUpgrade(node)}
        />
      )
    }, [showModal, hideModal, levels, talentPoints, handleUpgrade]
  )

  return (
    <MainLayout>
      <SkillsHeader
        talentPoints={talentPoints}
        unlockedNodes={unlockedNodes}
        totalNodes={totalNodes}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        style={{ width: '100%' }}
      >
        {BRANCHES.map((branch) => (
          <View key={branch.id} style={styles.branchSection}>
            <View style={[
              styles.branchHeader,
              { backgroundColor: branch.bgColor }
            ]}>
              <Text style={styles.branchEmoji}>{branch.emoji}</Text>

              <Text style={[styles.branchLabel, { color: branch.color }]}>
                {branch.label}
              </Text>

              <View style={styles.branchProgress}>
                {branch.nodes.map((n) => {
                  const lv = levels[n.id] ?? 0
                  const isFull = lv >= n.maxLevel

                  return (
                    <View key={n.id} style={[
                      styles.branchDot,
                      { backgroundColor: isFull
                        ? branch.color
                        : lv > 0
                        ? branch.color + '50'
                        : branch.color + '20'
                    }]}/>
                  )
                })}
              </View>
            </View>

            {branch.nodes.map((node, idx) => {
              const lv = levels[node.id] ?? 0
              const status = getNodeStatus(node, branch, levels, talentPoints)

              return (
                <View key={node.id}>
                  {idx > 0 && <Connector color={branch.color} />}

                  <SkillNodeCard
                    node={node}
                    branch={branch}
                    status={status}
                    level={lv}
                    onPress={() => handleNodePress(node, branch)}
                  />
                </View>
              )
            })}

            <View style={styles.branchDivider} />
          </View>
        ))}
      </ScrollView>
    </MainLayout>
  )
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 60,
    gap: 0,
  },

  branchSection: {
    marginBottom: 8,
  },
  branchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 10,
    gap: 8,
  },
  branchEmoji: {
    fontSize: 20,
  },
  branchLabel: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  branchProgress: {
    flexDirection: 'row',
    gap: 4,
  },
  branchDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  branchDivider: {
    height: 20,
  }
})
