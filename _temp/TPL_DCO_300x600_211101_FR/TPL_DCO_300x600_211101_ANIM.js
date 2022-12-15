//@example ad.splitText('div.wrapper-banner div.typo', { type: 'lines,words,chars', lineClass: 'line', wordClass: 'word', charClass: 'char', linePaddingLeft: [], lineHeight: [], wordSize: [], position: 'relative' })
!function(t){"use strict";function e(t,e){this.init("char",t,e,null)}function n(t,e){this.init("word",t,e,[])}function i(t,e){this.init("line",t,e,[])}function r(t,e,n){this.init(t,e,n,[])}var s,l,h,o,d=window.EGPlus,a=d.ad&&"object"==typeof d.ad?d.ad:{},c=document;(l=e.prototype).init=function(t,e,n,i){this.type=t,this.target=e,this.children=i,"line"!==t&&"word"!==t&&"char"!==t||(this.styles=[]),"root"!==t&&(this.content=n||""),"line"!==t&&"word"!==t&&"char"!==t&&(this.lines=[]),"word"!==t&&"char"!==t&&(this.words=[]),"char"!==t&&(this.chars=[])},l.inline=function(t){t.position&&""!==t.position&&(this.styles.push("position: "+t.position+";"),this.styles.push("display: inline-block;"))},(h=n.prototype=Object.create(l)).add=function(t){return this.children.push(t),this},h.html=function(t,e,n){var i=c.createElement("div");return t.styles.length&&(i.style.cssText=t.styles.join(" ")),e&&""!==e&&(i.className=e),n&&""!==n&&(i.innerHTML=n),t.target=i,this.target.appendChild(i),i},o=i.prototype=Object.create(h),(s=r.prototype=Object.create(o)).getLineComp=function(t){return this.children[0].children[t]},s.revert=function(){var t,e,n,i,r,s=this.children.length;if(this.lines.splice(0),this.words.splice(0),this.chars.splice(0),"root"===this.type)for(;--s>-1;)this.children[s].revert();else{for(;--s>-1;){for((i=this.children[s]).words=[],i.chars=[],t=i.children.length;--t>-1;){for((r=i.children[t]).chars=[],e=r.children.length;--e>-1;)r.children[e].target=null,null;r=r.children=r.target=null}i=i.children=i.target=null}for(t=(n=this.target).childNodes.length;--t>-1;)n.removeChild(n.childNodes[t]);n.innerHTML=this.content}},a.splitText=function(s,l){var h,o,a,p,g,u,f,w,y=new r("root",s&&s.find?s:t(s)),m=function(t,s){var l,h,o,d,f,w,m,C,x,L,v,H,b=s.split("<br>"),T=new r("block",t,s);for(t.innerHTML="",d=b.length,l=0;l<d;l++)for(x=new i(T.target,b[l]),p?(x.inline(a),a.linePaddingLeft.length>0&&x.styles.push("padding-left: "+(a.linePaddingLeft[y.lines.length]||a.linePaddingLeft[a.linePaddingLeft.length-1])+"px;"),a.lineHeight.length>0&&x.styles.push("line-height: "+(a.lineHeight[y.lines.length]||a.lineHeight[a.lineHeight.length-1])+"px;"),T.html(x,a.lineClass,g||u?"":x.content),T.lines.push(x.target),y.lines.push(x.target)):l>0&&x.target.appendChild(document.createElement("br")),T.add(x),f=(m=b[l].split(" ")).length,h=0;h<f;h++)for(L=new n(x.target,m[h]),g&&""!==m[h]&&(L.inline(a),a.wordSize.length>0&&L.styles.push("font-size: "+(a.wordSize[y.words.length]||a.wordSize[a.wordSize.length-1])+"px;"),x.html(L,a.wordClass,u?"":L.content),x.words.push(L.target),T.words.push(L.target),y.words.push(L.target)),g&&h!==f-1&&x.target.appendChild(c.createTextNode(" ")),x.add(L),w=(C=m[h].split("")).length,o=0;o<w;o++)v=new e(L.target,C[o]),u&&(v.inline(a),L.html(v,a.charClass,v.content),L.chars.push(v.target),x.chars.push(v.target),T.chars.push(v.target),y.chars.push(v.target),!g&&l>0&&h!==f-1&&o===w-1&&((H=document.createElement("span")).appendChild(c.createTextNode(" ")),x.target.appendChild(H))),L.add(v);return T};for(a=d.extend({type:"lines,words,chars",lineClass:"line",wordClass:"word",charClass:"char",linePaddingLeft:[],lineHeight:[],wordSize:[],position:""},l),p=-1!==a.type.indexOf("lines"),g=-1!==a.type.indexOf("words"),u=-1!==a.type.indexOf("chars"),o=y.target.length,h=0;h<o;h++)f=m(w=y.target[h],w.innerHTML),y.add(f);return y}}(window.EGPlus.$);
//DCO-ANIMATIONS EG+ 2021 - Author: Joerg Pfeifer egplusww.com
(function (egp) {

    'use strict';

    // references
    var $ = egp.$,
        ad = egp.ad,
        //repeat = 1,
        //repeatDelay = 2.0,
        $wrapper = $('#bg-exit'),
        $anim = $('#egp-anim'),
        $alpha = $('.alpha'),
        //$bkg = $wrapper.find('#bkg'),
        $image1 = $wrapper.find('#image-1'),
        //$image2 = $wrapper.find('#image-2'),
        $copy1 = $wrapper.find('#copy-1'),
        $copy2 = $wrapper.find('#copy-2'),
        //$modal = $('[egp-module="modal"], egp-modal'),
        //$closeBtn = $('[egp-module="close-btn"]'),
        $cta = $wrapper.find('#cta'),
        $logos = $wrapper.find('#logos'),
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
            { id: '#image-1', url: Enabler.getUrl(ad.dynamicContent.image_1.Url), x: '0', y: '0', bs: 'contain' },
            { id: '#logos', url: Enabler.getUrl(ad.dynamicContent.delivery.Url), x: '0', y: '0', bs: 'contain' },
        ]);

        // register for resize
        //window.addEventListener('resize', ad.handleResize);
        // register for started
        //ad.on('started', function () { console.log("ad started"); });
        // register for repeat
        //ad.on('repeat', function () { console.log("ad repeat"); });

        //default: { type: 'lines,words,chars', lineClass: '', wordClass: '', linePaddingLeft: [], lineHeight: [], wordSize: [], position: 'relative' }}
        ad.on('completed', function (e) {
            console.log("ad completed", e.time);
            $wrapper[0].addEventListener('mouseenter', function () {
                ad.bounceElemDown($cta);
            });
        });

        //ad.splitText('div.wrapper-banner div.typo', { type: 'lines,words,chars', lineClass: 'line', wordClass: 'word', charClass: 'char', linePaddingLeft: [], lineHeight: [], wordSize: [], position: 'relative' })
        $wrapper.find('.split').forEach(function (elem) {
            typoSplit.push(ad.splitText(elem, {
                type: 'lines'
            }));
        })
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
        gsap.set([$image1, $copy1, $copy2, $cta, $wrapper.find('.line')], {
            force3D: true
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
        ad.tl.add(ad.stepA(), 0.5);
        ad.tl.add(ad.stepB(), '+=1.5');
        console.log("ad.setTimelines", "anim:", ad.dynamicContent.anim, "total:", ad.tl.totalDuration());
    };

	ad.stepA = function () {
		var tl = gsap.timeline({ defaults: { ease: "power1", duration: 0.5 } });
        tl.fromTo(typoSplit[0].lines, { x: -300, opacity: 1 }, { x: 0, stagger: 0.1 }, 0);
        tl.fromTo($image1, { x: -300, opacity: 1 }, { x: 0, ease: 'power2', stagger: 0.15 }, 0.35);
        //tl.fromTo($logos, { scale: 0.55, x: 70, y: 242 }, { opacity: 1 }, '-=0.5');
        tl.to($logos, { opacity: 1 }, '-=0.5');
		tl.timeScale(1.0);
		return tl;
	};

    ad.stepB = function () {
        var tl = gsap.timeline({ defaults: { ease: "power1.in", duration: 0.6 } });
        tl.to([typoSplit[0].lines, $image1], { x: -300, stagger: 0.1 }, 0);
        //tl.to($logos, { x: 0, y: 0, scale: 1 }, '-=0.5');
        tl.to($logos, { scale: 1 }, '-=0.5');
        tl.fromTo($cta, { opacity: 1, scale: 0 }, { opacity: 1, scale: 1, ease: 'back' }, '+=0.5');
        tl.add(ad.bounceElemDown($cta, 1, 0.5), '+=1.0');
        tl.timeScale(1.0);
        return tl;
    };

    ad.pulseRight = function ($elem) {
        var tl = gsap.timeline({ repeat: 1, repeatDelay: 0.2 });
        tl.to($elem, { x: 4, ease: "back", duration: 0.32 }, 0);
        tl.to($elem, { x: 0, ease: "power2", duration: 0.425 }, '+=0.0');
        tl.to($elem, { x: 3, ease: "back", duration: 0.32 }, '-=0.2');
        tl.to($elem, { x: 0, ease: "power2", duration: 0.425 }, '+=0.0');
        tl.timeScale(1.0);
        return tl;
    };

	ad.bounceElemDown = function ($elem, repeat, repeatDelay) {
        var tl = gsap.timeline({ repeat: repeat || 0, repeatDelay: repeatDelay || 0 });
        tl.to($elem, { duration: 0.175, scale: 0.95, ease: "back" });
        tl.to($elem, { duration: 0.275, scale: 1.0, ease: "power1" });
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
}(window.EGPlus));
