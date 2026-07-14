exports.errorHandler = (err, req, res, next) => {

    console.error("========== BACKEND ERROR ==========");
    console.error(err);
    console.error("Message:", err.message);
    console.error("Stack:", err.stack);
    console.error("===================================");

    if (res.headersSent) {
        return next(err);
    }

    return res.status(500).json({
        success: false,
        message: err.message
    });

};