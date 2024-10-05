const express = require("express");
const app = express();
const Chat = require("./models/chat");
const mongoose = require('mongoose');
const path = require("path");
const methodOverride = require("method-override");

// Set up views and static assets
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Connect to MongoDB
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/whatapp');
    console.log("Connection is successful");
}

main().catch(err => console.log(err));

// Index route: Show all chats
app.get("/chats", async (req, res) => {
    try {
        let chats = await Chat.find();
        // console.log(chats);
        res.render("index", { chats });  // Renders index.ejs with chat data
    } catch (err) {
        console.log(err);
        res.status(500).send("Error retrieving chats.");
    }
});

// New route: Render form for new chat
app.get("/chats/new", (req, res) => {
    res.render("new");  // Render new.ejs to create a new chat message
});

// Create route: Save new chat
app.post("/chats", async (req, res) => {
    try {
        const { from, to, msg } = req.body;
        let newChat = new Chat({
            from,
            to,
            msg,
            created_at: new Date()
        });
        await newChat.save();  // Save the chat to the database
        console.log("Chat saved:", newChat);
        res.redirect("/chats");  // Redirect to the chats list
    } catch (err) {
        console.log(err);
        res.status(500).send("Error saving chat.");
    }
});

// Edit route: Render edit form for a specific chat
app.get("/chats/:id/edit", async (req, res) => {
    try {
        let { id } = req.params;
        let chat = await Chat.findById(id);
        if (!chat) {
            return res.status(404).send("Chat not found.");
        }
        res.render("edit", { chat });  // Render edit.ejs with chat data
    } catch (err) {
        console.log(err);
        res.status(500).send("Error retrieving chat for edit.");
    }
});
//update route
app.put("/chats/:id", async (req,res) => {
    let {id} = req.params;
    let { msg : newMsg} = req.body;
    let updatedChat = await Chat.findByIdAndUpdate(
        id,
        {
            msg:newMsg
        },
        { runValidators:true,new:true}
    );
    console.log( updatedChat);
    res.redirect("/chats")
});

// Root route
app.get("/", (req, res) => {
    res.send("Root is working");
});

//DESTROY
app.delete("/chats/:id", async (req, res) => {
    let { id } = req.params;
    let deletedChat = await Chat.findByIdAndDelete(id); // Correctly reference the Chat model
    res.redirect("/chats");
});
// Listen on port 8080
app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});
