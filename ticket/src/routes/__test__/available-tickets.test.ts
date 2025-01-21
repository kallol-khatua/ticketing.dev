import request from 'supertest';
import { app } from "../../app";

describe('Available tickets', () => {
    it("should return 200 after findind available tickets", async () => {
        return request(app)
            .get("/v1/api/tickets/available-tickets")
            .expect(200)
    }, 10000)
})
