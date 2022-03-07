//------IMPORTS------
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data');
const app = require('../app');
const request = require('supertest');
const connection = require('../db/connection');
const endpointsObj = require('../endpoints.json');
const db = require('../db/connection');

//---SEEDING & CONNECTIONS---
beforeEach(() => seed(testData));
afterAll(() => connection.end());

//-------TESTS-------
describe('Invalid Path', () => {
    it('status: 404, responds with path not found', async () => {
        const { body } = await request(app).get('/not-a-path').expect(404);
        expect(body).toEqual({ msg: "Path not found" });
    });
});

describe('GET /api', () => {
    it('status: 200, responds with description of all endpoints', async () => {
        const { body } = await request(app).get('/api').expect(200);
        expect(body.endpoints).toEqual(endpointsObj)
    });
});

describe('GET /api/topics', () => {
    it('status: 200, responds with all topics', async () => {
        const { body } = await request(app).get('/api/topics').expect(200);
        expect(body.topics.length).toBe(3);
        body.topics.forEach((topic) => {
            expect(topic).toEqual(
                expect.objectContaining({
                    description: expect.any(String),
                    slug: expect.any(String)
                })
            )
        })
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

describe('GET /api/users/:username', () => {
    it('status: 200, returns specified user', async () => {
        const { body } = await request(app).get('/api/users/butter_bridge').expect(200);
        expect(body.user).toEqual(
            expect.objectContaining({
                username: "butter_bridge",
                name: "jonny",
                avatar_url: "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg"
            })
        )
    });
    it('status: 404, username not found', async () => {
        const { body } = await request(app).get('/api/users/not-a-user').expect(404);
        expect(body).toEqual({ msg: "Not Found: Username not found" });
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
                    created_at: expect.any(String),
                    votes: expect.any(Number)
                })
            )
        })
    });
    it('status: 200, also includes comment_count', async () => {
        const { body } = await request(app).get('/api/articles').expect(200);
		expect(body.articles.length).toBe(12)
		body.articles.forEach((article) => {
			expect(article).toEqual(
				expect.objectContaining({
                    comment_count: expect.any(Number)
                })
            )
        })
    });
    it('status: 200, orders by date desc by default', async () => {
        const { body } = await request(app).get('/api/articles').expect(200);
        expect(body.articles).toBeSortedBy('created_at', { descending: true });
    });
    it('status: 200, accepts sort_by query', async () => {
        const { body } = await request(app).get('/api/articles?sort_by=title').expect(200);
        expect(body.articles).toBeSortedBy('title', { descending: true });
    });
    it('status: 200, accepts order query', async () => {
        const { body } = await request(app).get('/api/articles?order=asc').expect(200);
        expect(body.articles).toBeSortedBy('created_at');
    });
    it('status: 200, accept topic query', async () => {
        const { body } = await request(app).get('/api/articles?topic=cats').expect(200);
        expect(body.articles.length).toBe(1);
        body.articles.forEach((article) => {
            expect(article).toEqual(
                expect.objectContaining({
                    title: expect.any(String),
                    topic: 'cats',
                    author: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    comment_count: expect.any(Number)
                })
            )
        })
    });
    it('status: 400, returns error for invalid sort_by query', async () => {
        const { body } = await request(app).get('/api/articles?sort_by=invalid-input').expect(400);
        expect(body).toEqual({ msg: "Bad Request: Invalid sort_by query"})
    });
    it('status: 400, returns error for invalid order query', async () => {
        const { body } = await request(app).get('/api/articles?order=invalid-input').expect(400);
        expect(body).toEqual({ msg: "Bad Request: Invalid order query"})
    });
    it('status: 404, topic not found', async () => {
        const { body } = await request(app).get('/api/articles?topic=nonexistent-topic').expect(404);
        expect(body).toEqual({ msg: "Not Found: Topic not found"})
    });
});

