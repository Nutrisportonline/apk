(function () {
  const isAndroid = !!(window.Capacitor && window.Capacitor.getPlatform && window.Capacitor.getPlatform() === 'android');
  window.NutriSportNative = Object.assign(window.NutriSportNative || {}, {
    isAndroidApp: isAndroid,
    platform: window.Capacitor && window.Capacitor.getPlatform ? window.Capacitor.getPlatform() : 'web',
    isNative: () => !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform()),
    emit: (name, data = {}) => {
      try { window.dispatchEvent(new CustomEvent('nutrisport:native', { detail: { name, data } })); } catch (_) {}
    }
  });
})();
