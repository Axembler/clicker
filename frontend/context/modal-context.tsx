import React, { createContext, useContext, useState, useCallback, useRef } from 'react'
import { Modal, View, Animated, StyleSheet, Pressable } from 'react-native'

interface ModalOptions {
  closeOnBackdrop?: boolean
  backdropColor?: string
}

interface ModalContextType {
  showModal: (content: React.ReactNode, options?: ModalOptions) => void
  hideModal: () => void
}

const ModalContext = createContext<ModalContextType>({
  showModal: () => {},
  hideModal: () => {},
})

export const useModal = () => useContext(ModalContext)

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [visible, setVisible] = useState(false)
  const [content, setContent] = useState<React.ReactNode>(null)
  const [options, setOptions] = useState<ModalOptions>({
    closeOnBackdrop: true,
    backdropColor: 'rgba(0, 0, 0, 0.55)',
  })

  const backdropOpacity = useRef(new Animated.Value(0)).current
  const cardScale = useRef(new Animated.Value(0.85)).current
  const cardOpacity = useRef(new Animated.Value(0)).current

  const animateIn = useCallback(() => {
    Animated.parallel([
      Animated.timing(backdropOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
      Animated.spring(cardScale, { toValue: 1, tension: 65, friction: 8, useNativeDriver: true }),
      Animated.timing(cardOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
    ]).start()
  }, [])

  const animateOut = useCallback((callback?: () => void) => {
    Animated.parallel([
      Animated.timing(backdropOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(cardScale, { toValue: 0.85, duration: 200, useNativeDriver: true }),
      Animated.timing(cardOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(callback)
  }, [])

  const showModal = useCallback((newContent: React.ReactNode, newOptions?: ModalOptions) => {
    setContent(newContent)
    setOptions({
      closeOnBackdrop: true,
      backdropColor: 'rgba(0, 0, 0, 0.55)',
      ...newOptions,
    })
    setVisible(true)
    animateIn()
  }, [animateIn])

  const hideModal = useCallback(() => {
    animateOut(() => {
      setVisible(false)
      setContent(null)
    })
  }, [animateOut])

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}

      <Modal
        visible={visible}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={hideModal}
      >
        <Animated.View
          style={[
            styles.backdrop,
            { opacity: backdropOpacity, backgroundColor: options.backdropColor, },
          ]}
        >
          {options.closeOnBackdrop && (
            <Pressable style={StyleSheet.absoluteFill} onPress={hideModal} />
          )}
        </Animated.View>

        <View style={styles.centeredView} pointerEvents="box-none">
          <Animated.View
            style={{
              width: '100%',
              opacity: cardOpacity,
              transform: [{ scale: cardScale }],
            }}
          >
            {content}
          </Animated.View>
        </View>
      </Modal>
    </ModalContext.Provider>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32
  }
})
