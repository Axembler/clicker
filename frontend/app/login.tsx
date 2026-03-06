import { authService } from '@/services/auth'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'

export default function LoginScreen() {
  const router = useRouter()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Ошибка', 'Заполни все поля')
      
      return
    }

    setLoading(true)
    
    try {
      await authService.login({ username, password })

      router.replace('/')
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось подключиться к серверу')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Вход</Text>

      <TextInput
        style={styles.input}
        placeholder="Имя пользователя"
        placeholderTextColor="#999"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Пароль"
        placeholderTextColor="#999"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.buttonText}>Войти</Text>
        }
      </TouchableOpacity>

      {/* Ссылка на регистрацию */}
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
  input: {
    width: '100%',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
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
