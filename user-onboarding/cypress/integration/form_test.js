describe('Form - testing form inputs', function () {
	beforeEach(() => {
		cy.visit('http://localhost:3000');
	});

	it('fills out the form inputs and submits', () => {
		cy.get('[data-cy=name]').type('Name').should('have.value', 'Name');

		cy.get('[data-cy=email]')
			.type('name@example.com')
			.should('have.value', 'name@example.com');

		cy.get('[data-cy=password]')
			.type('password')
			.should('have.value', 'password');

		cy.get('[data-cy=role]')
			.select('UX Design')
			.should('have.value', 'UX Design');

		cy.get('[data-cy=terms').check().should('be.checked');

		cy.get('[data-cy=submit').click();
	});

	it('checks for form validation errors', () => {
		cy.get('[data-cy=name]').type('Name').clear();
		cy.get('[data-cy=name-error] > .MuiPaper-root > .MuiAlert-message').should(
			'contain',
			'Name is a required field'
		);

		cy.get('[data-cy=email]').type('name@example.com').clear();
		cy.get('[data-cy=email-error] > .MuiPaper-root > .MuiAlert-message').should(
			'contain',
			'email'
		);

		cy.get('[data-cy=password]').type('password').clear();
		cy.get(
			'[data-cy=password-error] > .MuiPaper-root > .MuiAlert-message'
		).should('contain', 'Password is required');
	});
});
