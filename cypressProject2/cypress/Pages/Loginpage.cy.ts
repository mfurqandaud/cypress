export class LoginPage{
    
    Loginpage_email = '#email'
    Loginpage_password = '#password'
    Loginpage_button = 'form > .btn'

        
    //add all actions to be performed.
     
    navigate(url: string){
        cy.visit(url)
    }

    enterEmail(email : string){
        //tis. shows thats its a class variable 
        cy.get(this.Loginpage_email).type(email).click()
    }

    enterPassword(password : string){
        cy.get(this.Loginpage_password).type(password)
    }

    clickLogin(){
        cy.get(this.Loginpage_button).click()
 
    }

}