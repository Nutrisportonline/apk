(function () {
  window.NutriSportNative = {
    isAndroidApp: !!(window.Capacitor && window.Capacitor.getPlatform && window.Capacitor.getPlatform() === 'android'),
    platform: window.Capacitor && window.Capacitor.getPlatform ? window.Capacitor.getPlatform() : 'web'
  };
})();
