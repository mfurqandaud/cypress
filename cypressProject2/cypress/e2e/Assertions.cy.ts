
it('Assertions', function(){
    cy.visit('https://example.cypress.io/')
    cy.contains('get').click()
    
    //Implicit Assertions(should,contain)
    cy.get('#query-btn').should('contain','Button')
    .should('have.class', 'query-btn') .and('be.visible')
    .should('be.enabled')

    cy.get('#query-btn').invoke('attr','id')
    .should('equal', 'query-btn')

    //Explicit Assertions(Expect, Assert)

    expect(true).to.be.true

    let name = 'Cypress.io'
    expect(name).to.be.equal('Cypress.io') 
    assert.equal(4,4,'Not equal')
    assert.strictEqual(4,4,'Not equal')


 



})