var addNewGame = function() {
    /*
     We define a payload JavaScript object that contains the same sort of information our query parameter string did
     before; i.e. genre: $(‘genre_name’).val() is the same as ?genre_name=user_entered_value_in_the_genre_name_input_box
     */
    var payload = {
        title: $('#title').val(),
        description: $('#description').val(),
        rating_id: $('#rating_id').val()
    };

    // Next we configure the jQuery ajax call
    $.ajax({
        url: '/game/insert',  // url where we want to send the form data
        type: 'GET', // the type of form submission; GET or POST
        contentType: "json",  // the type of data we are sending
        data: payload,  // the actual data we are sending
        complete: function(data) {  // what to do with the response back from the server

            window.location.assign('/game/all');

        }
    })
}

// $(document).ready() tells the browser not to run the following code until after all the HTML has been parsed
$(document).ready(function() {

    // Now that the HTML has been parsed the browser knows that there is a button with the id addBtn.
    // We are overriding the click function of the button, to run the code we specify.
    $('#createGame').click(function(e) {

        // this prevents the form from being submitted using the non-ajax method
        e.preventDefault();

        // runs the ajax function defined above.
        addNewGame();
    });
});