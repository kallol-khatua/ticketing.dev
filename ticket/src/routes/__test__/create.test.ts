import request from 'supertest';
import { app } from "../../app";

const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjc3N2U1MWY1MDExZWNmZWE1M2E0NjVhIiwidXNlcl9lbWFpbCI6ImthbGxvbGtoYXR1YTIwMDVAZ21haWwuY29tIiwiaWF0IjoxNzM1OTE1NjIwLCJleHAiOjE0Njk1OTE3NzU4fQ.Bx-WILlmMr3D7thQJS03Ck1XEvXkXoj3yzWTPAYCpBA'

describe("Ticket creation", () => {
    it("should returns 401 if authorization header not present", async () => {
        return request(app)
            .post("/v1/api/tickets/create")
            .expect(401)
    }, 10000)


    it("should returns 401 if authorization header not start with 'Bearer '", async () => {
        return request(app)
            .post("/v1/api/tickets/create")
            .set('Authorization', `auth-header-token`)
            .expect(401)
    }, 10000)


    it("should returns 401 if token not present in authorization header", async () => {
        return request(app)
            .post("/v1/api/tickets/create")
            .set('Authorization', `Bearer `)
            .expect(401)
    }, 10000)


    it("should returns 403 if an expired token provided in Authorization header", async () => {
        const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjc3N2U1MWY1MDExZWNmZWE1M2E0NjVhIiwidXNlcl9lbWFpbCI6ImthbGxvbGtoYXR1YTIwMDVAZ21haWwuY29tIiwiaWF0IjoxNzM1OTE1NjIwLCJleHAiOjE3MzU5MTU2ODB9.o4PQ5f7oM7FuzyGMxq1P_1UUy0YstrtpCwhQAaFnJsg'

        return request(app)
            .post("/v1/api/tickets/create")
            .set('Authorization', `Bearer ${expiredToken}`)
            .expect(403)
    }, 12000)


    it("should returns 403 if an invalid token provided in Authorization header", async () => {
        const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjc3N2U1MWY1MDExZWNmZWE1M2E0NjVhIiwidXNlcl9lbWFpbCI6ImthbGxvbGtoYXR1YTIwMDVAZ21haWwuY29tIiwiaWF0IjoxNzM1OTE1NjIwfQ.lBQ-wqgRwmctfjCmEClI5tlaKHbl214pDx5AvDWV8Ts'

        return request(app)
            .post("/v1/api/tickets/create")
            .set('Authorization', `Bearer ${invalidToken}`)
            .expect(403)
    }, 12000)


    it("should returns 400 if title is not present or length is zero after trim", async () => {
        // Title not present
        await request(app)
            .post("/v1/api/tickets/create")
            .set('Authorization', `Bearer ${validToken}`)
            .send({
                description: "description",
                price: 465
            })
            .expect(400)

        // title length is zero after trim
        return await request(app)
            .post("/v1/api/tickets/create")
            .set('Authorization', `Bearer ${validToken}`)
            .send({
                title: "                 ",
                description: "description",
                price: 465
            })
            .expect(400)
    }, 24000)


    it("should returns 400 if description is not present or length is zero after trim", async () => {
        // description not present
        await request(app)
            .post("/v1/api/tickets/create")
            .set('Authorization', `Bearer ${validToken}`)
            .send({
                title: "Title of ticket",
                price: 465
            })
            .expect(400)

        // description length is zero after trim
        return await request(app)
            .post("/v1/api/tickets/create")
            .set('Authorization', `Bearer ${validToken}`)
            .send({
                title: "Title of ticket",
                description: "               ",
                price: 465
            })
            .expect(400)
    }, 24000)


    it("should returns 400 if price is less than equal to zero", async () => {
        // price is zero
        await request(app)
            .post("/v1/api/tickets/create")
            .set('Authorization', `Bearer ${validToken}`)
            .send({
                title: "Title of ticket",
                description: "Description of the ticket",
                price: "0"
            })
            .expect(400)

        // price is less than zero
        return await request(app)
            .post("/v1/api/tickets/create")
            .set('Authorization', `Bearer ${validToken}`)
            .send({
                title: "Title of ticket",
                description: "Description of the ticket",
                price: "-467"
            })
            .expect(400)
    }, 24000)


    it("should returns 201 on successful ticket creation", async () => {
        return await request(app)
            .post("/v1/api/tickets/create")
            .set('Authorization', `Bearer ${validToken}`)
            .send({
                title: "Title of ticket",
                description: "Description of the ticket",
                price: 465
            })
            .expect(201)
    }, 20000)
})