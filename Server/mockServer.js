
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Simple in-memory store
let users = [
  { _id: "u1", fullName: "Alice", profilePic: "", password: "pass" },
  { _id: "u2", fullName: "Bob", profilePic: "", password: "pass" },
  { _id: "u3", fullName: "Charlie", profilePic: "", password: "pass" },
];
let messages = {
  "u1": [{ from: "u1", to: "me", text: "Hello from Alice", _id: "m1", createdAt: new Date() }],
  "u2": [{ from: "u2", to: "me", text: "Hey from Bob", _id: "m2", createdAt: new Date() }],
  "u3": []
};

function getUserFromToken(req) {
  // token is user id for mock
  const token = req.headers["token"];
  if (!token) return null;
  if (token === "token-me") return { _id: "me", fullName: "You", profilePic: "" };
  const u = users.find(x => x._id === token);
  return u ? { _id: u._id, fullName: u.fullName } : null;
}

// Auth routes
app.get("/api/auth/check", (req, res) => {
  const user = getUserFromToken(req);
  if (!user) return res.json({ success: false });
  return res.json({ success: true, user });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body || {};
  // simple login: accept any email and password, return token "token-me"
  const user = { _id: "me", fullName: "You", profilePic: "" };
  return res.json({ success: true, token: "token-me", user });
});

app.put("/api/auth/update", (req, res) => {
  const user = getUserFromToken(req);
  if (!user) return res.json({ success: false, message: "Not auth" });
  // pretend update
  return res.json({ success: true, user: { ...user, ...req.body } });
});

// Messages routes
app.get("/api/messages/users", (req, res) => {
  const user = getUserFromToken(req);
  if (!user) return res.json({ success: false, message: "Not auth" });
  // return all users except 'me'
  const list = users.map(u => ({ ...u })).filter(u => u._id !== "me");
  // compute unseen counts
  const unseen = {};
  for (const u of list) unseen[u._id] = (messages[u._id] || []).length;
  return res.json({ success: true, users: list, unseenMessages: unseen });
});

app.get("/api/messages/:id", (req, res) => {
  const id = req.params.id;
  const msgs = messages[id] || [];
  return res.json({ success: true, messages: msgs });
});

app.post("/api/messages/send", (req, res) => {
  const { to, text } = req.body;
  if (!to || !text) return res.json({ success: false, message: "Missing fields" });
  const msg = { from: "me", to, text, _id: "m" + (Math.random()*100000|0), createdAt: new Date() };
  // push into recipient's messages 'from' field so they see
  messages[to] = messages[to] || [];
  messages[to].push(msg);
  return res.json({ success: true, message: msg });
});

app.post("/api/messages/mark-seen/:id", (req, res) => {
  const id = req.params.id;
  // clear messages for that user
  messages[id] = [];
  return res.json({ success: true });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log("Mock server running on port", port));
