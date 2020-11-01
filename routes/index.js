const express = require("express");
const router = express.Router();
const Handlers = require("../handlers");

router.get("/", function(req, res) {
  res.json({ status: "OK" });
});

router.post("/sms/reply", Handlers.twilio.smsReply);

router.get("/logs", Handlers.logs.list);
router.post("/logs", Handlers.logs.create);

router.post("/users", Handlers.users.create);
router.get("/users", Handlers.users.fetch);

module.exports = router;

// router.post("/verify", function(req, res) {
//   client.verify
//     .services(process.env.TwilioVerifySid)
//     .verifications.create({ to: req.body.phone, channel: "sms" })
//     .then(verification => {
//       res.json({ status: "OK" });
//     })
//     .catch(e => res.json({ status: "error" }));
// });
