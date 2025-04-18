export class LoginPage {

    usernameLocator = ':nth-child(2) > .oxd-input-group > :nth-child(2) > .oxd-input'
    passwordLocator = ':nth-child(3) > .oxd-input-group > :nth-child(2) > .oxd-input'
    buttonLogin = '.oxd-button'

    enterEmail(username) {
        cy.get(this.usernameLocator).type(username)
    }
    enterPassword(password) {
        cy.get(this.passwordLocator).type(password)
    }
    clickLoginButton() {
        cy.get(this.buttonLogin).click()
    }
}