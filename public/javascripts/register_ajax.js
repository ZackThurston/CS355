var ajaxRegister = function() {

    var payload = {
        username: $('#username').val(),
        password: $('#password').val()

    };

    $.ajax({
        url: '/newUser',  // url where we want to send the form data
        type: 'GET', // the type of form submission; GET or POST
        contentType: "json",  // the type of data we are sending
        data: payload,  // the actual data we are sending
        complete: function(data) {  // what to do with the response back from the server
            // send new user to homepage
            window.location.assign('/');
        }
    })
}

$(document).ready(function() {

    $('#registerButton').click(function(e) {

        e.preventDefault();

        ajaxRegister();
    });
});