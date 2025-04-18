it('Assertions Demo', () => {
    cy.visit('https://example.cypress.io')
    cy.contains('get').click() // Click through contains text
    cy.get('#query-btn').should('contain','Button') // Shouuld-contain-text // Assert through contains text 
    cy.get('#query-btn').should('have.class','query-btn btn btn-primary') // Should-have-class or have.text or have.class // Assert through have
    cy.get('#query-btn').should('be.visible') // Should-be-visible // Assert through be.visible or be.selected or be.disabled or be.focused

    // should-equal .invoke('attr', 'id').should('equal', 'query-btn') // Assert through invoke

    // and [Chained Asssertions] // Assert through and
    // cy.get('#query-btn')
    //         .should('contain','Button') // Shouuld-contain-text // Assert through contains text 
    //         .and('have.class','query-btn btn btn-primary') // Should-have-class or have.text or have.class // Assert through have
    //         .and('be.visible')

    expect(true).to.be.true // Assert through expect
    // let name='cypress'
    // expect(name).to.be.equal('cypress')
    // to.not.equal // to.be.a('string') // to.be.true // to.be.false // to.be.null // to.exist // so many more
    
    assert.equal(4,4, 'NOT EQUAL') // Assert through assert
    assert.strictEqual(4,4, 'NOT STRICT EQUAL') // Assert through assert
    // equal // notEqual // isAbove // isBelow // exists // notExists // true // false // isString // isnotString // isNumber // isNotNumber

    // Implicit = should() & and () // Explicit = expect() & assert()

})