import { LoginPage } from "../Pages/Loginpage.cy";
const loginPage = new LoginPage()

it ('login test', function(){
  loginPage.navigate('http://scs.simply-connect.31g.co.uk/auth/login');
  loginPage.enterEmail('shawad.babar@31g.co.uk');
  loginPage.enterPassword('B@bar314');
  loginPage.clickLogin();
})
