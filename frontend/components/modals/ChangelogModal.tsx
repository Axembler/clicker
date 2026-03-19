import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native'

interface Props {
  visible:   boolean
  changelog: string | null
  onDismiss: () => void
}

export function ChangelogModal({ visible, changelog, onDismiss }: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.container}>

          <View style={styles.header}>
            <Text style={styles.badge}>✅ Обновлено</Text>
            <Text style={styles.title}>Что нового</Text>
          </View>

          <ScrollView
            style={styles.scroll}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.changelog}>
              {changelog ?? 'Улучшения производительности и исправления ошибок.'}
            </Text>
          </ScrollView>

          <TouchableOpacity style={styles.button} onPress={onDismiss}>
            <Text style={styles.buttonText}>Отлично!</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex:            1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent:  'flex-end',
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius:  20,
    borderTopRightRadius: 20,
    padding:    24,
    paddingBottom: 40,
    maxHeight:  '60%',
  },
  header: {
    alignItems:   'center',
    marginBottom: 16,
  },
  badge: {
    fontSize:     13,
    color:        '#34C759',
    fontWeight:   '600',
    marginBottom: 6,
  },
  title: {
    fontSize:   22,
    fontWeight: '700',
    color:      '#000',
  },
  scroll: {
    marginBottom: 20,
  },
  changelog: {
    fontSize:   15,
    lineHeight: 24,
    color:      '#333',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius:    14,
    paddingVertical: 15,
    alignItems:      'center',
  },
  buttonText: {
    color:      '#fff',
    fontWeight: '700',
    fontSize:   16,
  },
})
