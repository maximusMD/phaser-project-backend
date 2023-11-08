const app = require("../app.js");
const request = require("supertest");
const { connectToDB, closeDBConnection } = require("../connection.js");

let client, db;

beforeAll(async () => {
  const connection = await connectToDB();
  client = connection.client;
  db = connection.db;

  await db.collection("users").deleteMany({});

  // Seed at least 3 users
  const usersToInsert = [
    {
      user: {
        avatar: "user1.jpg",
        username: "user1",
        password: "pass1",
        highScore: 100,
        progress: 1,
        other_default_props: ["weapon1", "weapon2"],
      },
    },
    {
      user: {
        avatar: "user2.jpg",
        username: "user2",
        password: "pass2",
        highScore: 200,
        progress: 1,
        other_default_props: ["weapon3", "weapon4"],
      },
    },
    {
      user: {
        avatar: "user3.jpg",
        username: "user3",
        password: "pass3",
        highScore: 300,
        progress: 1,
        other_default_props: ["weapon5", "weapon6"],
      },
    },
  ];

  await db.collection("users").insertMany(usersToInsert);
});
afterAll(async () => {
  await closeDBConnection(client);
});
describe("/api/users", () => {
  test("POST:201 post a new user and send it back to the client", async () => {
    const user = {
      avatar: "user.jpg",
      username: "user123",
      password: "pass123",
      highScore: 123,
      progress: 1,
      other_default_props: ["weapon1, weapon2"],
    };
    const response = await request(app).post("/api/users").send(user);
    expect(response.status).toBe(201);
    expect(response.body.user.avatar).toBe("user.jpg");
    expect(response.body.user.username).toBe("user123");
    expect(response.body.user.highScore).toBe(123);
    expect(response.body.user.other_default_props).toEqual([
      "weapon1, weapon2",
    ]);
  });

  test("GET:400 sends an appropriate status and error message if user already exists", async () => {
    const user = {
      username: "user123",
      password: "pass123",
    };
    const response = await request(app).post("/api/users").send(user);
    expect(response.body.status).toBe(400);
    expect(response.body.message).toBe("Bad request");
  });

  test("GET:200 when checking user details in login form", async () => {
    const user = {
      username: "user123",
      password: "pass123",
    };
    const response = await request(app).post("/api/users/login").send(user);
    expect(response.status).toBe(200);
    expect(response.body.user[0].user).toMatchObject({
      username: expect.any(String),
      password: expect.any(String),
    });
  });

  test("PATCH:200 update users highscore", async () => {
    const score = { highScore: 888 };
    const response = await request(app).patch("/api/users/user123").send(score);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("user updated");
  });

  test("PATCH:200 update users highscore", async () => {
    const update = { avatar: "user3.jpg" };
    const response = await request(app)
      .patch("/api/users/user123")
      .send(update);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("user updated");
  });

  test("GET:200 returns all users in array in correct format", async () => {
    const response = await request(app).get("/api/users");
    expect(response.status).toBe(200);
    expect(response.body.users.length).toBe(4);
    expect(response.body.users).toBeInstanceOf(Array);
  });
  test("GET:200 returns single user", async () => {
    const response = await request(app).get("/api/users/user3");
    expect(response.status).toBe(200);
    expect(response.body.user.username).toBe("user3");
  });
  test("Handles errors", async () => {
    const response = await request(app).get("/api/users/not-a-valid-username");
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("User not found");
  });
  test("GET: 200, return array of leaderboards", async () => {
    const response = await request(app).get("/api/leaderboard");
    expect(response.body).toBeInstanceOf(Array);
    response.body.forEach((entry) => {
      expect(entry.user).toHaveProperty("highScore");
      expect(entry.user).toHaveProperty("username");
      expect(entry.user).toHaveProperty("avatar");
    });
  });
});
