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

describe('GET /api/articles/:article_id', () => {
    it('status: 200, responds with requested article', async () => {
        const response = await request(app).get('/api/articles/1').expect(200)
        const { body } = response;
        expect(body.article[0]).toEqual(
            expect.objectContaining({
                author: "butter_bridge",
                title: "Living in the shadow of a great man",
                article_id: 1,
                body: "I find this existence challenging",
                topic: "mitch",
                created_at: new Date(1594329060000).toJSON(),
                votes: 100
            })
        )
    });
});