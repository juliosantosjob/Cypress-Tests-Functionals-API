/// <reference types="cypress" />

import { dynamicUser } from '../payloads/users.payloads';

describe('Finalize account', () => {
    let user = dynamicUser();
    let userId, token;

    beforeEach(() => {
        cy.createUser(user).then(({ body }) => {
            userId = body.userID;
            cy.loginUser(user).then(({ body }) => {
                token = body.token;
            });
        });
    });

    it('Deletes a user', () => {
        cy.deleteAccount(token, userId).then(({ status, body }) => {
            expect(status).to.equal(204);
            expect(body).to.be.empty;
        });
    });

    afterEach(() => {
        cy.deleteAccount(token, userId);
    });

    it('Do not delete a user without authorization', () => {
        token = 'invalid_token';

        cy.deleteAccount(token, userId).then(({ status, body }) => {
            expect(status).to.equal(401);
            expect(body.message).to.equal('User not authorized!');
        });
    });

    it('Does not delete a user that does not exist', () => {
        userId = 'invalid_userId';

        cy.deleteAccount(token, userId).then(({ status, body }) => {
            expect(status).to.equal(200);
            expect(body.message).to.equal('User Id not correct!');
        });
    });
});
