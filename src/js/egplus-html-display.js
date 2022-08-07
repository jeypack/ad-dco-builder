//
var egp = window.EGPlus;
egp.on('init', function () {
  console.log('EGPlus on init');
  var devData, ad = egp.ad;
  //transform SHEET data to FEED data
  devData = ad.transformSheetData(ad.devFeedContent);
  // save ad.devFeedContent.sheet to ad.dynamicContent object
  ad.dynamicContent = devData[ad.sheetName][0];
  // PARSE COPY DATA TO HTML
  ad.parseHTML();
  // handle 'clickThrough'
  egp.on('clickThrough', function (e) {
    Enabler.exit('Background Exit');
  });
  if (Enabler.isInitialized()) {
    egp.initAd();
  } else {
    Enabler.addEventListener(studio.events.StudioEvent.INIT, egp.initAd);
  }
});
