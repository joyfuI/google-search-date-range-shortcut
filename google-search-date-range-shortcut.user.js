// ==UserScript==
// @name		Google Search Date Range Shortcut
// @namespace	https://joyfui.wo.tc/
// @version		4
// @author		joyfuI
// @description	구글 검색에서 기간 설정에 날짜 범위를 다양하게 추가합니다.
// @homepageURL	https://github.com/joyfuI/google-search-date-range-shortcut
// @downloadURL	https://raw.githubusercontent.com/joyfuI/google-search-date-range-shortcut/master/google-search-date-range-shortcut.user.js
// @include		https://www.google.*/search*
// @include		https://www.google.*.*/search*
// @run-at		document-end
// @grant		none
// ==/UserScript==

(function () {
	"use strict";
	// new Range(메뉴이름, 시작일, 종료일, 메뉴삽입위치) 꼴로 자유롭게 수정. 메뉴삽입위치에는 id를 적으면 되며 id 앞쪽에 삽입됨
	const list = [
		new Range('지난 3일', dateStep(new Date(), '-3d'), new Date(), 'qdr_w'),
		new Range('지난 2주', dateStep(new Date(), '-14d'), new Date(), 'qdr_m'),
		new Range('지난 3개월', dateStep(new Date(), '-3m'), new Date(), 'qdr_y'),
		new Range('지난 6개월', dateStep(new Date(), '-6m'), new Date(), 'qdr_y'),
		new Range('지난 2년', dateStep(new Date(), '-2y'), new Date(), 'cdr_opt')
	];

	function main() {
		let menu = document.getElementById('qdr_').parentNode;
		let baseNode = document.getElementById((document.getElementById('qdr_h').classList.contains('hdtbSel')) ? 'qdr_d' : 'qdr_h').cloneNode(true);
		baseNode.removeAttribute('id');

		for (let i of list) {
			let newNode = baseNode.cloneNode(true);
			let link = newNode.getElementsByTagName('a')[0];

			link.textContent = i.name;
			let tbs = encodeURIComponent(`cdr:1,cd_min:${dateToStr(i.min)},cd_max:${dateToStr(i.max)}`);
			link.href = link.href.replace(/&tbs=.*&/, `&tbs=${tbs}&`);
			menu.insertBefore(newNode, document.getElementById(i.position));
		}
	}

	function dateToStr(date) {
		return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
	}

	// 기준일로부터 특정 간격 이후의 날짜를 반환. ex) dateStep(new Date(), '-1y-6m') - 오늘로부터 1년6개월 전
	function dateStep(date, str) {
		let cloneDate = new Date(date.getTime());

		if (str.indexOf('d') != -1) {
			cloneDate.setDate(cloneDate.getDate() + parseInt(str.match(/-?\d+d/)[0]));
		}
		if (str.indexOf('m') != -1) {
			cloneDate.setMonth(cloneDate.getMonth() + parseInt(str.match(/-?\d+m/)[0]));
		}
		if (str.indexOf('y') != -1) {
			cloneDate.setFullYear(cloneDate.getFullYear() + parseInt(str.match(/-?\d+y/)[0]));
		}
		return cloneDate;
	}

	function Range(name, min, max, position) {
		this.name = name;
		this.min = min;
		this.max = max;
		this.position = position;
	}

	// 왜인진 모르겠으나 페이지 로딩 직후엔 해당 엘리먼트가 인식되지 않아서 타이머로 지속 체크
	let timer = setInterval(function () {
		if (document.getElementById('qdr_') != null) {
			clearInterval(timer);
			setTimeout(main, 0);
		}
	}, 500);
})();
