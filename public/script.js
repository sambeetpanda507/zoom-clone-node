const socket = io("/");

let name;
do {
    name = prompt("Enter your username");
} while (!name);

const msg = document.getElementById("msg");

const sendBtn = document.getElementById("sendBtn");

let chatBox = document.querySelector(".chat__box");

msg.addEventListener("keyup", (e) => {
    if (e.key === "Enter" && e.target.value.length > 0) {
        sendMessage(e.target.value);
    }
});

sendBtn.addEventListener("click", (e) => {
    if (msg.value.length > 0) {
        sendMessage(msg.value);
    }
});

const sendMessage = (message) => {
    let msg = {
        user: name,
        message: message.trim(),
    };
    appendMessage(msg, "outgoing");
    socket.emit("message", msg, roomId);
};

const appendMessage = (message, type) => {
    let mainDiv = document.createElement("div");
    let className = type;
    mainDiv.classList.add(className, "message");

    let markUp = `
    <h5>${message.user}</h5>
    <p>${message.message}</p>
    `;
    mainDiv.innerHTML = markUp;

    chatBox.appendChild(mainDiv);
};

socket.on("message", (msg) => {
    appendMessage(msg, "incoming");
});

const myVideoElement = document.getElementById("my-video");

const myVideo = document.createElement("video");

myVideo.muted = true;

const peer = new Peer(undefined, {
    path: "/peerjs",
    host: "/",
    port: "443", //443
});

let myVideoStream;

navigator.mediaDevices
    .getUserMedia({
        video: true,
        audio: true,
    })
    .then((stream) => {
        myVideoStream = stream;
        addVideoStream(myVideo, stream);

        peer.on("call", (call) => {
            call.answer(stream);
            const video = document.createElement("video");
            call.on("stream", (userVideoStream) => {
                addVideoStream(video, userVideoStream);
            });
        });

        socket.on("user-connected", (userId) => {
            connectToNewUser(userId, stream);
        });
    });

peer.on("open", (id) => {
    socket.emit("join", roomId, id);
});

const connectToNewUser = (userId, stream) => {
    const call = peer.call(userId, stream);
    const video = document.createElement("video");
    call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
    });
};

const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
        video.play();
    });
    myVideoElement.append(video);
};
