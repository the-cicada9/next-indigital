'use client'

import { useEffect } from 'react'

// Define types for Indigitall SDK interfaces
interface DeviceInfo {
  id?: string
  platform?: string
  [key: string]: unknown
}

interface Permissions {
  push?: boolean
  location?: boolean
  [key: string]: unknown
}

type PermissionCallback = (permission: string) => void
type ErrorCallback = (error: unknown) => void
type LocationCallback = (location: Record<string, unknown>) => void
type InitCallback = (permissions: Permissions, device: DeviceInfo) => void
type UserRegisteredCallback = (device: DeviceInfo) => void

interface IndigitallAPI {
  init: (config: {
    appKey: string
    urlDeviceApi: string
    workerPath: string
    requestLocation: boolean
    onInitialized: InitCallback
    onNewUserRegistered: UserRegisteredCallback
    onLocationUpdated: LocationCallback
    onError: ErrorCallback
    requestPushPermission: PermissionCallback
    requestLocationPermission: PermissionCallback
  }) => void
}

declare global {
  interface Window {
    indigitall: IndigitallAPI
    onIndigitallInitialized?: InitCallback
    onNewUserRegistered?: UserRegisteredCallback
    onLocationUpdated?: LocationCallback
    onError?: ErrorCallback
    requestPushPermission?: PermissionCallback
    requestLocationPermission?: PermissionCallback
  }
}

const IndigitallProvider = () => {
  useEffect(() => {
    const loadIndigitall = () => {
      const script = document.createElement('script')
      script.src = '/indigitall/sdk.min.js'
      script.async = true
      script.onload = async () => {
        console.log('Indigitall SDK loaded')

        const permission = await Notification.requestPermission()
        console.log('Notification permission status:', permission)

        if (permission === 'granted') {
          window.onNewUserRegistered = (device) => {
            console.log('New device registered:', device)
          }

          window.onIndigitallInitialized = (permissions, device) => {
            console.log('Push Permission:', permissions.push)
            console.log('Location Permission:', permissions.location)
            console.log('Device Info:', device)
          }

          window.onLocationUpdated = (location) => {
            console.log('Location updated:', location)
          }

          window.onError = (error) => {
            console.error('Indigitall Error:', error)
          }

          window.requestPushPermission = (permission) => {
            console.log('Push permission requested:', permission)
          }

          window.requestLocationPermission = (permission) => {
            console.log('Location permission requested:', permission)
          }

          window.indigitall.init({
            appKey: process.env.INDIGITALL_API_KEY,
            urlDeviceApi: process.env.DEVICE_URL_API,
            workerPath: '/indigitall/worker.min.js',
            requestLocation: true,
            onInitialized: window.onIndigitallInitialized!,
            onNewUserRegistered: window.onNewUserRegistered!,
            onLocationUpdated: window.onLocationUpdated!,
            onError: window.onError!,
            requestPushPermission: window.requestPushPermission!,
            requestLocationPermission: window.requestLocationPermission!,
          })
        } else {
          console.warn('Push notifications not granted by user.')
        }
      }

      document.body.appendChild(script)
    }

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then(() => {
          console.log('✅ Service Worker registered')
          loadIndigitall()
        })
        .catch(console.error)
    }
  }, [])

  return null
}

export default IndigitallProvider
