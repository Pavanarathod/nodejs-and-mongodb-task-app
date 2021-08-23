// @ts-nocheck
const express = require("express");
const authentication = require("../middleware/authMiddleware");
const router = express.Router();
const User = require("../models/userModel");
const multer = require("multer");
const {
  sendWelcomeEmailsEmails,
  sendDeleteNotification,
} = require("../emails/Account");

// ** CREATING AND UPDATING USER MODEL  */

router.post("/", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    const token = await user.genAuthToken();
    sendWelcomeEmailsEmails(user.email, user.name);
    res.send({ user, token });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/me", authentication, async (req, res) => {
  res.send(req.user.getPublicProfile());
});

router.patch("/me/update", authentication, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password"];
  const isValid = updates.every((update) => allowedUpdates.includes(update));

  if (!isValid) return res.status(400).send({ error: "Invalid Updates" });

  try {
    updates.forEach((update) => {
      req.user[update] = req.body[update];
    });

    await req.user.save();
    res.json(req.user);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.delete("/me/delete", authentication, async (req, res) => {
  try {
    // const user = await User.findByIdAndDelete(req.user._id);
    // if (!user) return res.status(404).send();
    sendDeleteNotification(req.user.email, req.user.name);
    await req.user.remove();
    res.send(req.user);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//** LOGIN FUNCTIONALITY FOR USER  */

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findByEmailAndPassword(email, password);
    const token = await user.genAuthToken();

    res.send({ user: user.getPublicProfile(), token });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post("/logout", authentication, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );

    await req.user.save();

    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

router.post("/logoutAll", authentication, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

//** UPLOADING PROILE PICTURES...AND HANDLES MEDIA */

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, callback) {
    // callback(new Error("File Must be a PDF"));

    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return callback(new Error("Please Upload An Image"));
    }

    callback(undefined, true);
  },
});

router.post(
  "/me/avatar",
  authentication,
  upload.single("avatar"),
  async (req, res) => {
    req.user.avatar = req.file.buffer;
    await req.user.save();
    res.send("Successfuly Uploaded Image");
  },
  (err, req, res, next) => {
    res.status(400).send({ error: err.message });
  }
);

router.delete("/me/avatar", authentication, async (req, res) => {
  try {
    req.user.avatar = undefined;

    await req.user.save();

    res.send(req.user);
  } catch (error) {
    res.status(500).send();
  }
});

router.get("/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) return res.status(404).send();
    res.set("Content-Type", "image/jpg");
    res.send(user.avatar);
  } catch (error) {
    res.status(404).send();
  }
});

module.exports = router;
