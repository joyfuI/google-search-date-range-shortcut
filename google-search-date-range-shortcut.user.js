// ==UserScript==
// @name         Google Search Date Range Shortcut
// @namespace    https://joyfui.wo.tc/
// @version      5
// @author       joyfuI
// @description  구글 검색에서 기간 설정에 날짜 범위를 다양하게 추가합니다.
// @homepageURL  https://github.com/joyfuI/google-search-date-range-shortcut
// @downloadURL  https://raw.githubusercontent.com/joyfuI/google-search-date-range-shortcut/master/google-search-date-range-shortcut.user.js
// @include      https://www.google.*/search*
// @include      https://www.google.*.*/search*
// @run-at       document-end
// @grant        none
// ==/UserScript==

(function () {
    "use strict";
    // [메뉴이름, 기간] 꼴로 자유롭게 수정
    const list = [
        ['지난 1시간', 'h'],
        ['지난 1일', 'd'],
        ['지난 3일', 'd3'],
        ['지난 1주', 'w'],
        ['지난 2주', 'w2'],
        ['지난 1개월', 'm'],
        ['지난 3개월', 'm3'],
        ['지난 6개월', 'm6'],
        ['지난 1년', 'y'],
        ['지난 2년', 'y2']
    ];

    function main() {
        const menu = document.querySelector('#lb > div > g-menu');
        let baseNode;
        if (menu.childNodes[1].getElementsByTagName('a').length !== 0) {
            baseNode = menu.childNodes[1].cloneNode(true);
        } else {
            baseNode = menu.childNodes[2].cloneNode(true);
        }
        baseNode.classList.remove('nvELY');

        // 기존 메뉴 제거
        const count = menu.childElementCount - 2;
        for (let i = 0; i < count; i++) {
            menu.removeChild(menu.childNodes[1])
        }

        // 새 메뉴 추가
        const url = new URL(location.href);
        for (const item of list) {
            const newNode = baseNode.cloneNode(true);
            if (url.searchParams.get('tbs') === `qdr:${item[1]}`) {
                newNode.classList.add('nvELY');
            }
            const link = newNode.getElementsByTagName('a')[0];

            link.textContent = item[0];
            link.href = link.href.replace(/&tbs=.*&/, `&tbs=qdr:${item[1]}&`);
            menu.insertBefore(newNode, menu.lastElementChild);
        }

        // 마우스오버 이벤트 추가
        for (const node of menu.childNodes) {
            node.addEventListener('mouseover', () => node.classList.add('gvybPb'));
            node.addEventListener('mouseout', () => node.classList.remove('gvybPb'));
        }
    }

    // 왜인진 모르겠으나 페이지 로딩 직후엔 해당 엘리먼트가 인식되지 않아서 타이머로 지속 체크
    const timer = setInterval(() => {
        if (document.getElementById('lb').childElementCount != 0) {
            clearInterval(timer);
            setTimeout(main, 0);
        }
    }, 500);
})();
