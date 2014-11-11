$(document).ready(function() {
    var username = getCookie('username');
    $('.username').text(username);

    console.log(sessionStorage.getItem('users'));
});
