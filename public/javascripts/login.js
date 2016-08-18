function checkForm() {
    var ok = true;

    var name = document.getElementById("name");
    if (name.value == "") {
        name.style.borderColor = "#E34234";
        ok = false;
    }
    var pass1 = document.getElementById("password");
    if (pass1.value == "") {
        pass1.style.borderColor = "#E34234";
        ok = false;
    }
    return ok;
}

$( "#target" ).submit(function( event ) {
    alert( "Handler for .submit() called." );
    event.preventDefault();
});

function typeCheck() {
    if ($('#registerType1').is(':checked')) $('#employerField').css('display','block');
    else $('#employerField').css('display','none');
}

$("#login-form").submit(function (e) {
    $.ajax({
        type: 'POST',
        url: '/login',
        datatype: "json",
        data: $('#login-form').serialize(),
        success: function (data) {
            // console.log(data);
            $("#loginModal").modal('hide');
            $("#menu").html(data);
        },
        error: function(result){
            console.log(result);
            $("#login-alert").css("display","block");
        }
    });
    e.preventDefault();
});

$("#register-form").submit(function (e) {
    $.ajax({
        type: 'POST',
        url: '/register',
        datatype: "json",
        data: $('#register-form').serialize(),
        success: function (data) {
            $("#loginModal").modal('hide');
        },
        error: function(result){
            console.log(result);
        }
    });
    e.preventDefault();
});