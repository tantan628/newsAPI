const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data');
const app = require('../app');
const request = require('supertest');
const connection = require('../db/connection');

beforeEach(() => seed(testData));

afterAll(() => connection.end());

describe('Invalid Path', () => {
    it('status: 404, responds with path not found', () => {
        return request(app)
            .get('/not-a/path')
            .expect(404)
            .then(({ body }) => {
                expect(body).toEqual({ msg: "Path not found" })
            })
    });
});

describe('GET /api/topics', () => {
    it('status: 200, responds with all topics', () => {
        return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({ body }) => {
                expect(body.topics.length).toBe(3);
                body.topics.forEach((topic) => {
                    expect(topic).toEqual(
                        expect.objectContaining({
                            description: expect.any(String),
                            slug: expect.any(String)
                        })
                    )
                })
            })
    });
});