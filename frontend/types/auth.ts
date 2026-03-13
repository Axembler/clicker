export interface AuthCredentials {
  username: string
  password: string
}

export interface AuthResponse {
  token: string
  message?: string
  user: {
    id: string
    username: string
  }
}