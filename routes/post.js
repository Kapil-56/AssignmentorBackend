const express = require("express");
const router = express.Router();
const { default: mongoose } = require("mongoose");
const fetchuser = require("../middleware/fetchuser");
const Post = mongoose.model("post");
const csrf = require("csurf");
const csrfProtection = csrf({ cookie: true });

router.post("/createpost", fetchuser, csrfProtection, async (req, res) => {
  const { title, body, pic, subject, price, address, deadline } = req.body;
  console.log(title, body, pic, subject, address);

  if (!title || !body || !pic || !subject || !price || !address || !deadline) {
    return res.status(422).json({ error: "Please fill the required fields" });
  }

  req.user.password = undefined;
  const post = new Post({
    title,
    body,
    photo: pic,
    subject,
    price,
    address,
    deadline,
    postedBy: req.user,
  });

  try {
    const response = await post.save();
    res.json({ post: response });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Unable to create post" });
  }
});

router.get("/allpost", (req, res) => {
  // Retrieve page and perPage values from query parameters
  const page = req.query.page ? parseInt(req.query.page) : 1;
  const perPage = req.query.per_page ? parseInt(req.query.per_page) : 8;

  // Build the filter object based on the address query parameter
  const filter = {};
  if (req.query.address) {
    filter.address = req.query.address;
  }

  // Count total number of documents that match the filter
  Post.countDocuments(filter)
    .then((totalPosts) => {
      // Find posts that match the filter and populate postedBy field
      Post.find(filter)
        .populate("postedBy", "_id name")
        .skip((page - 1) * perPage)
        .limit(perPage)
        .then((posts) => {
          // Calculate total number of pages
          const totalPages = Math.ceil(totalPosts / perPage);
          res.json({
            totalPosts,
            totalPages,
            page,
            perPage,
            posts,
          });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
});

router.get("/mypost", fetchuser, (req, res) => {
  Post.find({ postedBy: req.user._id })
    .populate("postedBy", "_id name date")
    .then((mypost) => {
      res.json({ mypost });
    })
    .catch((err) => console.log(err));
});

router.put("/like", fetchuser, csrfProtection, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { likes: req.user._id },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({ err });
    } else {
      res.json(result);
    }
  });
});

router.put("/unlike", fetchuser, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({ err });
    } else {
      res.json(result);
    }
  });
});

router.get("/posts/:id", async (req, res) => {
  const postId = req.params.id;
  // Check if the ID is a valid ObjectId
  if (!mongoose.isValidObjectId(postId)) {
    return res.status(404).json({ error: "Invalid post ID" });
  }

  try {
    const post = await Post.findById(postId).populate(
      "postedBy",
      "-password -email"
    );
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json({ post }.post);
  } catch (error) {
    return res.status(500).json({ error });
  }
});

//fetch favourites
router.get("/likedposts", fetchuser, (req, res) => {
  Post.find({ likes: req.user._id })
    .populate("postedBy", "_id name date")
    .then((posts) => {
      res.json({ posts });
    })
    .catch((err) => console.log(err));
});

module.exports = router;
