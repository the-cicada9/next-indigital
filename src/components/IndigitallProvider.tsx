'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    indigitall: any
    onIndigitallInitialized?: (permissions: any, device: any) => void
    onNewUserRegistered?: (device: any) => void
    onLocationUpdated?: (location: any) => void
    onError?: (error: any) => void
    requestPushPermission?: (permission: any) => void
    requestLocationPermission?: (permission: any) => void
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
            appKey: '86893ae1-008d-4973-91f0-63a5c3f6b456', // Replace with real key
            urlDeviceApi: 'https://am1.device-api.indigitall.com/v1',
            workerPath: '/indigitall/worker.min.js',
            requestLocation: true,
            onInitialized: window.onIndigitallInitialized,
            onNewUserRegistered: window.onNewUserRegistered,
            onLocationUpdated: window.onLocationUpdated,
            onError: window.onError,
            requestPushPermission: window.requestPushPermission,
            requestLocationPermission: window.requestLocationPermission,
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
