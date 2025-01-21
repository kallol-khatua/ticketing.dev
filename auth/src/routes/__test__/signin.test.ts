import request from 'supertest';
import { app } from "../../app";

describe("User signin", () => {
    it("returns 400 when email is missing", async () => {
        return request(app)
            .post("/v1/api/user/signin")
            .send({
                password: "Kallol@2005"
            })
            .expect(400);
    }, 10000)


    it("returns 400 when password is missing", async () => {
        return request(app)
            .post("/v1/api/user/signin")
            .send({
                email: "kallolkhatua2005@gmail.com"
            })
            .expect(400);
    }, 10000)


    it("returns 400 when a user with email does not exist", async () => {
        return request(app)
            .post("/v1/api/user/signin")
            .send({
                email: "kallolkhatua2005@gmail.com",
                password: "Kallol@2005"
            })
            .expect(400);
    }, 10000)


    it("returns 400 when wrong password is provided", async () => {
        // Step: 1 - Creating user account
        await request(app)
            .post("/v1/api/user/signup")
            .send({
                firstName: "Kallol",
                lastName: "Khatua",
                email: "kallolkhatua2005@gmail.com",
                password: "Kallol@2005"
            })
            .expect(201);


        // Step: 2 - Signin with wrong password 
        return request(app)
            .post("/v1/api/user/signin")
            .send({
                email: "kallolkhatua2005@gmail.com",
                password: "asGGjsj@45476"
            })
            .expect(400);
    }, 15000)


    it("returns 200 and return a token after signin", async () => {
        // Step: 1 - Creating user account
        await request(app)
            .post("/v1/api/user/signup")
            .send({
                firstName: "Kallol",
                lastName: "Khatua",
                email: "kallolkhatua2005@gmail.com",
                password: "Kallol@2005"
            })
            .expect(201);

        // Step: 2 - Signin with valid credentials
        return request(app)
            .post("/v1/api/user/signin")
            .send({
                email: "kallolkhatua2005@gmail.com",
                password: "Kallol@2005"
            })
            .expect(200)
            .then((response) => {
                expect(response.body.statusCode).toEqual(200)
                expect(response.body.success).toEqual(true)
                expect(response.body.token).toBeDefined()
            });

    }, 25000)
})