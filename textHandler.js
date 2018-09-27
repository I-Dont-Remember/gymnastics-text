


module.exports.smsHandler = async function(req, res) {
    console.log("Handling text!");
    res.status(200).send({ success: true });
}
