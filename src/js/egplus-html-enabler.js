//
var egp = window.EGPlus;
egp.on('init', function () {
  console.log('EGPlus on init');
  var ad = egp.ad;
  // handle 'clickThrough'
  egp.on('clickThrough', function (e) {
    console.log("ExitURL:", ad.ExitURL);
    Enabler.exitOverride('Background Exit', ad.ExitURL);
  });
  if (Enabler.isInitialized()) {
    ad.initDynamicContent();
  } else {
    Enabler.addEventListener(studio.events.StudioEvent.INIT, ad.initDynamicContent);
  }
});
