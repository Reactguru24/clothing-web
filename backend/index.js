const port = process.env.PORT || 4001;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

app.use(express.json());
app.use(cors());

// Database connection
mongoose.connect(
  "mongodb+srv://kelviwalanda:1pRsYZw2ayhRiLv7@cluster0.s7waf.mongodb.net/"
);

// Image storage
const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });
app.use("/images", express.static("upload/images"));

app.post("/upload", upload.single("product"), (req, res) => {
  res.json({
    success: 1,
    message: "Image uploaded successfully",
    image_url: `http://localhost:${port}/images/${req.file.filename}`,
  });
});

// Schema for creating product
const Product = mongoose.model("Product", {
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  new_price: {
    type: Number,
    required: true,
  },
  old_price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  available: {
    type: Boolean,
    default: true,
  },
  description: {
    type: String,
  },
  tag: {
    type: String,
  },
  brand: {
    type: String,
  },
  sizes: [String], // Handle an array of sizes
});

// Creating API for getting all products
app.get("/allproducts", async (req, res) => {
  let products = await Product.find({});
  res.send(products);
});

// Creating endpoint to get 4 random products
app.get("/relatedproducts", async (req, res) => {
  try {
    // Fetch all products
    let products = await Product.find({});

    // Check if there are at least 4 products
    if (products.length < 4) {
      return res.status(400).json({
        success: false,
        message: "Not enough products to choose from.",
      });
    }

    // Shuffle products array to get random products
    products = products.sort(() => Math.random() - 0.5);

    // Get the first 4 products from the shuffled array
    const randomProducts = products.slice(0, 4);

    res.json(randomProducts);
  } catch (error) {
    console.error("Error fetching related products:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch related products." });
  }
});

// Schema for user model
const User = mongoose.model("User", {
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  cartData: {
    type: Object,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Creating API endpoint for new collection
app.get("/newcollections", async (req, res) => {
  let products = await Product.find({});
  let newCollection = products.slice(1).slice(-8);
  res.send(newCollection);
});

// Creating endpoint for popular in women
app.get("/popularinwomen", async (req, res) => {
  let products = await Product.find({ category: "women" });
  let popular_in_women = products.slice(0, 4);
  res.send(popular_in_women);
});

// Middleware to fetch user
const fetchUser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res
      .status(401)
      .send({ errors: "Access denied. No token provided." });
  }
  try {
    const data = jwt.verify(token, "secret_ecom");
    req.user = data.user;
    next();
  } catch (error) {
    return res
      .status(401)
      .send({ errors: "Please authenticate with the right credentials" });
  }
};

// Middleware to check if the user is an admin
const fetchAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).send({ errors: "Access denied. Admins only." });
  }
  next();
};

// Creating endpoint for registering the user
app.post("/signup", async (req, res) => {
  let check = await User.findOne({ email: req.body.email });
  if (check) {
    return res.status(400).json({
      success: false,
      errors: "Existing user found with the same email address",
    });
  }

  let cart = {};
  for (let i = 0; i < 300; i++) {
    cart[i] = 0;
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const user = new User({
    name: req.body.username,
    email: req.body.email,
    password: hashedPassword, // Save hashed password
    cartData: cart,
  });

  await user.save();

  const data = {
    user: {
      id: user.id,
      isAdmin: user.isAdmin, // Include isAdmin status
    },
  };

  const token = jwt.sign(data, "secret_ecom");
  res.json({ success: true, token });
});

// Creating endpoint for logging in the user
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        errors: "User not found",
      });
    }

    // Compare provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        errors: "Invalid credentials",
      });
    }

    const data = {
      user: {
        id: user._id,
        name: user.name, // Include username
        isAdmin: user.isAdmin, // Include isAdmin status
      },
    };

    const token = jwt.sign(data, "secret_ecom");
    res.json({
      success: true,
      token,
      name: user.name, // Send username in the response
      isAdmin: user.isAdmin, // Send isAdmin status in the response
    });
  } catch (err) {
    res.status(500).json({ success: false, errors: "Server error" });
  }
});
// Creating endpoint to fetch the username of the logged-in user
app.get("/api/user", fetchUser, async (req, res) => {
  try {
    // Fetch the user data using the user ID from the token
    const user = await User.findById(req.user.id).select("name");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Send the username as a response
    res.json({ success: true, username: user.name });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Creating endpoint for logging out (client-side token invalidation)
app.post("/logout", (req, res) => {
  // Typically handled client-side by removing token
  res.json({ success: true, message: "Logged out successfully" });
});

// Creating endpoint for adding product to cartData
app.post("/addtocart", fetchUser, async (req, res) => {
  console.log("Request Body:", req.body); // Debugging line
  const itemId = req.body.itemId;

  if (!itemId) {
    return res
      .status(400)
      .json({ success: false, message: "Item ID is required." });
  }

  let userData = await User.findOne({ _id: req.user.id });

  if (userData.cartData[itemId] !== undefined) {
    userData.cartData[itemId] += 1;
  } else {
    userData.cartData[itemId] = 1;
  }

  console.log("User Data Before Update:", userData.cartData);

  const updateResult = await User.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData },
    { new: true } // Return the updated document
  );

  res.json({ success: true, message: "Item added to cart" });
});

// Creating endpoint to remove product from cartData
app.post("/removefromcart", fetchUser, async (req, res) => {
  console.log("removed", req.body);
  let userData = await User.findOne({ _id: req.user.id });
  if (userData.cartData[req.body.itemId] > 0) {
    userData.cartData[req.body.itemId] -= 1;
    await User.findOneAndUpdate(
      { _id: req.user.id },
      { cartData: userData.cartData }
    );
    res.send("Removed");
  } else {
    res.status(400).json({ success: false, message: "Item not in cart" });
  }
});

// Creating endpoint to get cartData
app.post("/getcart", fetchUser, async (req, res) => {
  let userData = await User.findOne({
    _id: req.user.id,
  });
  res.json(userData.cartData);
});

// Start the server
app.listen(port, (error) => {
  if (!error) {
    console.log(`Server is running on port ${port}`);
  } else {
    console.log("Error:" + error);
  }
});
