describe('Login Page', () => {
  it('prikazuje grešku za neispravne podatke', () => {
    cy.visit('/login');
    cy.get('[data-testid="username-input"]').type('pogresan_korisnik');
    cy.get('[data-testid="password-input"]').type('krivaLozinka123');
    cy.get('[data-testid="login-button"]').click();
    cy.contains('Neispravni podaci za prijavu').should('exist');
  });

  it('uspješno se prijavljuje s točnim podacima', () => {
    cy.visit('/login');
    cy.get('[data-testid="username-input"]').type('user1');
    cy.get('[data-testid="password-input"]').type('userPass');
    cy.get('[data-testid="login-button"]').click();
    cy.url().should('include', '/dashboard');
  });

  it('uspješno se prijavljuje s točnim podacima', () => {
    cy.visit('/login');
    cy.get('[data-testid="username-input"]').type('admin');
    cy.get('[data-testid="password-input"]').type('adminPass');
    cy.get('[data-testid="login-button"]').click();
    cy.url().should('include', '/dashboard');
  });
});
