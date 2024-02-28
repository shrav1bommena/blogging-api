const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const app = express();

app.use(express.json());

const dbPath = path.join(__dirname, "blogging.db");

let database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server running at http://localhost:3000/");
    });
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

// USERS

// create a User

app.post("/users", async (request, response) => {
  const { username, email } = request.body;
  //checking whether there is already a user based on the username or email
  const selectUserQuery = `SELECT * FROM user WHERE username = ${username} OR email = ${email}; `;
  const dbUser = await database.get(selectUserQuery);
  // if user is not defined
  if (dbUser === undefined) {
    const createUserQuery = `INSERT INTO USER (username, email) VALUES(${username}, ${email});`;
    await database.run(createUserQuery);
    response.send("User created successfully");
  }
  // if user already in the database
  else {
    response.status(400);
    response.send("User already exists");
  }
});

// get all users

app.get("/users", async (request, response) => {
  const getAllUsersQuery = "SELECT * FROM user;";
  const allUsers = await database.all(getAllUsersQuery);
  response.send(allUsers);
});

// modify a User details like name and email
// this needs authentication

app.post("/users/:userId", async (request, response) => {
  const { email } = request.body;
  const username = request.userId;
  const updateUserEmailQuery = `UPDATE user SET email = ${email} WHERE username=${username};`;
  await database.run(updateUserEmailQuery);
  response.send("Updated email successfully");
});

// delete a user
// this needs authentication

app.delete("/users/:userId", async (request, response) => {
  const { userId } = request.params;
  const deleteUserQuery = `DELETE FROM user WHERE username=${userId};`;
  await database.run(deleteUserQuery);
  response.send("Deleted user successfully");
});

// BLOGS

// create a blog
// this needs authentication as who is creating it

app.post("/blogs", async (request, response) => {
  const { title, content, username } = request.body;
  const createBlogQuery = `INSERT INTO blog (title, content, username) VALUES (${title}, ${content}, ${username});`;
  await databaase.run(createBlogQuery);
  response.send("Created a blog successfully");
});

// get all blogs

app.get("/blogs", async (request, response) => {
  const getAllBlogsQuery = `SELECT * FROM blog;`;
  const allBlogs = await database.all(getAllBlogsQuery);
  response.send(allBlogs);
});

// get blogs of a user

app.get("/users/:userId/blogs", async (request, response) => {
  const { userId } = request.params;
  const getUserBlogs = `SELECT * FROM blog WHERE username LIKE ${userId};`;
  const allUserBlogs = await database.all(getUserBlogs);
  response.send(allUserBlogs);
});

// updating a blog content

app.post("/blogs/:blogId", async (request, response) => {
  const { blogId } = request.params;
  const { content } = request.body;
  const updateBlogQuery = `UPDATE blog SET content=${content} WHERE blog_id = ${blogId} `;
  await database.run(updateBlogQuery);
  response.send("Updated a blog successfully");
});

// delete a blog

app.delete("/blogs/:blogId", async (request, response) => {
  const { blogId } = request.params;
  const deleteBlogQuery = `DELETE FROM blog WHERE blog_id = ${blogId}`;
  await database.run(deleteBlogQuery);
  response.send("Deleted a blog successfully");
});

// COMMENTS

// create a comment
// this needs authentication as who is creating it

app.post("/blogs/:blogId/comments", async (request, response) => {
  const { comment, userId } = request.body;
  const { blogId } = request.params;
  const createCommentQuery = `INSERT INTO comment (comment, blog_id, username) VALUES (${comment}, ${blogId}, ${userId});`;
  await databaase.run(createCommentQuery);
  response.send("Created a comment successfully");
});

// get all comments for a blog

app.get("/blogs/:blogId/comments", async (request, response) => {
  const { blogId } = request.params;
  console.log(blogId);
  const getAllCommentsQuery = `SELECT * FROM comment WHERE blog_id = ${blogId};`;
  const allComments = await database.all(getAllCommentsQuery);
  response.send(allComments);
});

// get all comments of a user

app.get("/users/:userId/comments", async (request, response) => {
  const { userId } = request.params;
  const getAllUserCommentsQuery = `SELECT * FROM comment WHERE username LIKE ${userId};`;
  const allComments = await database.all(getAllUserCommentsQuery);
  response.send(allComments);
});

// updating a comment by it's id

app.post("/comments/:commentId", async (request, response) => {
  const { commentId } = request.params;
  const { comment } = request.body;
  const updateCommentQuery = `UPDATE comment SET content=${comment} WHERE comment_id = ${commentId} `;
  await database.run(updateCommentQuery);
  response.send("Updated a Comment successfully");
});

// delete a comment by it's id

app.delete("/comments/:commentId", async (request, response) => {
  const { commentId } = request.params;
  const deleteCommentQuery = `DELETE FROM comment WHERE comment_id = ${commentId}`;
  await database.run(deleteCommentQuery);
  response.send("Deleted a comment successfully");
});
