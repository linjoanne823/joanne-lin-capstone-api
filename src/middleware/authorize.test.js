const authorize = require('./authorize');
const sinon = require('sinon');
const jwt = require("jsonwebtoken");


describe('Authorization middleware', () => {

    beforeEach(()=>{
        mockRequest = {};
        mockResponse = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),

        };
        next = jest.fn();
    })
    test('without "authorization" header', async () => {
        const expectedResponse = {
            "error": "Not Authorized."
        };
        mockRequest = {
            headers: {

            }
        }
        authorize(mockRequest, mockResponse, next);
        expect(mockResponse.status).toBeCalledWith(403)
        expect(mockResponse.json).toBeCalledWith(expectedResponse);
    });

    

    test('with invalid "authorization" header', async () => {
        const expectedResponse = {
            "error": "No token. Unauthorized"
        }
        mockRequest = {
            headers: {
                'authorization': 'Bearer'
            }
        }
        authorize(mockRequest, mockResponse, next);
        expect(mockResponse.status).toBeCalledWith(403)
        expect(mockResponse.json).toBeCalledWith(expectedResponse);
    });

    test('with valid "authorization" header', async () => {
        mockRequest = {
            headers: {
                'authorization': 'Bearer token'
            }
        }
        sinon.stub(jwt, "verify").returns("test") //"verify" is the method to stub
        sinon.stub(jwt, "decode").returns("decoded")
        authorize(mockRequest, mockResponse, next);
        expect(mockRequest.decode).toBe("decoded")
        expect(next).toBeCalledTimes(1);
    });

})