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
            if (data.status == "success") {
                $("#loginModal").modal('hide');
                // $("#menu").html(data);
                location.reload();
            } else if (data.status == "failed") {
                $("#login-alert").html(data.message);
                $("#login-alert").css("display","block");
                $("#login-alert").fadeTo(2000, 500).slideUp(500, function(){
                    $("#login-alert").slideUp(500);
                });
            }

        },
        error: function(result){
            console.log(result);
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
            if (data.status == "success") {
                $("#loginModal").modal('hide');
                location.reload();
            } else if (data.status == "failed") {
                $("#register-alert").html(data.message);
                $("#register-alert").css("display","block");
                $("#register-alert").fadeTo(2000, 500).slideUp(500, function(){
                    $("#register-alert").slideUp(500);
                });
            }
        },
        error: function(result){
            console.log(result);
        }
    });
    e.preventDefault();
});