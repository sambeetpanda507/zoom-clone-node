const { v4: uuidv4 } = require("uuid");

module.exports.getHome = (req, res, next) => {
    res.redirect(`/${uuidv4()}`);
};

module.exports.getRoom = (req, res, next) => {
    const roomId = req.params.roomId;
    res.render("room", {
        title: "zoom-clone-node",
        roomId: roomId,
    });
};
