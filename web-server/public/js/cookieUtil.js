/**
 * Created by xuanzhi.zhang on 11/10/14.
 */

function setCookie(cookieName, cookieValue, duration) {
    var expireTime = new Date();
    expireTime.setTime(expireTime.getTime() + duration);
    document.cookie = cookieName + '=' + cookieValue + '; ' + 'expires=' + expireTime.toUTCString();
}

function getCookie(cookieName) {
    var name = cookieName + '=';
    var cookieArr = document.cookie.split(';');
    for (var i = 0, length = cookieArr.length; i < length; i++) {
        var theCookie =cookieArr[i];
        while (theCookie(0) === ' ') {
            theCookie = theCookie.substring(1);
        }
        if (theCookie.indexOf(name) != -1) {
            return theCookie.substring(name.length, theCookie.length);
        }
    }
    return '';
}
