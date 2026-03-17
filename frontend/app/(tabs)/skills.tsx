import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { useCallback, useMemo, useState } from 'react'
import { UpgradeSkillModal } from '@/components/modals/UpgradeSkillModal'
import { useModal } from '@/context/modal-context'
import { Skill, SkillLevels, SkillNode, SkillNodeStatus } from '@/types/skills'
import { Connector, SkillsHeader, SkillNodeCard } from '@/components/skills'
import { MainLayout } from '@/components/layouts/MainLayout'
import { LoadingBanner } from '@/components/ui/LoadingBanner'
import { useSkills } from '@/hooks/use-skills'
import { useUserSkills } from '@/hooks/use-user-skills'
import { useUser } from '@/context/user-context'
import { buySkill } from '@/services/skills'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { useNotification } from '@/context/notification-context'
import { useStats } from '@/hooks/use-stats'

function getNodeStatus(node: SkillNode, skill: Skill, levels: SkillLevels, points: number): SkillNodeStatus {
  const current = levels[node.id] ?? 0

  if (current >= node.maxLevel) return 'maxed'

  if (node.requires) {
    const reqNode = skill.nodes.find((n) => n.id === node.requires)

    if (!reqNode) return 'locked'

    const reqLevel = levels[node.requires] ?? 0

    if (reqLevel < reqNode.maxLevel) return 'locked'
  }

  if (current > 0) return 'partial'

  if (points >= node.cost) return 'available'

  return 'locked'
}

export default function Skills() {
  const { data, isLoading } = useSkills()
  const { user, refetchUser } = useUser()
  const { data: userSkills, refetchData  } = useUserSkills()
  const { refetchData: refetchStats  } = useStats()
  const { notify } = useNotification()

  const { showModal, hideModal } = useModal()
  const skillPoints = user?.skillPoints ?? 0

  const isInitialLoading = isLoading && !data

  const totalNodes = data && data.reduce((s, b) => s + b.nodes.length, 0)

  const levels = useMemo<Record<string, number>>(() => {
    if (!userSkills) return {}

    return userSkills.reduce((acc, userSkill) => {
      acc[userSkill.nodeId] = userSkill.level

      return acc
    }, {} as Record<string, number>)
  }, [userSkills])

  const unlockedNodes = useMemo(() => {
    return Object.values(levels).filter((lv) => lv > 0).length
  }, [levels])

  const handleUpgrade = useCallback(
    async (node: SkillNode, skillId: string) => {
      const current = levels[node.id] ?? 0

      if (current >= node.maxLevel) return
      if (skillPoints < node.cost) return

      try {
        await Promise.all([await buySkill(skillId, node.id), refetchUser(), refetchData(), refetchStats()])

        hideModal()
      } catch (error) {
        notify('error', getErrorMessage(error))
      }
    },
    [levels, hideModal, buySkill, refetchUser, refetchData, refetchStats]
  )

  const handleNodePress = useCallback(
    (node: SkillNode, skill: Skill) => {
      showModal(
        <UpgradeSkillModal
          node={node}
          skill={skill}
          level={levels[node.id] ?? 0}
          status={getNodeStatus(node, skill, levels, skillPoints)}
          onCancel={hideModal}
          onConfirm={() => handleUpgrade(node, skill._id)}
        />
      )
    }, [showModal, hideModal, levels, skillPoints, handleUpgrade]
  )

  return (
    <MainLayout>
      <SkillsHeader
        skillPoints={skillPoints}
        unlockedNodes={unlockedNodes}
        totalNodes={totalNodes ?? 0}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        style={{ width: '100%' }}
      >
        {isInitialLoading
        ? <LoadingBanner message='Загрузка талантов...' />

        : data?.map((skill) => (
          <View key={skill.id} style={styles.branchSection}>
            <View style={[
              styles.branchHeader,
              { backgroundColor: skill.bgColor }
            ]}>
              <Text style={styles.branchEmoji}>{skill.emoji}</Text>

              <Text style={[styles.branchLabel, { color: skill.color }]}>
                {skill.label}
              </Text>

              <View style={styles.branchProgress}>
                {skill.nodes.map((node) => {
                  const lv = levels[node.id] ?? 0
                  const isFull = lv >= node.maxLevel

                  return (
                    <View key={node.id} style={[
                      styles.branchDot,
                      { backgroundColor: isFull
                        ? skill.color
                        : lv > 0
                        ? skill.color + '50'
                        : skill.color + '20'
                    }]}/>
                  )
                })}
              </View>
            </View>

            {skill.nodes.map((node, idx) => {
              const lv = levels[node.id] ?? 0
              const status = getNodeStatus(node, skill, levels, skillPoints)

              return (
                <View key={node.id}>
                  {idx > 0 && <Connector color={skill.color} />}

                  <SkillNodeCard
                    node={node}
                    skill={skill}
                    status={status}
                    level={lv}
                    onPress={() => handleNodePress(node, skill)}
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
