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
      script.src = '/indigitall/sdk.min.js'  // Make sure the SDK path is correct
      script.async = true
      script.onload = async () => {
        console.log('Indigitall SDK loaded')

        const permission = await Notification.requestPermission()
        console.log('Notification permission status:', permission)

        if (permission === 'granted') {
          // Event listener for new user registration
          window.onNewUserRegistered = (device) => {
            console.log('New device registered:', device)
          }

          // Event listener for when Indigitall is initialized
          window.onIndigitallInitialized = (permissions, device) => {
            console.log('Push Permission:', permissions.push)
            console.log('Location Permission:', permissions.location)
            console.log('Device Info:', device)

            // Example of sending a custom event on initialization
            window.indigitall.sendCustomEvent({
              eventType: 'INDIGITALL_INITIALIZED',
              customData: {
                deviceInfo: device,
                pushPermission: permissions.push,
                locationPermission: permissions.location,
              },
              async: false
            }, (response:any) => {
              console.log('Event sent:', response)
            }, (error:any) => {
              console.error('Error sending custom event:', error)
            })
          }

          // Event listener for location updates
          window.onLocationUpdated = (location) => {
            console.log('Location updated:', location)
          }

          // Error handling
          window.onError = (error) => {
            console.error('Indigitall Error:', error)
          }

          // Handling push permission requests
          window.requestPushPermission = (permission) => {
            console.log('Push permission requested:', permission)
          }

          // Handling location permission requests
          window.requestLocationPermission = (permission) => {
            console.log('Location permission requested:', permission)
          }

          // Initialize Indigitall with the necessary configuration
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
