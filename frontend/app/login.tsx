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

interface FormErrors {
  username?: string
  password?: string
}

export default function LoginScreen() {
  const router = useRouter()
  const { signIn } = useAuth()
  const { notify } = useNotification()

  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [errors, setErrors] = useState<FormErrors>({})

  const validate = (): boolean => {
    const newErrors: FormErrors = {}

    if (!username.trim()) {
      newErrors.username = 'Введите имя пользователя'
    }

    if (!password.trim()) {
      newErrors.password = 'Введите пароль'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleLogin = async () => {
    if (!validate()) return

    setLoading(true)

    try {
      const { token } = await authService.login({ username, password })

      await signIn(token)

      router.replace('/(tabs)')
    } catch (error) {
      notify('error', getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  const handleUsernameChange = (value: string) => {
    setUsername(value)
    if (errors.username) {
      setErrors((prev) => ({ ...prev, username: undefined }))
    }
  }

  const handlePasswordChange = (value: string) => {
    setPassword(value)
    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: undefined }))
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Вход</Text>

      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, errors.username && styles.inputError]}
          placeholder="Имя пользователя"
          placeholderTextColor="#999"
          value={username}
          onChangeText={handleUsernameChange}
          autoCapitalize="none"
        />
        {errors.username && (
          <Text style={styles.errorText}>{errors.username}</Text>
        )}
      </View>

      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, errors.password && styles.inputError]}
          placeholder="Пароль"
          placeholderTextColor="#999"
          value={password}
          onChangeText={handlePasswordChange}
          secureTextEntry
        />
        {errors.password && (
          <Text style={styles.errorText}>{errors.password}</Text>
        )}
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Войти</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/register')}>
        <Text style={styles.link}>
          Нет аккаунта?{' '}
          <Text style={styles.linkBold}>Зарегистрироваться</Text>
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
  inputWrapper: {
    width: '100%',
    marginBottom: 16,
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
  },
  inputError: {
    borderColor: '#e53935',
  },
  errorText: {
    marginTop: 6,
    marginLeft: 4,
    fontSize: 13,
    color: '#e53935',
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
