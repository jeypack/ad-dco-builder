//DCO-LOCAL EG+ 2021 - Author: Joerg Pfeifer egplusww.com
(function (egp) {

  'use strict';

  var ad = egp.ad;

  //ad.NO_FEED_PROP = '';
  ad.FEED_STRINGS = 'format,DV360_LI_ID,AUDIENCE_ID,GEO_TARGETS,reporting_label,theme,anim,copy_1,copy_2,info,cta',
  ad.FEED_NUMBERS = 'unique_id,repeat_delay,max_loop',
  ad.FEED_BOOLEANS = 'is_default,is_active';

  /**
  * Sets profile id and feed property names
  * for Enabler and enables development
  * @param {object} feedObj ad.devFeedContent
  * @see egplus-html-build-inline.js
  * @see egplus-feed-temp.js
  */
  ad.transformSheetData = function (feedObj) {
    var i, l, key, propNames,
      idName = '_id',
      noFeedProp = '',
      sheetName = ad.sheetName,
      devData = {},
      setRowProperties = function (obj, row) {
        var key, value, isString, isNumber, isBoolean,
          strings = ad.FEED_STRINGS,
          numbers = ad.FEED_NUMBERS,
          booleans = ad.FEED_BOOLEANS;
        // now we loop over row properties
        for (key in row) {
          if (row.hasOwnProperty(key)) {
            if (noFeedProp.indexOf(key) === -1) {
              value = row[key];
              isString = strings.indexOf(key) !== -1;
              isNumber = numbers.indexOf(key) !== -1;
              isBoolean = booleans.indexOf(key) !== -1;
              if (isString || isNumber || isBoolean) {
                obj[key] = value;
              } else {
                obj[key] = {};
                if (key === 'start_date' || key === 'end_date') {
                  obj[key].RawValue = value;
                  obj[key].UtcValue = new Date(value).getUTCMilliseconds();
                } else if (key === 'exit_url') {
                  //console.info("setRowProperties", "obj[key]:", obj[key], "value:", value);
                  obj[key].Url = value;
                } else if (key.indexOf('video') !== -1) {
                  //console.info("setRowProperties", "obj[key]:", obj[key], "value:", value);
                  obj[key].Type = "video";
                  obj[key].Progressive_Url = value;
                  //obj[key].Stream_Url = value;
                } else {
                  obj[key].Type = "file";
                  obj[key].Url = value;
                }
              }
            }
            //console.info("setRowProperties", "key:", key, "value:", value);
            //console.info("setRowProperties", "isString:", isString, "isNumber:", isNumber, "isBoolean:", isBoolean);
          }
        }
        return obj;
      };
    /*ad.devDynamicContent[ad.sheetName][0].video = {};
		ad.devDynamicContent[ad.sheetName][0].video.Type = "video";
		ad.devDynamicContent[ad.sheetName][0].video.Progressive_Url = "DRM_Asset:UnityMedia_DE_B2B_Display/default/um_dummy_video_384x216.mp4";
		ad.devDynamicContent[ad.sheetName][0].video.Stream_Url = "";*/
    // prepare dev data
    devData[sheetName] = [{}];

    //console.info("ad.transformSheetData ", "feedObj:", feedObj);
    //now fill our dev content
    devData[sheetName][0][idName] = 0;
    setRowProperties(devData[sheetName][0], feedObj.sheet);
    //
    // set feed property names
    propNames = Object.keys(feedObj.sheet);
    l = propNames.length;
    for (i = 0; i < l; i++) {
      key = propNames[i];
      if (noFeedProp.indexOf(key) === -1) {
        ad.feedPropertyNames.push(key);
      }
    }
    //console.info("ad.initDynamicContent ", "ad.feedPropertyNames:", ad.feedPropertyNames);
    return devData;
  };

}(window.EGPlus));
