//DCO-ANIMATIONS EG+ 2023 - Author: Joerg Pfeifer egplusww.com 
(function (egp) {
  "use strict";

  // references
  var $ = egp.$,
    ad = egp.ad,
    //repeat = 1,
    //repeatDelay = 2.0, 
    $wrapper = $("#bg-exit"),
    $anim = $("#egp-anim"),
    //$bkg = $wrapper.find('#bkg'),
    $image1 = $wrapper.find("#image-1"),
    //$image2 = $wrapper.find('#image-2'),
    $copy1 = $wrapper.find("#copy-1"),
    $copy2 = $wrapper.find("#copy-2"),
    //$modal = $('[egp-module="modal"], egp-modal'),
    //$closeBtn = $('[egp-module="close-btn"]'),
    $cta = $wrapper.find("#cta"),
    $logos = $wrapper.find("#logos"),
    typoSplit = [];
  //
  // REGISTER FOR EGP-CLOSE-BUTTON EVENT IF NECESSARY
  /*ad.on("closeBtnClick", function (e) {
        console.log("closeBtnClick", e);
    });*/

  // ONLY DC STUDIO
  /*
	if (Enabler.isVisible()) {
		ad.visibilityHandler();
	} else {
		Enabler.addEventListener(studio.events.StudioEvent.VISIBLE, ad.visibilityHandler);
	}
	if (Enabler.isPageLoaded()) {
		ad.politeInit();
	} else {
		Enabler.addEventListener(studio.events.StudioEvent.PAGE_LOADED, ad.politeInit);
	}
	*/
  /**
   * Overridden HOOK operation
   * only needed if using e.g. DC STUDIO
   */
  //ad.visibilityHandler = function () { ad.play(); };

  /**
   * ENTRY POINT *
   * Overridden ABSTRACT operation
   * IMPORTANT: Every ad has to implement this method!
   */
  ad.init = function () {
    console.log("ad.init");
    //today.setHours(0, 0, 1);
    //if date is after midnight - division by ms-day to floor will always be zero based
    /* if (ad.dynamicContent.copy_f3_1 === 'COUNTDOWN') {
      // *COUNTDOWN*
      DAYMSECONDS = (60 * 60 * 24 * 1000),
      convertDateToUTC = function (date) { return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()); },
      endDateUTC = convertDateToUTC(new Date(ad.dynamicContent.end_date.RawValue)),
      endDate = new Date(ad.dynamicContent.end_date.RawValue),
      today = new Date(),
      countdownIndex = 0;
      console.log("ad.init", "COUNTDOWN_COPY :", COUNTDOWN_COPY);
      console.log("ad.init", "DAYMSECONDS :", DAYMSECONDS);
      console.log("ad.init", "endDate :", endDate);
      console.log("ad.init", "endDateUTC :", endDateUTC);
      console.log("ad.init", "today :", today);
      countdownIndex = Math.floor((endDateUTC.getTime() - today.getTime()) / DAYMSECONDS);
      console.log("ad.init", "countdownIndex :", countdownIndex);
      if (countdownIndex < 0 || countdownIndex >= COUNTDOWN_COPY.length) {
          countdownIndex = COUNTDOWN_COPY.length - 1;
      }
      // offer_f3
      ad.dynamicContent.copy_f3_1 = COUNTDOWN_COPY[countdownIndex];
      console.log("ad.init", "ad.dynamicContent.copy_f3_1:", ad.dynamicContent.copy_f3_1);
      $offer_f3[0].innerHTML = ad.dynamicContent.copy_f3_1;
    } */

    // listen to images load or progress if needed
    //ad.on('imagesProgress', ad.progressHandler);
    // polite load goes here if neccessary
    ad.politeLoad([
      {
        id: "#image-1",
        url: Enabler.getUrl(ad.dynamicContent.image_1.Url),
        x: "0",
        y: "0",
        bs: "contain",
      },
      {
        id: "#logos",
        url: Enabler.getUrl(ad.dynamicContent.delivery.Url),
        x: "0",
        y: "0",
        bs: "contain",
      },
    ]);

    // register for resize
    //window.addEventListener('resize', ad.handleResize);
    // register for started
    //ad.on('started', function () { console.log("ad started"); });
    // register for repeat
    //ad.on('repeat', function () { console.log("ad repeat"); });

    //default: { type: 'lines,words,chars', lineClass: '', wordClass: '', linePaddingLeft: [], lineHeight: [], wordSize: [], position: 'relative' }}
    ad.on("completed", function (e) {
      console.log("ad completed", e.time);
      $wrapper[0].addEventListener("mouseenter", function () {
        ad.bounceElemDown($cta);
      });
    });

    //ad.splitText('div.wrapper-banner div.typo', { type: 'lines,words,chars', lineClass: 'line', wordClass: 'word', charClass: 'char', linePaddingLeft: [], lineHeight: [], wordSize: [], position: 'relative' })
    $wrapper.find(".split").forEach(function (elem) {
      typoSplit.push(
        ad.splitText(elem, {
          type: "lines",
        })
      );
    });
    console.log("ad.init:", "typoSplit", typoSplit);
    // or start immediately
    //ad.start();
  };

  /**
   * Overridden HOOK operation
   * This operation executes before 'setTimelines'
   */
  ad.initAnimation = function () {
    //console.log("ad.initAnimation");
    //apply a perspective to the PARENT element (the container)
    //to make the perspective apply to all child elements (typically best)
    //gsap.set($wrapper, { perspective: 650 });
    //gsap.set($logo, { transformPerspective: 1000, transformStyle: "preserve-3d" });
    //gsap.set([$topping], { rotationZ: 0.001, force3D: true, transformOrigin: '50% 50%' });
    gsap.set([$image1, $copy1, $copy2, $cta, $wrapper.find(".line")], {
      force3D: true,
    });
    //100 140 | 106 136 transformOrigin: '108% 136%',
    gsap.set($logos, { force3D: true });

    //fade in outside timeline
    gsap.to($anim, { opacity: 1, duration: 0.2 });
  };

  /**
   * Overridden CONCRETE operation
   * IMPORTANT: Every ad has to implement this method!
   */
  ad.setTimelines = function () {
    // create main timeline
    ad.tl.repeat(ad.dynamicContent.max_loop).repeatDelay(ad.dynamicContent.repeat_delay);
    //ad.tl.repeat(repeat).repeatDelay(repeatDelay);
    //var frameOrderRaw = ad.dynamicContent.frame_order,
    ad.tl.add(ad.stepA(), 0.25);
    ad.tl.add(ad.stepB(), "+=2.25");
    console.log("ad.setTimelines", "anim:", ad.dynamicContent.anim, "total:", ad.tl.totalDuration());
  };

  ad.stepA = function () {
    var tl = gsap.timeline({ defaults: { ease: "power1", duration: 0.5 } });
    tl.fromTo(typoSplit[0].lines, { x: -300, opacity: 1 }, { x: 0, stagger: 0.1 }, 0);
    tl.fromTo($image1, { x: -300, opacity: 1 }, { x: 0, opacity: 1, ease: "power2" }, 0.35);
    //tl.fromTo($logos, { scale: 0.55, x: 70, y: 242 }, { opacity: 1 }, '-=0.5');
    tl.to($logos, { opacity: 1 }, "-=0.5");
    tl.timeScale(1.0);
    return tl;
  };

  ad.stepB = function () {
    var tl = gsap.timeline({ defaults: { ease: "power1.inOut", duration: 0.6 } });
    tl.to([typoSplit[0].lines, $image1], { x: -300, stagger: 0.1 }, 0);
    //tl.to($logos, { x: 0, y: 0, scale: 1 }, '-=0.5');
    tl.to($logos, { scale: 1, x: 0, y: 0 }, "-=0.5");
    tl.fromTo($cta, { opacity: 1, scale: 0 }, { opacity: 1, scale: 1, ease: "back" }, "+=0.5");
    tl.add(ad.bounceElemDown($cta, 1, 0.5), "+=1.0");
    tl.timeScale(1.0);
    return tl;
  };

  ad.pulseRight = function ($elem) {
    var tl = gsap.timeline({ repeat: 1, repeatDelay: 0.2 });
    tl.to($elem, { x: 4, ease: "back", duration: 0.32 }, 0);
    tl.to($elem, { x: 0, ease: "power2", duration: 0.425 }, "+=0.0");
    tl.to($elem, { x: 3, ease: "back", duration: 0.32 }, "-=0.2");
    tl.to($elem, { x: 0, ease: "power2", duration: 0.425 }, "+=0.0");
    tl.timeScale(1.0);
    return tl;
  };

  ad.bounceElemDown = function ($elem, repeat, repeatDelay) {
    var tl = gsap.timeline({
      repeat: repeat || 0,
      repeatDelay: repeatDelay || 0,
    });
    tl.to($elem, { duration: 0.175, scale: 0.94, ease: "back" });
    tl.to($elem, { duration: 0.3, scale: 1.0, ease: "power1" });
    return tl;
  };

  /*
    ad.stepEnd = function () {
		var tl = gsap.timeline(),
            params = null,
            third = repeatDelay / 3;
		tl.call(function () {
			if (ad.currentRepeat < ad.maxRepeat) {
				//console.info("ad.stepEnd ", "repeatDelay:", repeatDelay);
				gsap.to([$alpha], { duration: third, opacity: 0 });
			}
		}, params, third * 2);
		return tl;
	};
    */
})(window.EGPlus);
