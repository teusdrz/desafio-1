import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api'

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Simple auth interceptor - will be enhanced later
apiClient.interceptors.request.use(
    async (config) => {
        // Add authorization logic here when authentication is implemented
        // const token = getAuthToken()
        // if (token) {
        //     config.headers.Authorization = `Bearer ${token}`
        // }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            window.location.href = '/auth/signin'
        }
        return Promise.reject(error)
    }
)
