window.onload = function() {


    var oBut = document.getElementById('list');
    var aLi = oBut.getElementsByTagName('li');
    var aA1 = document.getElementById('prev');
    var aA2 = document.getElementById('next');
    var i = iNow = 0;
    var timer = null;
    var aSort = [];
    var aPosition = [{
        width: 629,
        height: 419,
        top: 0,
        left: 233,
        zIndex: 10
    }, {
        width: 502,
        height: 334,
        top: 40,
        left: 0,
        zIndex: 8
    }, {
        width: 300,
        height: 200,
        top: 70,
        left: 390,
        zIndex: 6
    }, {
        width: 502,
        height: 334,
        top: 40,
        left: 592,
        zIndex: 8
    }]

    for (i = 0; i < aLi.length; i++) {
        aLi[i].index = i;
        aLi[i].style.width = aPosition[i].width + 'px';
        aLi[i].style.height = aPosition[i].height + 'px';
        aLi[i].style.top = aPosition[i].top + 'px';
        aLi[i].style.left = aPosition[i].left + 'px';
        aLi[i].style.zIndex = aPosition[i].zIndex;
        aSort[i] = aPosition[i];
        myAddEvent(aLi[i], 'mouseover', function() {
            var oDiv = this.getElementsByTagName('div')[0];
            startMove(oDiv, {
                opacity: 0
            });
            //if(this.style.width == '344px'){
            //				startMove(aP[this.index], {bottom:0});
            //			}
        });
        myAddEvent(aLi[i], 'mouseout', function() {
            if (this.style.width == '629px') {
                //startMove(aP[this.index], {bottom:-120});
                var oDiv = this.getElementsByTagName('div')[0];
                startMove(oDiv, {
                    opacity: 0
                });
            } else {
                var oDiv = this.getElementsByTagName('div')[0];
                startMove(oDiv, {
                    opacity: 35
                });
            }
        });
        myAddEvent(aLi[i], 'click', function() {
            var iSort = this.index;
            iNow = this.index;

            Sort();
            for (i = 0; i < iSort; i++) {
                aSort.unshift(aSort.pop());
            }
            sMove();
        });
    }
    myAddEvent(aA1, 'click', function() {
        aSort.unshift(aSort.pop());
        sMove();
        setInter();
    });
    myAddEvent(aA2, 'click', function() {
        aSort.push(aSort.shift());
        sMove();
        iNow--;
        if (iNow < 0) iNow = aLi.length - 1;
        tab();
    });
    oBut.onmouseover = function() {
        clearInterval(timer);
    };
    oBut.onmouseout = function() {
        clearInterval(timer);
        timer = setInterval(setInter, 5000);
    };
    timer = setInterval(setInter, 5000);

    function setInter() {
        iNow++;
        if (iNow > aLi.length - 1) iNow = 0;
        tab();
    }

    function tab() {
        /*	for(i=0;i<oTli.length;i++)oTli[i].className = '',startMove(oTli[i], {opacity:40});
            oTli[iNow].className = 'hove';
            startMove(oTli[iNow], {opacity:100})*/
        var iSort = iNow;
        Sort();
        for (i = 0; i < iSort; i++) {
            aSort.unshift(aSort.pop());
        }
        sMove();
    }

    function Sort() {
        for (i = 0; i < aLi.length; i++) {
            aSort[i] = aPosition[i];
        }
    }

    function sMove() {
        for (i = 0; i < aLi.length; i++) {
            var oDiv = aLi[i].getElementsByTagName('div')[0];
            startMove(oDiv, {
                opacity: 35
            });
            startMove(aLi[i], aSort[i], function() {
                one();
            });
            aLi[i].className = '';
        }
        aLi[iNow].className = 'hove';

    }

    function one() {
        for (i = 0; i < aLi.length; i++) {
            if (aLi[i].style.width == '629px') {
                var oDiv = aLi[i].getElementsByTagName('div')[0];
                startMove(oDiv, {
                    opacity: 0
                });
            }
        }
    }
    one();
};

function getClass(oParent, sClass) {
    var aElem = document.getElementsByTagName('*');
    var aClass = [];
    var i = 0;
    for (i = 0; i < aElem.length; i++)
        if (aElem[i].className == sClass) aClass.push(aElem[i]);
    return aClass;
}

function myAddEvent(obj, sEvent, fn) {
    if (obj.attachEvent) {
        obj.attachEvent('on' + sEvent, function() {
            fn.call(obj);
        });
    } else {
        obj.addEventListener(sEvent, fn, false);
    }
}

function startMove(obj, json, fnEnd) {
    if (obj.timer) clearInterval(obj.timer);
    obj.timer = setInterval(function() {
        doMove(obj, json, fnEnd);
    }, 30);
}

function getStyle(obj, attr) {
    return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj, false)[attr];
}

function doMove(obj, json, fnEnd) {
    var iCur = 0;
    var attr = '';
    var bStop = true;
    for (attr in json) {
        attr == 'opacity' ? iCur = parseInt(100 * parseFloat(getStyle(obj, 'opacity'))) : iCur = parseInt(getStyle(obj, attr));
        if (isNaN(iCur)) iCur = 0;
        if (navigator.userAgent.indexOf("MSIE 8.0") > 0) {
            var iSpeed = (json[attr] - iCur) / 3;
        } else {
            var iSpeed = (json[attr] - iCur) / 5;
        }
        iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
        if (parseInt(json[attr]) != iCur) bStop = false;
        if (attr == 'opacity') {
            obj.style.filter = "alpha(opacity:" + (iCur + iSpeed) + ")";
            obj.style.opacity = (iCur + iSpeed) / 100;
        } else {
            attr == 'zIndex' ? obj.style[attr] = iCur + iSpeed : obj.style[attr] = iCur + iSpeed + 'px';
        }
    }
    if (bStop) {
        clearInterval(obj.timer);
        obj.timer = null;
        if (fnEnd) fnEnd();
    }
}