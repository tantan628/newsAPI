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
        expect(body.article).toEqual(
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
    it('status: 200, responds with comment_count on object', async () => {
        const response = await request(app).get('/api/articles/1').expect(200)
        const { body } = response;
        expect(body.article).toEqual(
            expect.objectContaining({
                comment_count: 11
            })
        )
    });
    it('status: 404, id not found', async () => {
        const response = await request(app).get('/api/articles/100').expect(404)
        const { body } = response;
        expect(body).toEqual({ msg: 'No articles found' })
    });
    it('status: 400, invalid id returns bad request', async () => {
        const response = await request(app).get('/api/articles/not-a-number').expect(400)
        const { body } = response;
        expect(body).toEqual({ msg: 'Bad request: Incorrect data type input' })
    });
});


describe('GET /api/articles', () => {
	it('status: 200, returns all articles', async () => {
		const { body } = await request(app).get('/api/articles').expect(200);
		expect(body.articles.length).toBe(12)
		body.articles.forEach((article) => {
			expect(article).toEqual(
				expect.objectContaining({
                    article_id: expect.any(Number),
					title: expect.any(String),
					topic: expect.any(String),
					author: expect.any(String),
                    body: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number)
                })
            )
        })
    })
});

describe('PATCH /api/articles/:article_id', () => {
    it('status: 200, responds with updated article', async () => {
        const testVotes = {
            inc_votes: 50
        };
        const response = await request(app)
                        .patch('/api/articles/1')
                        .send(testVotes)
                        .expect(200)
        const { body } = response;
        expect(body.article).toEqual(
            expect.objectContaining({
                author: "butter_bridge",
                title: "Living in the shadow of a great man",
                article_id: 1,
                body: "I find this existence challenging",
                topic: "mitch",
                created_at: new Date(1594329060000).toJSON(),
                votes: 150
            })
        )
    });
    it('status: 404, id not found', async () => {
        const testVotes = {
            inc_votes: 50
        };
        const response = await request(app)
                        .patch('/api/articles/100')
                        .send(testVotes)
                        .expect(404)
        const { body } = response;
        expect(body).toEqual({ msg: 'No articles found' })
    });
    it('status: 400, invalid id given', async () => {
        const testVotes = {
            inc_votes: 50
        };
        const response = await request(app)
                        .patch('/api/articles/not-a-number')
                        .send(testVotes)
                        .expect(400)
        const { body } = response;
        expect(body).toEqual({ msg: 'Bad request: Incorrect data type input' })
    });
    it('status: 400, invalid vote increment given', async () => {
        const testVotes = {
            inc_votes: 'not-a-number'
        };
        const response = await request(app)
                        .patch('/api/articles/1')
                        .send(testVotes)
                        .expect(400)
        const { body } = response;
        expect(body).toEqual({ msg: 'Bad request: Incorrect data type input' })
    });
});

describe('GET /api/users', () => {
	it('status: 200, returns all users', async () => {
		const { body } = await request(app).get('/api/users').expect(200);
		expect(body.users.length).toBe(4)
		body.users.forEach((user) => {
			expect(user).toEqual(
				expect.objectContaining({
					username: expect.any(String),
					name: expect.any(String),
					avatar_url: expect.any(String)

					})
			)
		})
	});
});

describe('GET /api/articles/:article_id/comments', () => {
    it('status: 200, responds with relevant comments', async () => {
        const { body } = await request(app).get('/api/articles/1/comments').expect(200);
		expect(body.comments.length).toBe(11)
		body.comments.forEach((comment) => {
			expect(comment).toEqual(
				expect.objectContaining({
                    comment_id: expect.any(Number),
                    votes: expect.any(Number),
                    created_at: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String)
                })
            )
        })
    });
    it('status: 400, invalid id returns bad request', async () => {
        const response = await request(app).get('/api/articles/not-a-number/comments').expect(400)
        const { body } = response;
        expect(body).toEqual({ msg: 'Bad request: Incorrect data type input' })
    });
    it('status: 200, responds with empty array if given article id with no comments', async () => {
        const { body } = await request(app).get('/api/articles/2/comments').expect(200);
		expect(body.comments.length).toBe(0)
    });
    it('status: 404, article_id does not exist', async () => {
        const response = await request(app).get('/api/articles/200/comments').expect(404)
        const { body } = response;
        expect(body).toEqual({ msg: 'Article ID not found' })
    })
});