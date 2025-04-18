import { LoginPage } from './pages/login_page'
const loginPage = new LoginPage()

describe('All login tests', () => {
    beforeEach(() => {
        cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')
    })
    it('Valid Login Test', () => {
        loginPage.enterEmail('Admin')
        loginPage.enterPassword('admin123')
        loginPage.clickLoginButton()
        cy.contains('Admin').click()
    })

    it('Invalid Login Test', () => {
        loginPage.enterEmail('Admin')
        loginPage.enterPassword('admin@123')
        loginPage.clickLoginButton()
        cy.get('.oxd-alert-content > .oxd-text').should('contain', 'Invalid credentials')
    })
})

// it.only and it.skip
// any it block outside describe block will run first and won't get before each if it is inside describe block
