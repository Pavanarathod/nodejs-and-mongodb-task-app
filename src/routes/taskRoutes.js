const express = require("express");
const authentication = require("../middleware/authMiddleware");
const router = express.Router();
const Task = require("../models/taskModel");

router.post("/", authentication, async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      owner: req.user._id,
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/", authentication, async (req, res) => {
  const match = {};
  const sort = {};

  if (req.query.complete) {
    match.complete = req.query.complete === "true";
  }
  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }
  try {
    // const task = await Task.find({ owner: req.user._id });
    await req.user
      .populate({
        path: "tasks",
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort,
        },
      })
      .execPopulate();
    res.send(req.user.tasks);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/:id", authentication, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findOne({ _id, owner: req.user._id });
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.patch("/:id", authentication, async (req, res) => {
  const _id = req.params.id;
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "complete"];
  const isValid = updates.every((update) => allowedUpdates.includes(update));

  if (!isValid) return res.status(500).send({ error: "Invalid update" });

  try {
    const updateTask = await Task.findOne({ _id, owner: req.user._id });
    if (!updateTask) return res.status(404).send();

    updates.forEach((update) => (updateTask[update] = req.body[update]));
    await updateTask.save();

    res.send(updateTask);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.delete("/:id", authentication, async (req, res) => {
  const _id = req.params.id;
  try {
    // const task = await Task.findByIdAndDelete(req.params.id);
    const task = await Task.findOneAndDelete({ _id, owner: req.user._id });
    console.log(req.user);
    console.log(task);
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
