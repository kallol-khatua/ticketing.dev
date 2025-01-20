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

    it("returns 400 when email and password both are missing", async () => {
        return request(app)
            .post("/v1/api/user/signin")
            .send({})
            .expect(400);
    }, 10000)

    // it("returns 400 for an invalid email format", async() => {
    //     return request(app)
    //         .post("/v1/api/user/signin")
    //         .send({
    //             email: "kallol",
    //             password: "Kallol@2005"
    //         })
    //         .expect(400);
    // })

    // it("returns 400 for a weak password", async() => {
    //     return request(app)
    //         .post("/v1/api/user/signin")
    //         .send({
    //             email: "kallolkhatua2005@gmail.com",
    //             password: "123"
    //         })
    //         .expect(400);
    // })

    it("returns 400 when a user with email does not exist", async () => {
        return request(app)
            .post("/v1/api/user/signin")
            .send({
                email: "kallolkhatua2005@gmail.com",
                password: "Kallol@2005"
            })
            .expect(400); // Second signup fails
    }, 10000)

    it("returns 400 when wrong password is provided", async () => {
        await request(app)
            .post("/v1/api/user/signup")
            .send({
                email: "kallolkhatua2005@gmail.com",
                password: "Kallol@2005"
            })
            .expect(201);

        return request(app)
            .post("/v1/api/user/signin")
            .send({
                email: "kallolkhatua2005@gmail.com",
                password: "asGGjsj@45476"
            })
            .expect(400);
    }, 15000)

    it("returns 200 and sets a cookie after signin", async () => {
        await request(app)
            .post("/v1/api/user/signup")
            .send({
                email: "kallolkhatua2005@gmail.com",
                password: "Kallol@2005"
            })
            .expect(201);

        const response = await request(app)
            .post("/v1/api/user/signin")
            .send({
                email: "kallolkhatua2005@gmail.com",
                password: "Kallol@2005"
            })
            .expect(200);

        expect(response.get("Set-Cookie")).toBeDefined();
    }, 20000)
})