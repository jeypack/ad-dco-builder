//DCO-FEED EG+ 2021 - Author: Joerg Pfeifer egplusww.com
(function (egp) {

    'use strict';

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
    //
    // do not touch the following...
    ad.devDynamicContent = {};

    /**
     * Set dynamic content for development and live
     */
    ad.setDynamicContent = function () {
        //console.info("ad.setDynamicContent", "LOCATION HOSTNAME:", window.location.hostname);
        //
        //+++ local development +++
        // IMPORTANT: here we set row data from our intern sheet data js
        if (!ad.devFeedContent) {
            console.warn('Dev Mode but no sheet data available...');
            return;
        }

        //transform SHEET data to FEED data
        var devData = ad.transformSheetData(ad.devFeedContent);

        // enable development
        Enabler.setDevDynamicContent(devData);
        // save window.dynamicContent to ad.dynamicContent object
        ad.dynamicContent = window.dynamicContent[ad.sheetName][0];

        //first additional props - NUMBERS: repeat_delay max_loop
        ad.dynamicContent.max_loop = Number(ad.dynamicContent.max_loop);
        ad.dynamicContent.repeat_delay = Number(ad.dynamicContent.repeat_delay);
        //addSuffix -> Enabler.getParameter method to get the landing page suffix value

        //(stored in the exit_suffix macro) -> window.EGPlus.ad.ExitURL
        ad.ExitURL = addSuffix(ad.dynamicContent.exit_url.Url, 'exit_suffix');
        ad.ExitNAME = "Background Exit";

        console.info("*");
        console.info("ad.setDynamicContent ", "devData:", devData);
        console.log("ad.setDynamicContent", "ad.ExitNAME:", ad.ExitNAME, "ad.ExitURL:", ad.ExitURL);
        console.log("ad.setDynamicContent", "ad.dynamicContent:", ad.dynamicContent);

        // print all feed data to console
        ad.devDCODataToString(ad.devFeedContent);

        // FIRST: load extern
        ad.loadExt();
        // SECOND:	parse strings to properties
        ad.parseHTML();

    };

    /**
    * Load script and css files
    */
    ad.loadExt = function () {
        // Load in CSS
        var extCSS = document.createElement('link'),
            dynamicContent = ad.dynamicContent;
        extCSS.setAttribute("rel", "stylesheet");
        extCSS.setAttribute("type", "text/css");
        extCSS.setAttribute("href", Enabler.getUrl(dynamicContent.css.Url));
        document.getElementsByTagName("head")[0].appendChild(extCSS);
        //
        Enabler.loadScript(Enabler.getUrl(dynamicContent.js.Url), function () {
            console.info("READY LOADING JS -> EGPlus.initAd");
            egp.initAd();
        });
    };

    /**
     * Print out Feed Data
     * @param {object} feedObj ad.devFeedContent
     */
    ad.devDCODataToString = function (feedObj) {
        console.log('+');
        console.info('+++ FEED START +++');
        console.log(ad.feedPropertyNames.join('\t'));
        console.log(ad.feedRowToString(ad.dynamicContent, ad.feedPropertyNames));
        console.info('');
        console.info('+++ FEED END +++');
        console.log('+');
    };

    /**
     * Prints the dynamic content to feed row
     * @param   {object} obj       print row from obj
     * @param   {Array}  propNames array of property names
     * @returns {string} returns the properties from a row as a feed row
     */
    ad.feedRowToString = function (obj, propNames) {
        var name, prop, type, url, ind, suf, tab, i, d,
            l = propNames.length,
            row = '',
            suffixes = ['./img/', './js/', './', ad.imagesPath],
            //suffixes = ['./img/', './js/'],
            sl = suffixes.length;
        // 3-2-1 loop
        for (i = 0; i < l; i++) {
            name = propNames[i];
            prop = obj[name];
            type = (typeof prop);
            tab = (i < l - 1) ? '\t' : '';
            //console.info("ad.feedRowToString()", "name:", name, "type:", type, "prop:", prop)
            if (type === 'object') {
                if (prop.Url || prop.Progressive_Url || prop.Stream_Url || prop.RawValue) {
                    url = String(prop.Url || prop.Progressive_Url || prop.Stream_Url || prop.RawValue);
                    for (d = 0; d < sl; d++) {
                        suf = suffixes[d];
                        ind = url.indexOf(suf);
                        if (ind !== -1) {
                            row += url.substr(suf.length) + tab;
                            //console.info("ad.feedRowToString()", "name:", name, "type:", type, "prop:", prop, "ind:", ind, "suf:", suf, "suf.length:", suf.length, "col:", url.substr(suf.length));
                            break;
                        }
                    }
                    if (ind === -1) {
                        row += url + tab;
                    }
                } else {
                    //console.info("ad.feedRowToString() else", "name:", name, "type:", type, "prop:", prop);
                    // ### empty col ###
                    row += tab;
                }
            } else {
                //console.info("ad.feedRowToString() !Object", "name:", name, "type:", type, "prop:", prop);
                row += prop + tab;
            }
        }
        return row;
    };

}(window.EGPlus));
