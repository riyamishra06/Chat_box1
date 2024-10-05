const mongoose = require('mongoose');

// Connect to the MongoDB database
main()
  .then(() => {
    console.log("Connection is successful");
  })
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/whatapp');
}

// Define a schema for the chats
const chatSchema = new mongoose.Schema({
  from: String,
  to: String,
  msg: String,
  created_at: { type: Date, default: Date.now }
});

// Create a model based on the schema
const Chat = mongoose.model('Chat', chatSchema);

// Sample chat data
let allChats = [
  {
    from: "neha",
    to: "priya",
    msg: "send me your exam sheet",
    created_at: new Date()
  },
  {
    from: "rohit",
    to: "akash",
    msg: "let's meet tomorrow",
    created_at: new Date()
  },
  {
    from: "priya",
    to: "neha",
    msg: "I'll send it soon",
    created_at: new Date()
  },
  {
    from: "akash",
    to: "rohit",
    msg: "sure, see you then",
    created_at: new Date()
  },
  {
    from: "neha",
    to: "rohit",
    msg: "how's the project going?",
    created_at: new Date()
  }
];

// Insert the chat data into the database
Chat.insertMany(allChats)
  .then(() => {
    console.log("Chats inserted successfully");
  })
  .catch(err => console.log(err));
