//DCO-DATA EG+ 2021 - Author: Joerg Pfeifer egplusww.com
(function (egp) {

  'use strict';

  var $ = egp.$,
    ad = egp.ad;

  //+++DE+++
  // change sheet-name and asset-path here
  ad.sheetName = 'MC_DELIVERY_CH_DE_DCO_FEED_300X600_02_Sheet1';
  ad.imagesPath = '';
  ad.feedPropertyNames = [];
  ad.dynamicContent = {};
  //feednameforforcedpreview:mcdeliverychdedcofeed300x60001sheet1:10286221,request:datetime,request:dbmlineitemid,request:location
  (function helper() {
    /* var i, rows = 169,
      count = 1,
      pack = 13,
      min = 2210001,
      max = min + rows,
      out = 'feednameforforcedpreview:mcdeliverychitdcofeed300x60001sheet1:10298287,request:datetime';
    for (i = max - 1; i >= min; i--) {
      out += '\n' + i + ',2022-12-31T00:00+00:00';
    } */
    /* out = '';
    count = 1;
    for (i = min; i < max; i++) {
      out += '\n' + i;
      if (count % pack === 0) {
        out += '\n';
      }
      count++;
    } */
    //
    //console.log(out);
  }());

  ad.initDynamicContent = function () {
    console.log("MC_DELIVERY_CH_DE_DCO_FEED_300X600_02_Sheet1  ID: 10724036");
    console.log("TPL_DCO_AUTO_211101_DE_DATA ad.initDynamicContent", window.EGPlus);
    //+++DE+++
    Enabler.setProfileId(10724036);
    //Template function
    ad.setDynamicContent();
  };

  /**
  * Parses the dynamic content string entries to object key -> value pairs
  * !!! 'motiv' inside 'dco_data' has to be lowercase !!!
  */
  ad.parseHTML = function () {
    var $bkgExit = $('#bg-exit'),
      dynamicContent = ad.dynamicContent,
      classNames = 'wrapper-banner ' + dynamicContent.theme,
      removeAllScriptTags = function (s) {
        var i, scripts, div = document.createElement('div');
        div.innerHTML = s;
        scripts = div.getElementsByTagName('script');
        i = scripts.length;
        while (i--) {
          scripts[i].parentNode.removeChild(scripts[i]);
        }
        return div.innerHTML;
      },
      removeAllAttributes = /<\s*([a-z][a-z0-9]*)\s.*?>/gi;
    //
    //console.log("ad.parseHTML ", "classNames:", classNames);
    //third making dom manipulations
    $bkgExit[0].setAttribute('class', classNames);
    $bkgExit.find('#copy-1')[0].innerHTML = removeAllScriptTags(dynamicContent.copy_1.replace(removeAllAttributes, '<$1>'));
    $bkgExit.find('#copy-2')[0].innerHTML = removeAllScriptTags(dynamicContent.copy_2.replace(removeAllAttributes, '<$1>'));
    $bkgExit.find('#nfo-content')[0].innerHTML = removeAllScriptTags(dynamicContent.info.replace(removeAllAttributes, '<$1>'));
    $bkgExit.find('#cta div')[0].innerText = dynamicContent.cta;
    //console.log("ad.parseHTML ", "dynamicContent.copy_1_1:", dynamicContent.copy_1_1.replace(removeAllAttributes, '<$1>'));
  };

}(window.EGPlus));
