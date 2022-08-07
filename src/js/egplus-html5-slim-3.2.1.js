/**
 * Light DOM + ClickThrough - Utils
 * Version : 3.2.1
 * Author : Joerg Pfeifer - @egplusww.com
*/
(function () {

    'use strict';

	//
	// ***
    // local references e.g. p for prototype
    var p, eg, ad, $, gup, $wrapper,
        hasRegisteredBgExit = false,
        initialized = false,
        initializedAd = false,
        temp = 'torage',
        UID = 0,
        timeout = 150,
        getLocalProp = function () {
            return 'localS' + temp;
        },
        getLocalEventName = function () {
            return 's' + temp;
        },
        tempA = 'st',
        tempB = 'orage',
        sprop = 'loc' + temp + tempB,
        wlstg = window[getLocalProp()],
        handleConnect = function (evt) {
            if (evt.key === 'connected') {
                var value = JSON.parse(wlstg.getItem('connected'));
                if (Array.isArray(value) && value.length === eg.connectionMax) {
                    window.removeEventListener(getLocalEventName(), handleConnect);
                    wlstg.removeItem("connected");
                    wlstg.setItem("talk", "run" + Date.now());
                    eg.dispatchEvent({ type: 'connected', max: value.length });
                }
                //console.log("handleConnect", eg.connectionName, "evt", evt, "value:", value);
            }
        },
        handleTalk = function (evt) {
            if (evt.key === 'talk') {
                var temp = evt.newValue ? evt.newValue.split('#') : ['', 0];
                //console.log("handleTalk", eg.connectionName, "evt", evt, "key", evt.key);
                eg.dispatchEvent({ type: 'talk', name: eg.connectionName, action: temp[0], stamp: temp[1] });
            }
        };

	/**
	 * LDO alias: $ -> window.EGPlus.$
	 * @private This is the running horse under the hood
	 * @param {object} selector A string containing a selector expression
	 */
	function LDO(selector) {
        if (selector) { this.add(selector); }
	}

	// * make prototype extends array *
	p = LDO.prototype = [];

	/**
	 * Adds a new element dom, LDO or via selector
	 * extends the Array.push method
	 * @param {object} selector String, LDO or Array
	 */
	p.add = function (selector) {
		var i, l, nodes, elem;
		//console.info("$ -> add ", "selector:", selector);
		if (typeof selector === 'string') {
			nodes = document.querySelectorAll(selector);
			for (i = 0, l = nodes.length; i < l; i++) {
				this.push(nodes.item(i));
			}
		} else if (selector instanceof LDO || typeof selector.length === 'number') {
			for (i = 0, l = selector.length; i < l; i++) {
				elem = selector[i];
				if (elem instanceof Element) {
					this.push(elem);
				}
			}
		} else if (selector instanceof Element) {
			this.push(selector);
		}
		return this;
	};

    /**
     * public method eq
     * @param   {number} index
     * @returns {LDO}    A new LDO/$ object
     */
    p.eq = function (index) {
        var ldo = new LDO();
        ldo.push(this[index]);
        return ldo;
    };

    /**
     * public method find
     * @param   {string} A string containing a selector expression
     * @returns {LDO}    returns new LDO/$ object
     */
    p.find = function (selector) {
        var i, l, d, nodes, ldo = new LDO();
        for (i = 0, l = this.length; i < l; i++) {
            nodes = this[i].querySelectorAll(selector);
            for (d = 0; d < nodes.length; d++) {
                ldo.push(nodes.item(d));
            }
        }
        return ldo;
    };

    /**
     * public method trimSvgUrls
     * @returns {LDO} returns this for chaining
     */
    p.trimSvgUrls = function () {
        var elem, attr, attrName, url, i = this.length;
        while (--i >= 0) {
            elem = this[i];
            // for now we only try to get 'mask' of 'fill' attribute
            try {
                attr = elem.getAttribute('mask');
                attrName = 'mask';
            } catch (err) {
                // trimSvgUrl no mask attribute ... search for fill ...
                try {
                    attr = elem.getAttribute('fill');
                    attrName = 'fill';
                } catch (e) {
                    // trimSvgUrl silent fail ...
                }
            }
            if (attr && attr.indexOf('url') !== -1) {
                url = '#' + attr.split("(")[1].split(")")[0].split("#")[1];
                elem.setAttribute(attrName, 'url(' + window.location.href + url + ')');
                //console.log("trimSvgUrl -> tagName:", elem.tagName, "| attrName:", attrName, "| url:", url, "| href:", window.location.href);
            }
        }
		return this;
	};

	//
	// ***
	// creating EGPlus object
	// *
	window.EGPlus = eg = {};

	ad = {
		init: null,
		images: [],
		clicked: false,
		loaded: false,
		currentRepeat: 0,
        settings: { modalOpenerOnOver: false },
		isInitialized: function () {
			return initializedAd;
		}
	};
    eg.ad = ad;
    eg.data = {};

    /**
     * EventDispatcher (Mixin)
     * @example EGPlus.initEventDispatcher(obj);
     *              obj.on('eventType', function (event) {});
     *              obj.dispatchEvent('eventType');
     * @param   {object} obj The object to mixin EventDispatcher functionality
     * @returns {object} Returns the same object
     */
    eg.initEventDispatcher = function (obj) {
        // @property method
        // @property parameters
        var registry = {},
            register = function (type, method, params, once, ob) {
                var handler = {
					method: method || type,
					parameters: params,
					once: typeof once === 'boolean' ? once : false,
					stopPropagation: false
				};
                if (registry.hasOwnProperty(type)) {
					ob.off(type, method);
					registry[type].push(handler);
				} else {
					registry[type] = [handler];
				}
            };

        /**
         * The dispatchEvent method fires listeners for the specified event type
         * @param   {object} event An event type string or an object with a property 'type'
         * @returns {object} Returns this for chaining
         */
		Object.defineProperty(obj, 'dispatchEvent', {
			value: function (event) {
				var listeners, func, handler, i, l,
					type = typeof event === 'string' ? event : event.type;
				//console.info("dispatchEvent", "event:", event, "registry.hasOwnProperty(type):", registry.hasOwnProperty(type));
				if (registry.hasOwnProperty(type)) {
					listeners = registry[type];
					i = listeners.length;
                    while (--i > -1) {
                        handler = listeners[i];
                        func = handler.method;
                        if (typeof func === 'string') {
                            func = this[func];
                        }
                        // call handler
                        func.apply(this, handler.parameters || [event]);
                        // stop propagation
                        if (handler.stopPropagation) {
                            handler.stopPropagation = false;
                            break;
                        }
                        //console.log("dispatchEvent", "handler:", handler);
                        //console.log("dispatchEvent", "func:", func);

                        // unregister if once -> 'one'
                        if (handler.once && typeof handler.once === 'boolean') {
							listeners.splice(i, 1);
							if (listeners.length === 0) {
								registry[type] = null;
								return this;
							}
						}
                    }
				}
				return this;
			}
		});

        /**
         * The has method looks for a registered event of the given type
         * @param   {string}  type The event type as a string
         * @returns {boolean} Returns true if the event type is registered
         */
		Object.defineProperty(obj, 'has', {
			value: function (type) {
                //console.info("has", "type:", type, "registry.hasOwnProperty(type):", registry.hasOwnProperty(type), "registry[type]:", registry[type]);
				return (registry.hasOwnProperty(type) && registry[type] && registry[type].length > 0);
			}
		});

        /**
         * The on method registers a specified event type
         * @param   {string}   type   The event type as a string
         * @param   {function} method A callback function
         * @param   {object}   params An optional parameter object
         * @returns {object}   Returns this for chaining
         */
        Object.defineProperty(obj, 'on', {
			value: function (type, method, params, once) {
				//console.info("on", "type:", type, "registry.hasOwnProperty(type):", registry.hasOwnProperty(type));
                register(type, method, params, typeof once === 'boolean' ? once : false, this);
				return this;
			}
		});

        /**
         * The one method registers a specified event type once
         * @param   {string}   type   The event type as a string
         * @param   {function} method A callback function
         * @param   {object}   params An optional parameter object
         * @returns {object}   Returns this for chaining
         */
        Object.defineProperty(obj, 'one', {
			value: function (type, method, params) {
				//console.info("one", "type:", type, "registry.hasOwnProperty(type):", registry.hasOwnProperty(type));
				register(type, method, params, true, this);
				return this;
			}
		});

        /**
         * The off method unregisters a specified event type
         * @param   {string}   type   The event type as a string
         * @param   {function} method A callback function
         * @returns {object}   Returns this for chaining
         */
        Object.defineProperty(obj, 'off', {
			value: function (type, method) {
				if (registry.hasOwnProperty(type)) {
					//console.info("off", "type:", type, "registry.hasOwnProperty(type):", registry.hasOwnProperty(type), "registry[type]:", registry[type]);
					if (registry[type].length && method && typeof method === 'function') {
						var i, handler, listeners = registry[type], l = listeners.length;
						for (i = 0; i < l; i++) {
							handler = listeners[i];
							if (handler.method === method) {
								//console.info("off", "find handler");
								listeners.splice(i, 1);
								return this;
							}
						}
					} else {
						registry[type].splice(0);
					}
				}
				return this;
			}
		});

        /**
         * The off method unregisters a specified event type
         * @param   {string}   type   The event type as a string
         * @param   {function} method A callback function
         * @returns {object}   Returns this for chaining
         */
        Object.defineProperty(obj, 'stopPropagation', {
			value: function (event) {
				var listeners, func, handler, i, l,
					type = typeof event === 'string' ? event : event.type;
				//console.info("dispatchEvent", "event:", event, "registry.hasOwnProperty(type):", registry.hasOwnProperty(type));
				if (registry.hasOwnProperty(type)) {
					listeners = registry[type];
					i = listeners.length;
                    while (--i > -1) {
                        listeners[i].stopPropagation = true;
                        //console.log("dispatchEvent", "handler:", handler);
                        //console.log("dispatchEvent", "func:", func);
                    }
				}
				return this;
			}
		});

        return obj;
    };

	// mixin EventDispatcher to self
	eg.initEventDispatcher(eg);
	// mixin EventDispatcher to ad
	eg.initEventDispatcher(ad);
    //
    eg.CONNECTION_TYPE = 'NULL';

	/**
	 * Merge the contents of two or more objects together into the first object.
	 * @param   {object} target An object that will receive the new properties
	 * @param   {object} objA   An object containing additional properties to merge in.
	 * @param   {object} objN   optional Additional objects containing properties to merge in.
	 *                          optional if last argument is boolean and true (default is false) we only override existing properties
	 *                          optional if last argument is not undefined and int (enum/state)
	 *                          enum exists:
	 *                          0 : null -> write all properties
	 *                          1 : existsInTarget -> overwrite only properties that exists in target
	 *                          2 : existsInObject -> overwrite only properties that not undefined in additions objects
	 * @returns {object} The target object (first argument) will be modified, and will also be returned.
	 */
	eg.extend = function (target, objA, objN) {
		var n, i, o, v, t, al = arguments.length,
            lastArg = arguments[al - 1],
            state = (typeof lastArg !== 'number') ? 0 : (lastArg > 2) ? 2 : (lastArg < 0) ? 0 : lastArg,
			l = (state > 0) ? al - 1 : al;
		//console.log("### extend ", "target:", target);
		//console.log("### extend ", "objA:", objA);
		//console.log("### extend ", "state:", state, "length:", l);
		// run through objects properties
		for (i = 1; i < l; i++) {
			o = arguments[i];
			//console.log("### extend exists ", "o:", o);
			for (n in o) {
                // if not undefined or null
				if (Object.prototype.hasOwnProperty.call(o, n)) {
                    v = o[n];
                    t = typeof v;
                    switch (state) {
                    case 1:
                        // overwrite only properties that exists in target
                        if (typeof target[n] !== 'undefined') {
                            target[n] = v;
                            //console.log("### extend existsInTarget ", "key:", n, "value:", o[n]);
                        }
                        break;
                    case 2:
                        // overwrite only properties that not undefined in additions objects
                        if (typeof v !== 'undefined') {
                            target[n] = v;
                            //console.log("### extend existsInObject ", "key:", n, "value:", o[n]);
                        }
                        break;
                    default:
                        target[n] = v;
                        //console.log("### extend write all properties ", "key:", n, "value:", v);
                        break;
                    }
				}
			}
		}
		return target;
	};

	eg.nsElems = 'svg g polygon rect polyline pattern defs circle ellipse line path';

	/**
	 * Creates a new DOM element
	 * @param   {object} parent   A DOM element to append elem to
	 * @param   {string} tag      The tag name of the created element
	 * @param   {object} attrObj  An optional attribute object
	 * @param   {object} styleObj An optional style object
	 * @returns {object} The new DOM element
	 */
	eg.createElem = function (parent, tag, attrObj, styleObj) {
		var i, l, n, ns = (eg.nsElems.indexOf(tag) !== -1) ? "http://www.w3.org/2000/svg" : "",
			elem = (ns !== "") ? document.createElementNS(ns, tag) : document.createElement(tag);
		for (n in attrObj) {
			if (attrObj.hasOwnProperty(n)) {
                try {
                    elem.setAttribute(n === 'className' ? 'class' : n, attrObj[n]);
                } catch (errAttr) {}
			}
		}
		for (n in styleObj) {
			if (styleObj.hasOwnProperty(n)) {
				//console.log("createElem ", "style:", n,  "value:", styleObj[n]);
                try {
                    elem.style[n] = styleObj[n];
                } catch (err) {}
			}
		}
		if (parent.length) {
			l = parent.length;
			for (i = 0; i < l; i++) {
				parent[i].appendChild(elem);
			}
		} else {
			parent.appendChild(elem);
		}
		return elem;
	};

    /**
     * Connect to talk from master to others
     * @param {string} name The connection name for the ad
     * @param {number} max  The total numbers of ads to connect (only master ad)
     */
    eg.connect = function(name, max) {
        eg.connectionName = name;
        if (max) {
            eg.connectionMax = max;
            // M A S T E R
            window.addEventListener(getLocalEventName(), handleConnect);
        } else {
            // R E C E I V E R
            window.addEventListener(getLocalEventName(), handleTalk);
        }
    };

    eg.talk = function (action) {
        wlstg.setItem("talk", action + "#" + Date.now());
    };

	/**
	 * Entry point for the client
	 * @param {object} initObj settings object
	 */
	eg.initAd = function (initObj) {
        if (initObj) {
            eg.extend(ad.settings, initObj);
            //console.log("initAd:", ad.settings);
        }
		// Setting ad size
		ad.size = {
			width: gsap.getProperty($wrapper[0], "width") || ad.settings.width,
			height: gsap.getProperty($wrapper[0], "height") || ad.settings.height
		};
		// call ABSTRACT TEMPLATE OPERATION
		ad.init();
		// always set initialized to true
		initializedAd = true;
	};

	eg.isInitialized = function () {
		return initialized;
	};

	eg.getUniqueID = function () {
		return UID++;
	};

    eg.getRan = function (min, max) {
        return (Math.random() * (max - min) + min);
    };

    eg.getPlusMinus = function () {
		return (1 - (Math.floor(Math.random() * 2) * 2));
	};

	//
	// ***
	// making factory method $ and LD public via window.EGPlus
	// *
	$ = eg.$ = eg.LD = function (selector) {
        return new LDO(selector);
    };

    /**
     * CONCRETE operation
     * Setting images background
     * background - order:
     * background-image		default: none
     * background-position	default: 0% 0% Units can be pixels (0px 0px)
     * background-size		default: auto The background-image contains its width and height
     *                               has to be after background-position with a slash '/'
     * background-repeat	default: background-attachment	default: scroll
     * background-color		default: transparent
     *
     * Note: If using multiple background-image sources but also want
     * a background-color, the background-color parameter needs to be last in the list.
     * image -> url, , y, background-size, repeat
     */
    ad.setBkgImages = function () {
		var $elem, image, i, x, y, bs, r, imgs = ad.images, l = imgs.length;
		for (i = 0; i < l; i++) {
			image = imgs[i];
			if (image.id !== '') {
				$elem = $(image.id);
                if ($elem.length) {
                    x = image.x || 0;
                    y = image.y || 0;
                    bs = image.bs || 'auto';
                    r = image.repeat || 'no-repeat';
                    //console.log("setBkgImages", "image.id:", image.id, "$elem[0]:", $elem[0]);
                    $elem[0].style.background = 'url(' + image.url + ') ' + x + ' ' + y + '/' + bs + ' ' + r + ' transparent';
                } else {
                    throw new Error('ERROR inside ad.setBkgImages - cannot get dom node via selector!');
                }
			}
			//console.log("ad.setBkgImages ", "$elem:", $elem, "image:", image, "url:", ('url(' + image.url + ') ' + x + ' ' + y + '/' + bs + ' ' + r + ' transparent'));
		}
    };

    //ad.loadExtCss("index.css");
    ad.loadExtCss = function (src) {
        // Load in CSS
        var extCSS = document.createElement('link');
        extCSS.setAttribute("rel", "stylesheet");
        extCSS.setAttribute("type", "text/css");
        extCSS.setAttribute("href", src);
        document.getElementsByTagName("head")[0].appendChild(extCSS);
    };

    /**
     * CONCRETE operation
     * @param {Array}    images An array with image urls
     */
	ad.loadImages = function (images, done) {
        var i, img, image, totalImagesLoaded = 0, l = images.length,
            onLoadImage = function () {
				//console.log("onLoadImage ");
                totalImagesLoaded++;
                if (totalImagesLoaded === l) {
					if (done) {
                        done();
                    } else {
                        ad.loaded = true;
                    }
				}
            },
			onProgressImages = function (e) {
				//console.log("onProgressImages ", e);
				if (ad.has('imageProgress')) {
					// HOOK operation
					ad.dispatchEvent({ type: 'imageProgress', event: e });
				}
			},
			onError = function (e) {
				if (ad.has('imageError')) {
					// HOOK operation
					ad.dispatchEvent({ type: 'imageError', event: e });
				}
				onLoadImage();
			};

		ad.loaded = false;

        // 3-2-1 loop
        for (i = 0; i < l; i++) {
			image = images[i];
			if (image && image.url) {
				img = new Image();
				img.addEventListener('load', onLoadImage);
				img.addEventListener('error', onError);
				img.src = image.url;
				ad.images.push(image);
			}
        }
		return ad;
    };

	/**
     * CONCRETE operation
     */
	ad.politeLoad = function (images) {
		// add promise
		function done() {
			// CONCRETE operation
			ad.setBkgImages();
            ad.loaded = true;
			ad.start();
		}
		ad.loadImages(images, done);
	};

    /**
     * CONCRETE operation
     */
    ad.initTimeline = function () {
		// create main timeline
        ad.tl = new gsap.timeline({
            defaults: { ease: "power1", duration: 0.5 },
            paused: true,
			onStart: function () {
				ad.maxRepeat = Math.floor(ad.tl.totalDuration() / ad.tl.duration()) - 1;
                if (ad.has('started')) {
                    ad.dispatchEvent({ type: 'started', time: ad.tl.totalTime() / ad.tl.timeScale() });
                }
			},
            onRepeat: function () {
				ad.currentRepeat++;
				if (ad.has('repeat')) {
                    ad.dispatchEvent({ type: 'repeat', time: ad.tl.totalTime() / ad.tl.timeScale() });
                }
			},
			onComplete: function () {
				if (ad.has('completed')) {
                    ad.dispatchEvent({ type: 'completed', time: ad.tl.totalTime() / ad.tl.timeScale() });
                }
			}
        });
		ad.tl.timeScale(1.0);
    };

    /**
     * TEMPLATE method
     */
    ad.start = function () {
		ad.loaded = true;
		// HOOK operation - maybe overridden by client
        if (ad.initAnimation) { ad.initAnimation(); }
		// Template operation
		ad.initTimeline();
		// CONCRETE operation - has to be overridden by client
		try {
			ad.setTimelines();
			// HOOK operation - maybe overridden by client
			if (!ad.visibilityHandler) {
				ad.tl.play();
			}
		} catch (err) {}
        if (ad.has('start')) {
			ad.dispatchEvent({ type: 'start' });
		}
        //🌐🛑⌨️🔎🔒📍🗳️⬆️↗️➡️↘️⬇️↙️⬅️↖️↕️↔️❗⭕✔️🔹🔸🏁
        console.log("EG+ 🌐 H T M L 5 - S L I M", "3.2.1", "🔒 URI PARAMS:", gup);
        // set automatic fallback situation
        if (typeof gup.egpfallback === 'string' && gup.egpfallback === '1') {
            //var total = ad.tl.totalDuration();
            setTimeout(function () {ad.tl.seek(ad.tl.totalDuration()); }, 10);
        }
    };

    ad.init = function () {};

	/**
	 * @private Helper
	 * @param {LDO}    $elem     Element to register
	 * @param {string} eventType The event type string property
	 */
	function registerBtnClick($elem, eventType) {
        // 'closeBtnClick'
        //console.log("registerBtnClick ", "$elem:", $elem);
        if ($elem && $elem.length > 0) {
            var selector = $elem[0].getAttribute('egp-target'),
                autoPause = Boolean(Number($elem[0].getAttribute('egp-autopause'))),
                autoPlay = $elem[0].getAttribute('egp-autoplay'),
                $target = $(selector),
                eventCaller = (eventType === 'openBtnClick' && ad.settings.modalOpenerOnOver) ? 'mouseenter' : 'click';
            //console.log("registerBtnClick ", "selector:", selector);
            //console.log("registerBtnClick ", "$target:", $target);
            //console.log("registerBtnClick ", "eventType:", eventType, "autoPause:", autoPause);
            if ($target.length > 0 && eventType === 'openBtnClick') {
                gsap.set($target, { css: { display: 'none' } });
            }
            if (eventType === 'closeBtnClick') {
                gsap.set($elem, { css: { display: 'none' } });
            }
            //console.log("registerBtnClick ", "eventType:", eventType, "eventCaller:", eventCaller);
            $elem[0].addEventListener(eventCaller, function (e) {
                var isCloseBtnInsideModal = eventType === 'modalClick' && (e.target.getAttribute('egp-module') === "close-btn" || e.target.tagName.toUpperCase() === 'EGP-CLOSE-BTN');
                //console.log("registerBtnClick ", "isCloseBtnInsideModal:", isCloseBtnInsideModal, "eventType:", eventType, "e.target:", e.target);

                //console.log("registerBtnClick ", "$elem[0]):", $elem[0]);
                //console.log("registerBtnClick ", "eg.has(eventType):", eg.has(eventType));
                if ($target.length > 0 && eventType === 'openBtnClick') {
                    //console.log("registerBtnClick A", "$target:", $target);
                    //console.log("registerBtnClick A", "autoPause:", autoPause, "ad.tl:", ad.tl);
                    gsap.set('[egp-module="close-btn"], egp-close-btn', { css: { display: 'block' } });
                    gsap.set($elem, { css: { display: 'none' } });
                    gsap.set($target, { css: { display: 'block' } });
                    gsap.fromTo($target, { duration: 0.21, opacity: 0 }, { opacity: 1 });
                    eg.$target = $elem;
                    if (autoPause && ad.tl && !ad.tl.paused()) {
                        ad.tl.pause();
                    }
                }

                if (eventType === 'closeBtnClick') {
                    //console.log("registerBtnClick B", "$target:", $target);
                    //console.log("registerBtnClick B", "autoPlay:", autoPlay);
                    //console.log("registerBtnClick B", "$elem[0].parentNode:", $elem[0].parentNode);
                    gsap.set('[egp-module="close-btn"], egp-close-btn', { css: { display: 'none' } });
                    if ($target.length > 0) {
                        gsap.set($target, { css: { display: 'none' } });
                        if (autoPlay && ad.tl && ad.tl.paused) {
                            ad.tl.play();
                        }
                    } else {
                        gsap.set($elem[0].parentNode, { css: { display: 'none' } });
                        if (ad.tl && ad.tl.paused) {
                            ad.tl.play();
                        }
                    }
                    if (eg.$target && eg.$target.length) {
                        gsap.set(eg.$target, { css: { display: 'block' } });
                        eg.$target = null;
                    }

                }
                if (eg.has(eventType)) {
                    eg.dispatchEvent({ type: eventType, target: e.target, origEvent: e });
                }
                if (ad.has(eventType)) {
                    ad.dispatchEvent({ type: eventType, target: e.target, origEvent: e });
                }
                if (!isCloseBtnInsideModal) {
                    e.stopPropagation();
                    return false;
                }
            }, true);
        }
	}

    eg.clickThrough = function (clicktag) {
        window.open(clicktag || gup.clicktag, '_blank');
    };

	function registerClickThrough() {
        $wrapper = $('#bg-exit');
		// simple click through function
        if ($wrapper && $wrapper.length > 0) {
            hasRegisteredBgExit = true;
            // register egp-module
            registerBtnClick($('[egp-module="close-btn"], egp-close-btn'), 'closeBtnClick');
            registerBtnClick($('[egp-module="open-btn"], egp-open-btn'), 'openBtnClick');
            registerBtnClick($('[egp-module="modal"], egp-modal'), 'modalClick');
            $wrapper[0].addEventListener('click', function (e) {
				var hasClickThrough = eg.has('clickThrough');
				//console.log("click ", "hasClickThrough", hasClickThrough, "initializedAd", initializedAd);
                if (eg.has('beforeClickThrough')) {
                    eg.dispatchEvent({ type: 'beforeClickThrough', origEvent: e });
                }
				if (hasClickThrough) {
					eg.dispatchEvent({ type: 'clickThrough', origEvent: e });

				} else if (initializedAd) {
					//console.info("clicktag:", gup.clicktag);
					eg.clickThrough();
				}
				if (hasClickThrough || initializedAd) {
					ad.clicked = true;
				}
                if (eg.has('afterClickThrough')) {
                    eg.dispatchEvent({ type: 'afterClickThrough', origEvent: e });
                }
			}, false);
        }
	}

	function initialize() {
		initialized = true;
        if (eg.connectionName) {
            eg.CONNECTION_TYPE = 'LOCAL_STORAGE';
            console.log("EG+ ⭕ H T M L 5 - C O N N E C T I O N - 5.0.0 🔒", "TYPE:", eg.CONNECTION_TYPE, "NAME:", eg.connectionName);
            // here we send message from every ad for connection between
            setTimeout(function () {
                //wlstg.removeItem("connected");
                //return;
                var value, conn = wlstg.getItem('connected');
                //console.log("EG+ 🔹", eg.connectionName, "initialize:", conn);
                value = JSON.parse(conn);
                //console.log("EG+ 🔹", eg.connectionName, "initialize:", value);
                if (Array.isArray(value)) {
                    value.push(eg.connectionName + Date.now());
                    //master is last so dispatch connected - we're ready to talk after timeout
                    if (eg.connectionMax && value.length === eg.connectionMax) {
                        setTimeout(function () {
                            handleConnect({ key: 'connected' });
                        });
                    }
                } else {
                    value = [eg.connectionName + Date.now()];
                }
                //console.log("EG+ 🔹", eg.connectionName, "initialize:", value);
                wlstg.setItem("connected", JSON.stringify(value));
            }, timeout);
        }
		if (!hasRegisteredBgExit) {
			registerClickThrough();
		}
		eg.dispatchEvent({ type: 'init' });
	}

	function domContentLoaded() {
		document.removeEventListener('DOMContentLoaded', domContentLoaded, false);
		registerClickThrough();
	}

    // e.g. get clicktag param
    // self invoking function
    gup = eg.uriParams = (function () {
        var i, pair, val, ct,
            query_string = { clicktag: 'https://www.example.com/' },
            query = window.location.search.substring(1),
            parmsArray = query.split('&');
        if (parmsArray.length <= 0) { return query_string; }
        for (i = 0; i < parmsArray.length; i += 1) {
            pair = parmsArray[i].split('=');
            val = decodeURIComponent(pair[1]);
            pair[0] = pair[0].toLowerCase();
            if (val !== '' && pair[0] !== '') { query_string[pair[0]] = val; }
        }
        return query_string;
    }());

    if (document.readyState === 'interactive' || document.readyState === 'complete') {
		registerClickThrough();
	} else {
		document.addEventListener('DOMContentLoaded', domContentLoaded, false);
	}

	if (window.addEventListener) {
		window.addEventListener('load', initialize);
	} else {
		window.onload = initialize;
	}

}());
