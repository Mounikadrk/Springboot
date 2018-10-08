var stompClient = null;

function setConnected(e) {
    $("#connect").prop("disabled", e), $("#disconnect").prop("disabled", !e)
}

function connect() {
    var e = new SockJS("/websocket-example");
    (stompClient = Stomp.over(e)).connect({}, function(e) {
        setConnected(!0), console.log("Connected: " + e), sendName(), stompClient.subscribe("/topic/user", function(e) {
            newUserAlert(JSON.parse(e.body).name)
        }), stompClient.subscribe("/topic/message", function(e) {
            var n = JSON.parse(e.body);
            showMessage(n.name, n.content, n.time)
        })
    })
}

function disconnect() {
    null !== stompClient && stompClient.disconnect(), setConnected(!1), $("#name").attr("disabled", !1), console.log("Disconnected")
}

function sendName() {
    stompClient.send("/app/user", {}, JSON.stringify({
        name: $("#name").val()
    })), $("#name").attr("disabled", !0)
}

function sendMessage() {
    stompClient.send("/app/message", {}, JSON.stringify({
        name: $("#name").val(),
        content: $("#message").val()
    })), $("#message").val("")
}

function newUserAlert(e) {
    $("#userinfo").append("<tr><td class='new-user-joined'>" + e + "</td></tr>")
}

function showMessage(e, n, s) {
    $("#userinfo").append("<tr><td><span class='name-info'>" + e + "</span> " + n + " <span class='time-info'>" + s + "</span></td ></tr > ")
}

function toogleMessageFeilds(e) {
    $("#send").attr("disabled", e), $("#message").attr("disabled", e)
}
$(function() {
    $("form").on("submit", function(e) {
        e.preventDefault()
    }), $(function() {
        $("#toggle-event").change(function() {
            $(this).prop("checked") ? connect() : disconnect(), toogleMessageFeilds(!$(this).prop("checked"))
        })
    }), $("#send").click(function() {
        sendMessage()
    })
});