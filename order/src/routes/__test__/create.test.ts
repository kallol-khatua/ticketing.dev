import request from 'supertest';
import { app } from "../../app";

const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjc3N2U1MWY1MDExZWNmZWE1M2E0NjVhIiwidXNlcl9lbWFpbCI6ImthbGxvbGtoYXR1YTIwMDVAZ21haWwuY29tIiwiaWF0IjoxNzM1OTE1NjIwLCJleHAiOjE0Njk1OTE3NzU4fQ.Bx-WILlmMr3D7thQJS03Ck1XEvXkXoj3yzWTPAYCpBA'

describe("Order creation", () => {
    it("should returns 401 if authorization header not present", async () => {
        return request(app)
            .post("/v1/api/order/create")
            .expect(401)
    }, 10000)


    it("should returns 401 if authorization header not start with 'Bearer '", async () => {
        return request(app)
            .post("/v1/api/order/create")
            .set('Authorization', `auth-header-token`)
            .expect(401)
    }, 10000)


    it("should returns 401 if token not present in authorization header", async () => {
        return request(app)
            .post("/v1/api/order/create")
            .set('Authorization', `Bearer `)
            .expect(401)
    }, 10000)


    it("should returns 403 if an expired token provided in Authorization header", async () => {
        const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjc3N2U1MWY1MDExZWNmZWE1M2E0NjVhIiwidXNlcl9lbWFpbCI6ImthbGxvbGtoYXR1YTIwMDVAZ21haWwuY29tIiwiaWF0IjoxNzM1OTE1NjIwLCJleHAiOjE3MzU5MTU2ODB9.o4PQ5f7oM7FuzyGMxq1P_1UUy0YstrtpCwhQAaFnJsg'

        return request(app)
            .post("/v1/api/order/create")
            .set('Authorization', `Bearer ${expiredToken}`)
            .expect(403)
    }, 12000)


    it("should returns 403 if an invalid token provided in Authorization header", async () => {
        const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjc3N2U1MWY1MDExZWNmZWE1M2E0NjVhIiwidXNlcl9lbWFpbCI6ImthbGxvbGtoYXR1YTIwMDVAZ21haWwuY29tIiwiaWF0IjoxNzM1OTE1NjIwfQ.lBQ-wqgRwmctfjCmEClI5tlaKHbl214pDx5AvDWV8Ts'

        return request(app)
            .post("/v1/api/order/create")
            .set('Authorization', `Bearer ${invalidToken}`)
            .expect(403)
    }, 12000)


    it("should returns 400 if ticket id not present", async () => {
        return request(app)
            .post("/v1/api/order/create")
            .set('Authorization', `Bearer ${validToken}`)
            .expect(400)
    }, 20000)


    it("should returns 400 if ticket not found with the given ticket id", async () => {
        return request(app)
            .post("/v1/api/order/create")
            .set('Authorization', `Bearer ${validToken}`)
            .send({ ticketId: "6777e51f5011ecfea53a465a" })
            .expect(400)
    }, 20000)


    it("should returns 400 if ticket is already reserved or booked", async () => {
        return request(app)
            .post("/v1/api/order/create")
            .set('Authorization', `Bearer ${validToken}`)
            .send({ ticketId: "6777e51f5011ecfea53a465a" })
            .expect(400)
    }, 20000)
})