describe('Dashboard Access – Admin funkcije', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.get('[data-testid="username-input"]').type('admin');
    cy.get('[data-testid="password-input"]').type('adminPass');
    cy.get('[data-testid="login-button"]').click();

    cy.url().should('include', '/dashboard');
  });

  it('prikazuje dashboard naslov i barem jednu refundaciju', () => {
    cy.contains('Dashboard').should('exist');
    cy.contains('Gradska stipendija').should('exist');
    cy.contains('Employee Stipends').should('exist');
    cy.contains('350.00').should('exist');
  });

  it('odobri refundaciju ako je u statusu Pending', () => {
    cy.reload();
    cy.contains('Pending').should('exist');

    cy.contains('Pending')
      .parent() 
      .within(() => {
        cy.get('button').contains('Approve').should('not.be.disabled').click();
      });

    cy.contains('Reimbursement Approved').should('exist');
    cy.contains('Approved').should('exist');
  });

  
});
