describe('Dodavanje refundacije', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.get('[data-testid="username-input"]').type('user1');
    cy.get('[data-testid="password-input"]').type('userPass');
    cy.get('[data-testid="login-button"]').click();

    cy.contains('Add Reimbursement').click();

    cy.get('[data-testid="description-input"]').should('exist');
  });


  it('dodaje novu refundaciju s ispravnim podacima', () => {
    cy.get('[data-testid="description-input"]').type('Gradska stipendija');
    cy.get('[data-testid="amount-input"]').type('350');
    cy.get('[data-testid="type-input"]').select('Employee Stipend'); 
    cy.get('[data-testid="submit-button"]').click();

    cy.contains('Gradska stipendija').should('exist');
  });

  it('ne dopušta dodavanje refundacije s praznim opisom', () => {
    cy.get('[data-testid="description-input"]').clear();
    cy.get('[data-testid="amount-input"]').type('300');
    cy.get('[data-testid="type-input"]').select('Medical Expenses');
    cy.get('[data-testid="submit-button"]').click();

    cy.contains('Description must be between 5 and 200 characters').should('exist');
  });
});

