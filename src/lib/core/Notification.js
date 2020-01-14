class Notificator {
  static permissionRequest() {
    Notification.requestPermission();
  }

  static notification(title, body) {
    const notification = new Notification(title, { body });
    setTimeout(() => { notification.close(); }, 3000);
  }
}

export default Notificator;
