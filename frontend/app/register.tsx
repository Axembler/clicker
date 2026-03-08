import { useAuth } from '@/context/auth-context'
import { useNotification } from '@/context/notification-context'
import { authService } from '@/services/auth'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'

export default function RegisterScreen() {
  const router = useRouter()
  const { signIn } = useAuth()
  const { notify } = useNotification()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const [errors, setErrors] = useState({
    username: '',
    password: '',
  })

  const handleUsernameChange = (text: string) => {
    setUsername(text)
    
    if (errors.username) setErrors((prev) => ({ ...prev, username: '' }))
  }

  const handlePasswordChange = (text: string) => {
    setPassword(text)
    
    if (errors.password) setErrors((prev) => ({ ...prev, password: '' }))
  }

  const validate = (): boolean => {
    const newErrors = { username: '', password: '' }
    let isValid = true

    if (!username.trim()) {
      newErrors.username = 'Введите имя пользователя'
      isValid = false
    }

    if (!password) {
      newErrors.password = 'Введите пароль'
      isValid = false
    } else if (password.length < 6) {
      newErrors.password = 'Пароль должен быть минимум 6 символов'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleRegister = async () => {
    if (!validate()) return

    setLoading(true)

    try {
      const { token } = await authService.register({ username, password })
      await signIn(token)
      router.replace('/(tabs)')
    } catch (error) {
      notify('error', getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Регистрация</Text>

      <TextInput
        style={[styles.input, errors.username ? styles.inputError : null]}
        placeholder="Имя пользователя"
        placeholderTextColor="#999"
        value={username}
        onChangeText={handleUsernameChange}
        autoCapitalize="none"
      />
      {errors.username ? (
        <Text style={styles.errorText}>{errors.username}</Text>
      ) : null}

      <TextInput
        style={[styles.input, errors.password ? styles.inputError : null]}
        placeholder="Пароль (минимум 6 символов)"
        placeholderTextColor="#999"
        value={password}
        onChangeText={handlePasswordChange}
        secureTextEntry
      />
      {errors.password ? (
        <Text style={styles.errorText}>{errors.password}</Text>
      ) : null}

      <TouchableOpacity
        style={styles.button}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.buttonText}>Создать аккаунт</Text>
        }
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/login')}>
        <Text style={styles.link}>
          Уже есть аккаунт?{' '}
          <Text style={styles.linkBold}>Войти</Text>
        </Text>
      </TouchableOpacity>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
  },
  input: {
    width: '100%',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  inputError: {
    borderColor: '#e53935',
  },
  errorText: {
    width: '100%',
    color: '#e53935',
    fontSize: 13,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  button: {
    width: '100%',
    backgroundColor: '#6200ee',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    fontSize: 15,
    color: '#999',
  },
  linkBold: {
    color: '#6200ee',
    fontWeight: 'bold',
  },
})
