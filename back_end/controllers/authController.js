exports.test = (req, res) => {
    res.status(200).json({
        success: true,
        message: "Auth controller is working!"
    });
};