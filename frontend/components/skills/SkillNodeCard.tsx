import { memo } from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Skill, SkillNode, SkillNodeStatus } from "@/types/skills"

export const SkillNodeCard = memo(({ node, skill, status, level, onPress }: {
  node: SkillNode
  skill: Skill
  status: SkillNodeStatus
  level: number
  onPress: () => void
}) => {
  const isLocked = status === 'locked'
  const isMaxed = status === 'maxed'

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isLocked || isMaxed}
      activeOpacity={0.7}
      style={[
        styles.nodeCard,
        { borderColor: isLocked ? '#E5E7EB' : skill.color + '40' },
        isMaxed && { backgroundColor: skill.bgColor },
        status === 'partial' && { borderColor: skill.color + '80' },
      ]}
    >
      <View style={[
        styles.nodeIcon,
        { backgroundColor: isLocked ? '#F3F4F6' : skill.bgColor },
      ]}>
        <Text style={[styles.nodeEmoji, isLocked && { opacity: 0.4 }]}>
          {node.emoji}
        </Text>
      </View>

      <View style={styles.nodeContent}>
        <Text
          style={[
            styles.nodeName,
            isLocked && { color: '#9CA3AF' },
            isMaxed && { color: skill.color },
          ]}
          numberOfLines={1}
        >
          {node.name}
        </Text>

        <Text style={styles.nodeDesc} numberOfLines={2}>
          {node.desc}
        </Text>
      </View>

      <View style={styles.nodeRight}>
        {node.maxLevel > 1 && (
          <View style={[styles.levelDots]}>
            {Array.from({ length: node.maxLevel }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.levelDot, 
                  { backgroundColor: i < level ? skill.color : skill.color + '25' }
                ]}
              />
            ))}
          </View>
        )}

        <View style={[
          styles.statusBadge,
          isMaxed
            ? { backgroundColor: skill.color }
            : isLocked
            ? { backgroundColor: '#F3F4F6' }
            : { backgroundColor: skill.bgColor },
        ]}>
          <Text style={[
            styles.statusText,
            isMaxed
              ? { color: '#fff' }
              : isLocked
              ? { color: '#9CA3AF' }
              : { color: skill.color },
          ]}>
            {isMaxed ? 'MAX' : isLocked ? '🔒' : `${node.cost} ОТ`}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
})

const styles = StyleSheet.create({
  nodeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    gap: 12,
    borderWidth: 1.5,
    borderColor: '#F0EBFF',
    shadowColor: '#C4B5FD',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  nodeIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  nodeEmoji: {
    fontSize: 24,
  },
  nodeContent: {
    flex: 1,
    gap: 3,
  },
  nodeName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  nodeDesc: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  nodeRight: {
    alignItems: 'flex-end',
    gap: 6,
    flexShrink: 0,
  },
  levelDots: {
    flexDirection: 'row',
    gap: 3,
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    maxWidth: 70,
  },
  levelDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statusBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  }
})