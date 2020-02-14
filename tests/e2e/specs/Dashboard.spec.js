// https://docs.cypress.io/api/introduction/api.html

describe('Dashboard', () => {
  it('Navigate to the table view', () => {

    cy.visit('http://localhost:8080/tables');

  });
});
