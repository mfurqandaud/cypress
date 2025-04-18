it('Google Search', () => {
    cy.visit('https://www.google.com')
    cy.get('#APjFqb').type('Cypress{Enter}')
    cy.contains('Videos').click()

// Visit => cy.visit('https://www.google.com')
// Type => cy.get('#APjFqb').type('Cypress')
// Enter automatically => cy.get('#APjFqb').type('Cypress{Enter}') 
// Click through contains => cy.contains('Videos').click() 
// Increase Timeout: cy.get('#APjFqb', {timeout:5000}).type('Cypress{Enter}') 
// Hard wait => cy.wait(2000)

// FIND ID'S

// . is class of object
// # is id

})