var egp = window.EGPlus;
egp.on('init', function () {
  console.log('EGPlus on init');
  var ad = egp.ad,
    addSuffix = function (url, dcmParameter) {
      var symbol,
        urlSuffix = Enabler.getParameter(dcmParameter);
      if (url) {
        symbol = (url.indexOf('?') > -1) ? '&' : '?';
        if (urlSuffix) {
          while (urlSuffix.charAt(0) === '?' || urlSuffix.charAt(0) === '&') {
            urlSuffix = urlSuffix.substring(1);
          }
          if (urlSuffix.indexOf('?') > -1) {
            urlSuffix = urlSuffix.replace(/\?/g, '&');
          }
          return url + symbol + urlSuffix;
        }
        return url;
      }
      return '';
    };
  //Overwritten HOOK operation @see ad.initDynamicContent
  ad.setDynamicContent = function () {
    // save window.dynamicContent to ad.dynamicContent object
    ad.dynamicContent = window.dynamicContent[ad.sheetName][0];
    //first additional props - NUMBERS: repeat_delay max_loop
    ad.dynamicContent.max_loop = Number(ad.dynamicContent.max_loop);
    ad.dynamicContent.repeat_delay = Number(ad.dynamicContent.repeat_delay);
    //addSuffix -> Enabler.getParameter method to get the landing page suffix value
    //(stored in the exit_suffix macro) -> window.EGPlus.ad.ExitURL
    ad.ExitURL = addSuffix(ad.dynamicContent.exit_url.Url, 'exit_suffix');
    ad.ExitNAME = "Background Exit";
    // PARSE COPY DATA TO HTML
    ad.parseHTML();
    egp.initAd();
  };
  // handle 'clickThrough'
  egp.on('clickThrough', function (e) {
    Enabler.exit('Background Exit');
  });
  if (Enabler.isInitialized()) {
    ad.initDynamicContent();
  } else {
    Enabler.addEventListener(studio.events.StudioEvent.INIT, ad.initDynamicContent);
  }
});
