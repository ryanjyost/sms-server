const db = require("../db");
const { v4: uuid } = require("uuid");
const aws = require("aws-sdk");

aws.config.update({
  region: process.env.AWSRegion,
  accessKeyId: process.env.AWSAccessKeyId,
  secretAccessKey: process.env.AWSSecretKey
});

const s3 = new aws.S3();

async function list(req, res) {
  const { query } = req;

  const user = await db
    .knex("users")
    .select("*")
    .where(query)
    .first();

  if (!user) {
    return res.status(401).json({ error: "User not found" });
  }

  const logs = await db
    .knex("logs")
    .select("*")
    .where({ user_id: user.id })
    .orderBy("created", "desc");

  const logsWithAttachmentUrls = logs.map(log => {
    let url;
    if (log.attachment) {
      const params = {
        Bucket: process.env.LifelogsImagesBucket,
        Key: `${user.id}/${log.attachment}`
      };

      url = s3.getSignedUrl("getObject", params);
    }

    return { ...log, attachmentUrl: url };
  });

  res.status(200).json(logsWithAttachmentUrls);
}

async function create(req, res) {
  const { body, files } = req;
  const attachment = files && files.attachment;
  const { user: userId, text, fileType } = body;

  const fileName = uuid();
  const attachmentKey = `${userId}/${fileName}`;
  if (attachment) {
    const params = {
      Bucket: process.env.LifelogsImagesBucket,
      Key: attachmentKey,
      Body: attachment.data,
      ContentType: fileType,
      Expires: 60 * 60
    };

    try {
      await s3.upload(params, {}).promise();
    } catch (e) {
      return res.status(400).json({ error: "Failed to upload attachment." });
    }
  }

  let user = await db
    .knex("users")
    .select("*")
    .where({ id: userId });

  user = user[0];

  if (!user) {
    return res.status(401).json({ error: "User not found" });
  }

  const log = await db
    .knex("logs")
    .returning(["id", "user_id", "text", "created"])
    .insert({
      id: uuid(),
      text,
      user_id: user.id,
      attachment: attachment ? fileName : null
    });

  return res.status(200).json(log[0]);
}

module.exports = {
  list,
  create
};
