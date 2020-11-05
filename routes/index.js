const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const Handlers = require("../handlers");

router.get("/", function(req, res) {
  res.json({ status: "OK" });
});

router.post("/sms/reply", Handlers.twilio.smsReply);
router.post("/verify", Handlers.twilio.verify);
router.post("/confirm", Handlers.twilio.confirm);

router.get("/logs", Handlers.logs.list);
router.post("/logs", Handlers.logs.create);

router.post("/users", Handlers.users.create);
router.get("/users", Handlers.users.fetch);

module.exports = router;
