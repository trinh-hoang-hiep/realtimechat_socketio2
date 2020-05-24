var express = require("express");
var app = express();
app.use(express.static("./public"));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", "./views");

var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(3000);

var arrayUsersOnline = [];
var arrayUserName = [];
var arrayUserID = [];

io.on("connection", function(socket) {
    console.log(socket.id + " is connected!");
    socket.on("client-send-username", function(data) {
        if (arrayUserName.indexOf(data) >= 0) {
            socket.emit("server-send-register-fail");
        } else {
            socket.Username = data;
            arrayUserName.push(data);
            arrayUserID.push(socket.id);
            arrayUsersOnline[0] = arrayUserName;
            arrayUsersOnline[1] = arrayUserID;
            console.log(arrayUsersOnline);
            socket.emit("server-send-success-register", data);
            io.sockets.emit("server-send-list-users-online", arrayUsersOnline);
        }
    });
    socket.on("client-send-message", function(data) {
        //console.log(data);
        io.sockets.emit("server-send-message", { username: socket.Username, content: data });
    });
    socket.on("user-click-another", function(data) {
        io.to(data).emit("server-send-click", socket.Username);
    });
    socket.on("texting", function() {
        var s = socket.Username + " is texting";
        socket.broadcast.emit("someone-is-texting", s);
    });
    socket.on("stop-texting", function() {
        socket.broadcast.emit("someone-stoped-texting");
    });
    socket.on("logout", function() {
        arrayUserName.splice(
            arrayUserName.indexOf(socket.Username), 1
        );
        arrayUserID.splice(
            arrayUserID.indexOf(socket.id), 1
        );
        arrayUsersOnline[0] = arrayUserName;
        arrayUsersOnline[1] = arrayUserID;
        console.log(arrayUsersOnline);
        socket.broadcast.emit("server-send-list-users-online", arrayUsersOnline);
    });
    socket.on("disconnect", function() {
        arrayUserName.splice(
            arrayUserName.indexOf(socket.Username), 1
        );
        arrayUserID.splice(
            arrayUserID.indexOf(socket.id), 1
        );
        arrayUsersOnline[0] = arrayUserName;
        arrayUsersOnline[1] = arrayUserID;
        console.log(arrayUsersOnline);
        socket.broadcast.emit("server-send-list-users-online", arrayUsersOnline);
    })

});

app.get("/", function(req, res) {
    res.render("mainpage.ejs");
});

app.post("/", function(req, res) {
    console.log(req.body);
    res.send({ status: '0', statusMessage: 'login success' })
});