describe('GET /api/articles/:article_id', () => {
    it('status: 200, responds with requested article', async () => {
        const { body } = await request(app).get('/api/articles/1').expect(200)
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
        const { body } = await request(app).get('/api/articles/1').expect(200)
        expect(body.article).toEqual(
            expect.objectContaining({
                comment_count: 11
            })
        )
    });
    it('status: 404, id not found', async () => {
        const { body } = await request(app).get('/api/articles/100').expect(404)
        expect(body).toEqual({ msg: 'No articles found' })
    });
    it('status: 400, invalid id given', async () => {
        const { body } = await request(app).get('/api/articles/not-a-number').expect(400)
        expect(body).toEqual({ msg: 'Bad Request: Incorrect data type input' })
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
    it('status: 400, invalid id', async () => {
        const { body } = await request(app).get('/api/articles/not-a-number/comments').expect(400)
        expect(body).toEqual({ msg: 'Bad Request: Incorrect data type input' })
    });
    it('status: 200, responds with empty array if given article id with no comments', async () => {
        const { body } = await request(app).get('/api/articles/2/comments').expect(200);
		expect(body.comments.length).toBe(0)
    });
    it('status: 404, article_id does not exist', async () => {
        const { body } = await request(app).get('/api/articles/200/comments').expect(404)
        expect(body).toEqual({ msg: 'Article ID not found' })
    });
});

describe('PATCH /api/articles/:article_id', () => {
    it('status: 200, responds with updated article and incremented votes if passed positive number', async () => {
        //ARRANGE
        const testVotes = {
            inc_votes: 50
        };
        //ASSERT
        const { body } = await request(app).patch('/api/articles/1').send(testVotes).expect(200);
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
    it('status: 200, responds with updated article and decremented votes if passed negative number', async () => {
        //ARRANGE
        const testVotes = {
            inc_votes: -50
        };
        //ASSERT
        const { body } = await request(app).patch('/api/articles/1').send(testVotes).expect(200);
        expect(body.article).toEqual(
            expect.objectContaining({
                author: "butter_bridge",
                title: "Living in the shadow of a great man",
                article_id: 1,
                body: "I find this existence challenging",
                topic: "mitch",
                created_at: new Date(1594329060000).toJSON(),
                votes: 50
            })
        )
    });
    it('status: 404, id not found', async () => {
        //ARRANGE
        const testVotes = {
            inc_votes: 50
        };
        //ASSERT
        const { body } = await request(app).patch('/api/articles/100').send(testVotes).expect(404);
        expect(body).toEqual({ msg: 'No articles found' });
    });
    it('status: 400, invalid id given', async () => {
        //ARRANGE
        const testVotes = {
            inc_votes: 50
        };
        //ASSERT
        const { body } = await request(app).patch('/api/articles/not-a-number').send(testVotes).expect(400);
        expect(body).toEqual({ msg: 'Bad Request: Incorrect data type input' });
    });
    it('status: 400, invalid vote increment given', async () => {
        //ARRANGE
        const testVotes = {
            inc_votes: 'not-a-number'
        };
        //ASSERT
        const { body } = await request(app).patch('/api/articles/1').send(testVotes).expect(400);
        expect(body).toEqual({ msg: 'Bad Request: Incorrect data type input' });
    });
});

describe('DELETE /api/articles/:article_id', () => {
    it('status: 204, deletes article', async () => {
        await request(app).delete('/api/articles/1').expect(204);
        const { body } = await request(app).get('/api/articles/1').expect(404);
        expect(body).toEqual({ msg: 'No articles found' });
    });
    it('status: 204, removes relevant comments', async () => {
        //ARRANGE
        const queryStr = `
        SELECT *
        FROM comments
        WHERE article_id = $1;`;
        
        await request(app).delete('/api/articles/1').expect(204);
        const { body } = await db.query(queryStr, [1]);
        expect(body).toBe(undefined);
    });
});

describe('POST /api/articles', () => {
    it('status: 201, responds with new article', async () => {
        //ARRANGE
        const testArticle = {
            author: "butter_bridge",
            title: "test article1",
            body: "text of the article",
            topic: "mitch"
        };
        //ASSERT
        const { body } = await request(app).post('/api/articles').send(testArticle).expect(201);
        expect(body.article).toEqual(
            expect.objectContaining({
                article_id: expect.any(Number),
                author: "butter_bridge",
                title: "test article1",
                topic: "mitch",
                body: "text of the article",
                created_at: expect.any(String),
                votes: 0,
                comment_count: 0
            })
        )
    });
    it('status: 201, new article posted to database', async () => {
        //ARRANGE
        const testArticle = {
            author: "butter_bridge",
            title: "test article1",
            body: "text of the article",
            topic: "mitch"
        };
        //ACT
        await request(app).post('/api/articles').send(testArticle).expect(201);
        const { body } = await request(app).get('/api/articles');
        expect(body.articles.length).toBe(13)
    });
    it('status: 404, author not found', async () => {
        //ARRANGE
        const testArticle = {
            author: "not-a-user",
            title: "test article1",
            body: "text of the article",
            topic: "mitch"
        };
        //ASSERT
        const { body } = await request(app).post('/api/articles').send(testArticle).expect(404);
        expect(body).toEqual({ msg: "Not Found: Required data constraint given not found" })
    });
    it('status: 400, no author given', async () => {
        //ARRANGE
        const testArticle = {
            title: "test article1",
            body: "text of the article",
            topic: "mitch"
        };
        //ASSERT
        const { body } = await request(app).post('/api/articles').send(testArticle).expect(400);
        expect(body).toEqual({ msg: 'Bad Request: Required data missing' });
    });
    it('status: 400, no body given', async () => {
        //ARRANGE
        const testArticle = {
            author: "butter_bridge",
            title: "test article1",
            topic: "mitch"
        };
        //ASSERT
        const { body } = await request(app).post('/api/articles').send(testArticle).expect(400);
        expect(body).toEqual({ msg: 'Bad Request: Required data missing' });
    });
    it('status: 400, no title given', async () => {
        //ARRANGE
        const testArticle = {
            author: "butter_bridge",
            body: "text of the article",
            topic: "mitch"
        };
        //ASSERT
        const { body } = await request(app).post('/api/articles').send(testArticle).expect(400);
        expect(body).toEqual({ msg: 'Bad Request: Required data missing' });
    });
    it('status: 400, no topic given', async () => {
        //ARRANGE
        const testArticle = {
            author: "butter_bridge",
            body: "text of the article",
            title: "test article1"
        };
        //ASSERT
        const { body } = await request(app).post('/api/articles').send(testArticle).expect(400);
        expect(body).toEqual({ msg: 'Bad Request: Required data missing' });
    });
    it('status: 404, topic not found', async () => {
        //ARRANGE
        const testArticle = {
            author: "not-a-user",
            title: "test article1",
            body: "text of the article",
            topic: "non-existent topic"
        };
        //ASSERT
        const { body } = await request(app).post('/api/articles').send(testArticle).expect(404);
        expect(body).toEqual({ msg: "Not Found: Required data constraint given not found" })
    });
});

describe('POST /api/articles/:article_id/comments', () => {
    it('status: 201, responds with posted comment', async () => {
        //ARRANGE
        const testComment = {
            username: "butter_bridge",
            body: "This is a test comment!"
        };
        //ASSERT
        const { body } = await request(app).post('/api/articles/1/comments').send(testComment).expect(201);
        expect(body.comment).toEqual(
            expect.objectContaining({
                article_id: 1,
                author: "butter_bridge",
                body: "This is a test comment!",
                comment_id: expect.any(Number),
                created_at: expect.any(String),
                votes: 0
            })
        )
    });
    it('status: 201, posts comment to assigned article', async () => {
        //ARRANGE
        const testComment = {
            username: "butter_bridge",
            body: "This is a test comment!"
        };
        //ACT
        await request(app).post('/api/articles/1/comments').send(testComment).expect(201);
        //ASSERT
        const { body } = await request(app).get('/api/articles/1/comments');
        expect(body.comments.length).toBe(12);
    });
    it('status: 201, increments comment_count of relevant article', async () => {
        //ARRANGE
        const testComment = {
            username: "butter_bridge",
            body: "This is a test comment!"
        };
        //ACT
        await request(app).post('/api/articles/1/comments').send(testComment).expect(201);
        //ASSERT
        const { body } = await request(app).get('/api/articles/1');
        expect(body.article.comment_count).toBe(12);
    });
    it('status: 404, username not found', async () => {
        //ARRANGE
        const testComment = {
            username: "nonexistent-user",
            body: "This is a test comment!"
        }
        //ASSERT
        const { body } = await request(app).post('/api/articles/1/comments').send(testComment).expect(404);
        expect(body).toEqual({ msg: 'Not Found: Required data constraint given not found' });
    });
    it('status: 400, no username given', async () => {
        //ARRANGE
        const testComment = {
            body: "This is a test comment!"
        }
        //ASSERT
        const { body } = await request(app).post('/api/articles/1/comments').send(testComment).expect(400);
        expect(body).toEqual({ msg: 'Bad Request: Required data missing' });
    });
    it('status: 400, no body given', async () => {
        //ARRANGE
        const testComment = {
            username: "butter_bridge"
        }
        //ASSERT
        const { body } = await request(app).post('/api/articles/1/comments').send(testComment).expect(400);
        expect(body).toEqual({ msg: 'Bad Request: Required data missing' });
    });
    it('status: 404, article_id does not exist', async () => {
        //ARRANGE
        const testComment = {
            username: "butter_bridge",
            body: "This is a test comment!"
        };
        //ASSERT
        const { body } = await request(app).post('/api/articles/200/comments').send(testComment).expect(404)
        expect(body).toEqual({ msg: 'Not Found: Required data constraint given not found' });
    });
    it('status: 400, invalid id', async () => {
        //ARRANGE
        const testComment = {
            username: "butter_bridge",
            body: "This is a test comment!"
        };
        //ASSERT
        const { body } = await request(app).post('/api/articles/not-a-number/comments').send(testComment).expect(400)
        expect(body).toEqual({ msg: 'Bad Request: Incorrect data type input' })
    });
});

describe('PATCH /api/comments/:comment_id', () => {
    it('status: 200, responds with updated comment with incremented votes if given positive number', async () => {
        //ARRANGE
        const testVotesInc = {
            inc_votes: 10
        }
        //ACT & ASSERT
        const { body } = await request(app).patch('/api/comments/1').send(testVotesInc).expect(200);
        expect(body.comment).toEqual(
            expect.objectContaining({
                body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                votes: 26,
                author: "butter_bridge",
                article_id: 9,
                created_at: new Date(1586179020000).toJSON()
            })
        )
    });
    it('status: 200, responds with updated comment with decremented votes if given negative number', async () => {
        //ARRANGE
        const testVotesInc = {
            inc_votes: -10
        }
        //ACT & ASSERT
        const { body } = await request(app).patch('/api/comments/1').send(testVotesInc).expect(200);
        expect(body.comment).toEqual(
            expect.objectContaining({
                body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                votes: 6,
                author: "butter_bridge",
                article_id: 9,
                created_at: new Date(1586179020000).toJSON()
            })
        )
    });
    it('status: 404, comment not found', async () => {
        //ARRANGE
        const testVotesInc = {
            inc_votes: 10
        }
        //ACT & ASSERT
        const { body } = await request(app).patch('/api/comments/1000').send(testVotesInc).expect(404);
        expect(body).toEqual({ msg: "Not Found: Comment not found" })
    });
    it('status: 400, invalid id given', async () => {
        //ARRANGE
        const testVotesInc = {
            inc_votes: 50
        };
        //ASSERT
        const { body } = await request(app).patch('/api/comments/not-a-number').send(testVotesInc).expect(400);
        expect(body).toEqual({ msg: 'Bad Request: Incorrect data type input' })
    });
    it('status: 400, invalid vote increment given', async () => {
        //ARRANGE
        const testVotesInc = {
            inc_votes: 'not-a-number'
        };
        //ASSERT
        const { body } = await request(app).patch('/api/comments/1').send(testVotesInc).expect(400);
        expect(body).toEqual({ msg: 'Bad Request: Incorrect data type input' })
    });
});

describe('DELETE /api/comments/:comment_id', () => {
    it('status: 204, decrements linked comment_count', async () => {
        await request(app).delete('/api/comments/1').expect(204);
        const { body } = await request(app).get('/api/articles/9');
        expect(body.article.comment_count).toBe(1);
    });
    it('status: 404, comment not found', async () => {
        const { body } = await request(app).delete('/api/comments/1000').expect(404);
        expect(body).toEqual({ msg: "Not Found: Comment not found" });
    });
    it('status: 400, invalid comment id', async () => {
        const { body } = await request(app).delete('/api/comments/not-a-number').expect(400);
        expect(body).toEqual({ msg: "Bad Request: Incorrect data type input" });
    });
});