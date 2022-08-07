/**
 * T I M E L I N E - C O N T R O L S
 * Version      : 2.1.0
 * Author       : J. Pfeifer  @egplusww.com
 * Dependencies : (gte) egplus-html5-slim-2.3.0.js
*/
(function (egp) {

    'use strict';

	var $ = egp.$,
		ad = egp.ad,
		$wrapper = $('#bg-exit'),
		$body = $('body'),
		tlCtrlElem,
		inputRangeElem,
		inputModusElem,
		inputClickthroughElem,
		$tlCtrl;

	ad.on('start', function () {
		ad.createTimelineControl();
		ad.initTimelineControl();
	});

	ad.createTimelineControl = function (initObj) {
		if (typeof initObj === 'object') {
			if (!initObj.step) { initObj.step = 0.001; }
			if (!initObj.bottom) { initObj.bottom = 0; }
		} else {
			initObj = {
				bottom: 0,
				step: 0.01
			};
		}

		var totalDuration = ad.tl.totalDuration(),
			attrObj = { id: "timeline-control" },

			styleObj = {
				position: "absolute",
				left: "0",
				right: "0",
				top: "0px",
				bottom: "auto",
				width: "100%",
				height: "25px",
				borderTop: "1px dashed rgba(0,0,0,0.5)",
				borderBottom: "1px dashed rgba(0,0,0,0.5)",
				color: "#333",
				fontSize: "12px",
				background: "rgba(255,255,255,0.7)"
			};

		//console.log('ad-timeline-control', 'ad.createTimelineControl', 'initObj:', initObj);
		if (initObj.bottom && typeof initObj.bottom === 'number') {
			styleObj.top = "auto";
			styleObj.bottom = initObj.bottom + "px";
		}
		tlCtrlElem = egp.createElem($wrapper[0], 'div', attrObj, styleObj);
		attrObj = { type: "range", min: "0", max: "100.0", value: "0", step: initObj.step.toString() };
		styleObj = { width: (Math.floor(gsap.getProperty($wrapper[0], 'width') / 6) * 4) + "px", margin: "5px 5px" };
		inputRangeElem = egp.createElem(tlCtrlElem, 'input', attrObj, styleObj);
		// <span>00.00</span><span>.</span><span>99.99</span>
		egp.createElem(tlCtrlElem, 'span', {}, { display: "inline-block", height: "100%", verticalAlign: "middle", margin: "0px 2px" }).textContent = "00";
		egp.createElem(tlCtrlElem, 'span', {}, { display: "inline-block", height: "100%", verticalAlign: "middle" }).textContent = ".";
		egp.createElem(tlCtrlElem, 'span', {}, { display: "inline-block", height: "100%", verticalAlign: "middle", margin: "0px 2px" }).textContent = "99";
		egp.createElem(tlCtrlElem, 'span', {}, { display: "inline-block", height: "100%", verticalAlign: "middle", margin: "0px 2px" }).textContent = "/";
		egp.createElem(tlCtrlElem, 'span', {}, { display: "inline-block", height: "100%", verticalAlign: "middle", margin: "0px 2px" }).textContent = "99";
		egp.createElem(tlCtrlElem, 'span', {}, { display: "inline-block", height: "100%", verticalAlign: "middle" }).textContent = ".";
		egp.createElem(tlCtrlElem, 'span', {}, { display: "inline-block", height: "100%", verticalAlign: "middle", margin: "0px 2px" }).textContent = "99";
        egp.createElem(tlCtrlElem, 'span', {}, { display: "inline-block", height: "100%", verticalAlign: "middle", margin: "0px 2px" }).textContent = "click through:";
		inputClickthroughElem = egp.createElem(tlCtrlElem, 'input', { type: 'checkbox', value: 'clickThrough' }, { display: "inline-block", verticalAlign: "middle", margin: "0px 6px 10px 2px" });
		$tlCtrl = $wrapper.find('#timeline-control');
		gsap.set($tlCtrl, { opacity: 0 });
	};

	ad.initTimelineControl = function () {
        console.log('😎', 'T I M E L I N E - C O N T R O L S ', '2.1.0', '✅');
		var $span = $tlCtrl.find('span'),
			hasClickThrough = false,
			paused = false,
			dragged = false,
			lastValue = 0,
			ctrlObj = { progress: 0 },
			duration = ad.tl.duration(),
			totalDuration = ad.tl.totalDuration(),
			printValue = function (value) {
				var seconds = Math.floor(value),
					ms = Math.floor((value % 1) * 100);
				//console.log('ad-timeline-control', 'ad.initTimelineControl', 'printValue', "seconds:", seconds, "ms:", ms, "value:", (value % 1));
				$span[0].textContent = String(seconds + 100).substr(1);
				$span[2].textContent = String(ms + 100).substr(1);
				seconds = Math.floor(totalDuration);
				ms = Math.floor((totalDuration % 1) * 100);
				$span[4].textContent = String(seconds + 100).substr(1);
				$span[6].textContent = String(ms + 100).substr(1);
			},
            pause = function () {
                if (!paused) {
                    ad.ctrlTimeline.pause();
                    ad.tl.pause();
                    paused = true;
                }
            },
            play = function () {
                if (paused) {
                    ad.ctrlTimeline.play();
                    ad.tl.play();
                    paused = false;
                }
            },
            toggle = function () {
                if (paused) {
                    ad.ctrlTimeline.play();
                    ad.tl.play();
                    paused = false;
                } else {
                    ad.ctrlTimeline.pause();
                    ad.tl.pause();
                    paused = true;
                }
            },
			mouseEnter = function (e) {
				//console.log('ad-timeline-control', 'mouseenter', "e:", e);
				gsap.killTweensOf(tlCtrlElem);
				gsap.to(tlCtrlElem, { duration: 0.3, opacity: 1 });
                if (!dragged) { pause(); }
			},
			mouseLeave = function (e) {
				//console.log('ad-timeline-control', 'mouseleave', "e:", e);
				gsap.to(tlCtrlElem, { duration: 0.25, opacity: 0, delay: 0.5 });
                if (!dragged) { play(); }
			};
        //
		tlCtrlElem.addEventListener('mouseenter', mouseEnter);
		tlCtrlElem.addEventListener('mouseleave', mouseLeave);
		inputRangeElem.max = duration;
		//console.log('ad-timeline-control', 'ad.initTimelineControl', "ad.tl:", ad.tl);
		/*console.log('ad-timeline-control', 'ad.initTimelineControl', "$tlCtrl:", $tlCtrl);
		console.log('ad-timeline-control', 'ad.initTimelineControl', "$span:", $span);*/
		/*inputRangeElem.addEventListener('click', function (e) {
			console.log('click inputRangeElem', 'ad.initTimelineControl', "e:", e);
			e.stopImmediatePropagation();
            dragged = true;

		});*/
        //scrubbing the timeline
		inputRangeElem.addEventListener('input', function (e) {
			//console.log('input', 'ad.initTimelineControl', "value:", e.target.value);
            e.stopImmediatePropagation();
			var time = parseFloat(e.target.value, 10);
			//ad.ctrlTimeline.time(time).pause();
			ad.ctrlTimeline.seek(time).pause();
			//ad.tl.time(time).pause();
			ad.tl.seek(time).pause();
            dragged = true;
		});

        inputClickthroughElem.addEventListener('change', function (e) {
            //console.log('change clickThrough', 'ad.initTimelineControl', "value:", e.target.value);
            hasClickThrough = !hasClickThrough;
        });

        tlCtrlElem.addEventListener('click', function (e) {
			//console.log('click tlCtrlElem', 'ad.initTimelineControl', "e:", e);
			e.stopImmediatePropagation();
        });
		egp.on('clickThrough', function (e) {
            //console.log('clickThrough', 'ad.initTimelineControl', "e:", e);
            if (!hasClickThrough) {
                egp.stopPropagation(e);
                toggle();
                dragged = paused;
            } else if (dragged) {
                toggle();
                dragged = false;
            }
        });

        $wrapper[0].addEventListener('dblclick', function (e) {
            //console.log('dblclick', 'ad.initTimelineControl', "e:", e);
            if (!hasClickThrough) {
                egp.stopPropagation(e);
                //console.log('dblclick', 'ad.initTimelineControl', "ad.ctrlTimeline:", ad.ctrlTimeline);
                ad.ctrlTimeline.seek(0).play();
                ad.tl.seek(0).play();
                paused = false;
            }
        });
		/*ad.tl.eventCallback('onUpdate', function () {
			//var value = parseFloat(inputRangeElem.value, 10);
			var value = ad.tl.time();
			inputRangeElem.value = value;
			printValue(value);
			//console.log('ad-timeline-control', 'ad.initTimelineControl', "value:", value);
		});*/

        $body[0].addEventListener('keydown', function (e) {
            if (e.key === 'Shift') {
                //console.log("ad.initTimelineControl", "keydown", "e", e);
                inputRangeElem.setAttribute('step', 0.01);
            }
        });
        $body[0].addEventListener('keyup', function (e) {
            if (e.key === 'Shift') {
                //console.log("ad.initTimelineControl", "keyup", "e", e);
                inputRangeElem.setAttribute('step', 0.001);
            }
        });

		// Here we create a length clone from the original ad timeline.
		ad.ctrlTimeline = gsap.timeline({ repeat: ad.tl.repeat(), repeatDelay: ad.tl.repeatDelay(), onUpdate: function () {
			//var value = parseFloat(inputRangeElem.value, 10);
			//var value = ad.tl.time();
			inputRangeElem.value = ad.tl.time();
			printValue(ad.tl.totalTime());
			//console.log('ad-timeline-control', 'ad.initTimelineControl', "value:", ad.tl.time());
		} });
		ad.ctrlTimeline.set(ctrlObj, { progress: 1 }, totalDuration);

	};

}(window.EGPlus));
