"use strict";
var robot = require("robotjs"); // the robot for simulating key input
var WebSocketServer = require('websocket').server; // the WebSocketServer that we will listen with
var http = require('http');

var server = http.createServer();
server.listen(8080);

var wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

function originIsAllowed(origin) // for now, just accept them
{
    // TODO: implement origin checking
    return true;
}

wsServer.on('request',
    function(request)
    {
        if (!originIsAllowed(request.origin)) // reject connections from bad origins
        {
            request.reject();
            return;
        }

        var connection = request.accept('keyboard', request.origin);
        
        connection.on('message',
            function(message)
            {
                var dataIn = JSON.parse(message.utf8Data);
                console.log(dataIn);
                switch (dataIn.type)
                {
                    case "back":
                        for (var i = 0; i < dataIn.id; i++)
                            robot.keyTap("backspace");
                    break;
                    case "type":
                        robot.typeString(dataIn.id);
                    break;
                }
            });
    });