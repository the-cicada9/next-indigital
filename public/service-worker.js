importScripts('/indigitall/worker.min.js');
// Add other service workers here if needed
self.addEventListener('push', function(event) {
    let payload = event.data.json();
  
    console.log('Push Notification Received:>>>>>>>', payload);
    
    const options = {
      body: payload.body,
      icon: payload.icon,
      image: payload.image,
      data: payload.data,
      actions: payload.actions, // This is where the buttons are defined
      requireInteraction: true, // Optional: keeps the notification visible until the user interacts
    };
  
    event.waitUntil(
      self.registration.showNotification(payload.title, options)
    );
  });
  
  // Handle notification action clicks
  self.addEventListener('notificationclick', function(event) {
    const action = event.action;
    const notificationData = event.notification.data;
  
    if (action === 'go_unsplash') {
      clients.openWindow(notificationData.unsplashUrl);
    } else if (action === 'go_heroku') {
      clients.openWindow(notificationData.herokuUrl);
    } else {
      // Default action or click on notification
      clients.openWindow(notificationData.default);
    }
  
    event.notification.close(); // Close the notification after handling the click
  });
  