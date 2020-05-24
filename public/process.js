// import { type } from "os";

var socket = io("http://localhost:3000");

socket.on("server-send-register-fail", function() {
    alert("invalid username!!");
});
socket.on("server-send-success-register", function(data) {
    $("#currentUser").html(data);
    //$("#loginForm").hide(2);
    //$("#chatForm").show(500);
    //$("#sayHi").show(500);
});
socket.on("server-send-list-users-online", function(data) {
    $("#listUsersOnline").html("");
    var s = data[0].length;
    for (r = 0; r < s; r++) {
        $("#listUsersOnline").append("<div socketid='" + data[1][r] + "' class='UsersOnline'>" + data[0][r] + "</div>");
    }
});
socket.on("server-send-message", function(data) {
    var User = "<span class='User'>" + data.username + "</span>"
    var Message = "<span class='Message'>" + data.content + "</span>"
    $("#listMessage").append(User + ":" + Message + "<div class='block'></div>");
})
socket.on("server-send-click", function(data) {
    alert(data + "touched you");
});
socket.on("someone-is-texting", function(data) {
    $("#notice").html(data);
});
socket.on("someone-stoped-texting", function() {
    $("#notice").html("");
});
$(document).ready(function() {
    //$("#loginForm").show(2);
    $("#chatForm").hide(1);
    $("#sayHi").hide(1);
    $("#btnRegister").click(function() {
        var Userwishname = $("#txtUser").val();
        $("#txtUser").val('');
        socket.emit("client-send-username", Userwishname);
        $.ajax({
            method: 'post',
            contentType: 'application/json',
            url: '/',
            data: JSON.stringify({ username: Userwishname }),
            success: function(data) {
                if (data.status == 0) {
                    $("#loginForm").hide();
                    $("#chatForm").show();
                    $("#currentUser").text(Userwishname);
                    $("#sayHi").show();
                }
            }
        });
    });
    $('#txtUser').keypress(function(e) {
        if (e.which == 13) {
            $(this).blur();
            $('#btnRegister').focus().click();
        }
    });
    $("#btnMessage").click(function() {
        var Message = $("#txtMessage").val();
        $("#txtMessage").val('');
        socket.emit("client-send-message", Message);
    });
    $('#txtMessage').keypress(function(e) {
        if (e.which == 13) {
            $(this).blur();
            $('#btnMessage').focus().click();
        }
    });
    $(document).on("click", ".UsersOnline", function() {
        alert(1);
        var id = $(this).attr("socketid");
        socket.emit("user-click-another", id);
    });
    $("#txtMessage").focusin(function() {
        socket.emit("texting");
    });
    $("#txtMessage").focusout(function() {
        socket.emit("stop-texting");
    });
    $("#btnLogout").click(function() {
        socket.emit("logout");
        $("#loginForm").show(1);
        $("#chatForm").hide();
        $("#sayHi").hide();
    });

});