import request from 'supertest';
import { app } from "../../app";

describe("User signup", () => {
    it("returns a 201 on successful signup", async () => {
        return request(app)
            .post("/v1/api/user/signup")
            .send({
                firstName: "Kallol",
                lastName: "Khatua",
                email: "kallolkhatua2005@gmail.com",
                password: "Kallol@2005"
            })
            .expect(201)
            .then((response) => {
                expect(response.body.success).toEqual(true)
                expect(response.body.statusCode).toEqual(201)
            });
    }, 10000)

    it("returns 400 when email is missing", async () => {
        return request(app)
            .post("/v1/api/user/signup")
            .send({
                firstName: "Kallol",
                lastName: "Khatua",
                password: "Kallol@2005"
            })
            .expect(400)
            .then((response) => {
                expect(response.body.success).toEqual(false)
                expect(response.body.statusCode).toEqual(400)
            });
    }, 10000)

    it("returns 400 when password is missing", async () => {
        return request(app)
            .post("/v1/api/user/signup")
            .send({
                firstName: "Kallol",
                lastName: "Khatua",
                email: "kallolkhatua2005@gmail.com",
            })
            .expect(400)
            .then((response) => {
                expect(response.body.success).toEqual(false)
                expect(response.body.statusCode).toEqual(400)
            });
    }, 10000)

    it("returns 400 when first name in missing", async () => {
        return request(app)
            .post("/v1/api/user/signup")
            .send({
                lastName: "Khatua",
                email: "kallolkhatua2005@gmail.com",
                password: "Kallol@2005"
            })
            .expect(400)
            .then((response) => {
                expect(response.body.success).toEqual(false)
                expect(response.body.statusCode).toEqual(400)
            });
    }, 10000)

    it("returns 400 when last name in missing", async () => {
        return request(app)
            .post("/v1/api/user/signup")
            .send({
                firstName: "Kallol",
                email: "kallolkhatua2005@gmail.com",
                password: "Kallol@2005"
            })
            .expect(400)
            .then((response) => {
                expect(response.body.success).toEqual(false)
                expect(response.body.statusCode).toEqual(400)
            });
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
                firstName: "Kallol",
                lastName: "Khatua",
                email: "kallolkhatua2005@gmail.com",
                password: "Kallol@2005"
            })
            .expect(201); // First signup succeeds

        return request(app)
            .post("/v1/api/user/signup")
            .send({
                firstName: "Kallol",
                lastName: "Khatua",
                email: "kallolkhatua2005@gmail.com",
                password: "Kallol@246899"
            })
            .expect(400); // Second signup fails
    }, 15000)
})