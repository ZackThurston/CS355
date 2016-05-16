var ajaxLogin = function() {

    var payload = {
        username: $('#username').val(),
        password: $('#password').val()

    };

    $.ajax({
        url: '/authenticate',  // url where we want to send the form data
        type: 'GET', // the type of form submission; GET or POST
        contentType: "json",  // the type of data we are sending
        data: payload,  // the actual data we are sending
        complete: function(data) {  // what to do with the response back from the server
            window.location.assign(data.responseJSON.url);
        }
    })
}

$(document).ready(function() {

    $('#loginButton').click(function(e) {
        console.log('loginButton clicked');

        e.preventDefault();

        ajaxLogin();
    });
});