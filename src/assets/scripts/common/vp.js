/**
 * Created by 847789 on 2017/8/9.
 */
(function(doc, win) {
	const docEl = doc.documentElement;
	const resizeEvt =
		"orientationchange" in window ? "orientationchange" : "resize";
	const recalc = function() {
		let [clientWidth] = [docEl.clientWidth];
		if (!clientWidth) return;
		if (clientWidth >= 640) clientWidth = 640;
		// docEl.style.fontSize = `${(clientWidth / 640) * 20}px`;
		docEl.style.fontSize = `${(clientWidth / 750) * 100}px`;
	};

	if (!doc.addEventListener) return;
	win.addEventListener(resizeEvt, recalc, false);
	doc.addEventListener("DOMContentLoaded", recalc, false);
	recalc();
	// old
	// let meta = document.querySelector('meta[name="viewport"]')
	function init(dpr) {
		// let scale = 1 / dpr
		let vw = docEl.clientWidth;
		const vh = docEl.clientHeight;
		vw = vw < 320 ? 320 : vw;
		vw = vw > 640 ? 640 : vw;
		docEl.setAttribute("data-dpr", dpr); // 动态写入样式
		// meta.setAttribute('content', 'width=' + "device-width" + ',initial-scale=' + scale + ',maximum-scale=' + scale + ', minimum-scale=' + scale + ',user-scalable=no')// 设置data-dpr属性，留作的css hack之用
		window.vw = vw;
		window.vh = vh;
		// 上次上线前修改版本号
		window.it = "2018062801";
	}
	init(window.devicePixelRatio || 1);
	function handleFontSize() {
		// 设置网页字体为默认大小
		window.WeixinJSBridge.invoke("setFontSizeCallback", {
			fontSize: 0
		});
		// 重写设置网页字体大小的事件
		window.WeixinJSBridge.on("menu:setfont", function() {
			window.WeixinJSBridge.invoke("setFontSizeCallback", {
				fontSize: 0
			});
		});
	}
	// 安卓，禁止用户缩放字号
	if (
		typeof window.WeixinJSBridge === "object" &&
		typeof window.WeixinJSBridge.invoke === "function"
	) {
		handleFontSize();
	} else {
		if (document.addEventListener) {
			document.addEventListener(
				"WeixinJSBridgeReady",
				handleFontSize,
				false
			);
			return;
		}
		if (document.attachEvent) {
			document.attachEvent("WeixinJSBridgeReady", handleFontSize);
			document.attachEvent("onWeixinJSBridgeReady", handleFontSize);
		}
	}
})(document, window);
