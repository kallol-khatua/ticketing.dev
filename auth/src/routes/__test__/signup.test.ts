import request from 'supertest';
import { app } from "../../app";

describe("User signup", () => {
    it("returns a 201 on successful signup", async () => {
        return request(app)
            .post("/v1/api/user/signup")
            .send({
                email: "kallolkhatua2005@gmail.com",
                password: "Kallol@2005"
            })
            .expect(201)
            .then((response) => {
                expect(response.body.success).toEqual(true)
                expect(response.body.statusCode).toEqual(201)
                expect(response.body.message).toEqual("New user created")
            });
    }, 10000)

    it("returns 400 when email is missing", async () => {
        return request(app)
            .post("/v1/api/user/signup")
            .send({
                password: "Kallol@2005"
            })
            .expect(400);
    }, 10000)

    it("returns 400 when password is missing", async () => {
        return request(app)
            .post("/v1/api/user/signup")
            .send({
                email: "kallolkhatua2005@gmail.com"
            })
            .expect(400);
    }, 10000)

    it("returns 400 when email and password both missing", async () => {
        return request(app)
            .post("/v1/api/user/signup")
            .send({})
            .expect(400);
    }, 10000)

    // it("returns 400 for an invalid email format", async() => {
    //     return request(app)
    //         .post("/v1/api/user/signup")
    //         .send({
    //             email: "kallol",
    //             password: "Kallol@2005"
    //         })
    //         .expect(400);
    // })

    // it("returns 400 for a weak password", async() => {
    //     return request(app)
    //         .post("/v1/api/user/signup")
    //         .send({
    //             email: "kallolkhatua2005@gmail.com",
    //             password: "123"
    //         })
    //         .expect(400);
    // })

    it("returns 400 when a user with email already exist", async () => {
        await request(app)
            .post("/v1/api/user/signup")
            .send({
                email: "kallolkhatua2005@gmail.com",
                password: "Kallol@2005"
            })
            .expect(201); // First signup succeeds

        return request(app)
            .post("/v1/api/user/signup")
            .send({
                email: "kallolkhatua2005@gmail.com",
                password: "Kallol@246899"
            })
            .expect(400); // Second signup fails
    }, 15000)

    it("should sets a cookie after successfull signup", async () => {
        const response = await request(app)
            .post("/v1/api/user/signup")
            .send({
                email: "kallolkhatua2005@gmail.com",
                password: "Kallol@2005"
            })
            .expect(201);

        expect(response.get("Set-Cookie")).toBeDefined();
    }, 10000)
})