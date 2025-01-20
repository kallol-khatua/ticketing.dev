import request from 'supertest';
import { app } from "../../app";

const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjc3N2U1MWY1MDExZWNmZWE1M2E0NjVhIiwidXNlcl9lbWFpbCI6ImthbGxvbGtoYXR1YTIwMDVAZ21haWwuY29tIiwiaWF0IjoxNzM1OTE1NjIwLCJleHAiOjE0Njk1OTE3NzU4fQ.Bx-WILlmMr3D7thQJS03Ck1XEvXkXoj3yzWTPAYCpBA'

describe("Ticket creation", () => {
    it("should returns 401 if authorization header not present", async () => {
        return request(app)
            .get("/v1/api/ticket/created-by-user")
            .expect(401)
    }, 10000)


    it("should returns 401 if authorization header not start with 'Bearer '", async () => {
        return request(app)
            .get("/v1/api/ticket/created-by-user")
            .set('Authorization', `auth-header-token`)
            .expect(401)
    }, 10000)


    it("should returns 401 if token not present in authorization header", async () => {
        return request(app)
            .get("/v1/api/ticket/created-by-user")
            .set('Authorization', `Bearer `)
            .expect(401)
    }, 10000)


    it("should returns 403 if an expired token provided in Authorization header", async () => {
        const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjc3N2U1MWY1MDExZWNmZWE1M2E0NjVhIiwidXNlcl9lbWFpbCI6ImthbGxvbGtoYXR1YTIwMDVAZ21haWwuY29tIiwiaWF0IjoxNzM1OTE1NjIwLCJleHAiOjE3MzU5MTU2ODB9.o4PQ5f7oM7FuzyGMxq1P_1UUy0YstrtpCwhQAaFnJsg'

        return request(app)
            .get("/v1/api/ticket/created-by-user")
            .set('Authorization', `Bearer ${expiredToken}`)
            .expect(403)
    }, 12000)


    it("should returns 403 if an invalid token provided in Authorization header", async () => {
        const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjc3N2U1MWY1MDExZWNmZWE1M2E0NjVhIiwidXNlcl9lbWFpbCI6ImthbGxvbGtoYXR1YTIwMDVAZ21haWwuY29tIiwiaWF0IjoxNzM1OTE1NjIwfQ.lBQ-wqgRwmctfjCmEClI5tlaKHbl214pDx5AvDWV8Ts'

        return request(app)
            .get("/v1/api/ticket/created-by-user")
            .set('Authorization', `Bearer ${invalidToken}`)
            .expect(403)
    }, 12000)


    it("should returns 200 after founding tickets", async () => {
        return await request(app)
            .get("/v1/api/ticket/created-by-user")
            .set('Authorization', `Bearer ${validToken}`)
            .expect(200)
    }, 20000)
})