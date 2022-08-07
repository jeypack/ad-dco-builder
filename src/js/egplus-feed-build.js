//DCO-FEED-LIVE EG+ 2021 - Author: Joerg Pfeifer egplusww.com
(function (egp) {

    'use strict';

    var ad = egp.ad,
        // Enabler.getParameter method to get the landing page suffix value
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
    /**
     * Set dynamic content for development and live
     */
    ad.setDynamicContent = function () {
        //
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
        console.log("ad.setDynamicContent", "ad.ExitNAME:", ad.ExitNAME, "ad.ExitURL:", ad.ExitURL);
        console.log("ad.setDynamicContent", "ad.dynamicContent:", ad.dynamicContent);

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
            //console.info("READY LOADING JS -> EGPlus.initAd");
            egp.initAd();
        });
    };

}(window.EGPlus));
