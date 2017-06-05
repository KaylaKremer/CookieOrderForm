//Imports modules for Selenium Webdriver, File System, Assert, and Faker.
const webdriver = require('selenium-webdriver');
const test = require('selenium-webdriver/testing');
const fs = require('fs');
const assert = require('assert');
const faker = require('faker/locale/en_US');

//Creates webdriver set up for Chrome Browser. Also creates shorthand variables for the by and until methods.
const driver = new webdriver.Builder().forBrowser('chrome').build();
const by = webdriver.By;
const until = webdriver.until;

//Befor any tests are run, the driver retrieves the cookieForm.html file and resizes the window to 1024 x 768. A timeout of 10 seconds is set to prevent any error messages when running the tests. 
test.before(function(){
    this.timeout(10000);
    driver.get('file:///C:/Users/Kayla/Desktop/NEW%20Cookie%20Order%20Form/cookieForm.html');
    driver.manage().window().setSize(1024, 768);
});

//After all tests are run, the driver quits and the browser window closes.
test.after(function(){
    driver.quit();
})

//Function creates a screenshot of the browser window as a .png and saves it to the img folder.
function writeScreenshot(data){
    const name = `screenshot.png`;
    const screenshotPath = './img/';
    fs.writeFileSync(screenshotPath + name, data, 'base64');
}

//Creates and returns a customer object with randomly generated info using Faker.
function getRandomCustomer(){
    const fullName = faker.name.findName();
    const email = faker.internet.email();
    const street = faker.address.streetAddress();
    const city = faker.address.city();
    const state = faker.address.stateAbbr();
    const zipCode = faker.address.zipCode().substring(0, 5);
    const customer = {
        fullName: fullName,
        email: email,
        street: street,
        city: city,
        state: state,
        zipCode: zipCode
    }
    return customer;
}

//Returns a randomly selected number from the cookieFlavors array which corresponds to the price values for each cookie flavor.
function getRandomCookieFlavor(){
    const cookieFlavors = ['0', '1.5', '1.75', '1.25', '1.5', '1', '1.75'];
    return cookieFlavors[Math.floor(Math.random() * cookieFlavors.length)];
}

//Creates shorthand variables for locating all of the elements needed in the tests.
const customer = getRandomCustomer();
const cookieFlavor = getRandomCookieFlavor();
const nameTextField = driver.findElement(by.id('nameForOrder'));
const emailTextField = driver.findElement(by.id('emailForOrder'));
const selectList = driver.findElement(by.id('cookieFlavor'));
const streetTextField = driver.findElement(by.id('street'));
const cityTextField = driver.findElement(by.id('city'));
const stateTextField = driver.findElement(by.id('state'));
const zipCodeTextField = driver.findElement(by.id('zip'));
const submitOrderButton = driver.findElement(by.id('submitOrder'));

//Begins test suite for cookieForm.html using Mocha.
test.describe('Cookie Order Form Test Suite', function() {

//First test retrives title for cookieForm.html and then verifies that it matches 'Cookie Order Form'.
    test.it('Should have a form title of "Cookie Order Form"', function(){
        driver.getTitle().then(function(title){
            assert.equal('Cookie Order Form', title);
        });
    });

//Second test inputs the name property from the customer object that was created with the getRandomCustomer function. It then verifies the correct name was entered.
     test.it('Should insert randomly generated name in order form and verify it', function(){
        nameTextField.sendKeys(customer.fullName);
        nameTextField.getAttribute('value').then(function(value){
            assert.equal(customer.fullName, value);
        });  
    });

//Third test inputs the email property from the customer object that was created with the getRandomCustomer function. It then verifies the correct email was entered.
    test.it('Should insert randomly generated email address in order form and verify it', function(){
        emailTextField.sendKeys(customer.email);
        emailTextField.getAttribute('value').then(function(value){
            assert.equal(customer.email, value);
        });  
    });

//Fourth test selects a cookie flavor from the drop down list by generating a random value attribute with the getRandomCookieFlavor function, which is stored in the cookieFlavor variable. It then verifies the correct cookie flavor was selected.
    test.it('Should randomly select cookie flavor from drop-down list and verify it', function(){
        selectList.findElement(by.css(`option[value="${cookieFlavor}"]`)).click();
        selectList.getAttribute('value').then(function(selected){
        assert.equal(cookieFlavor, selected);
        });
    });

//Fifth test inputs the street, city, state, and zipCode properties from the customer object that was created with the getRandomCustomer function. It then verifies the correct address was entered.
    test.it('Should insert randomly generated address in order form and verify it', function(){
        streetTextField.sendKeys(customer.street);
        cityTextField.sendKeys(customer.city);
        stateTextField.sendKeys(customer.state);
        zipCodeTextField.sendKeys(customer.zipCode);

        streetTextField.getAttribute('value').then(function(value){
            assert.equal(customer.street, value);
        });
        cityTextField.getAttribute('value').then(function(value){
            assert.equal(customer.city, value);
        });
        stateTextField.getAttribute('value').then(function(value){
            assert.equal(customer.state, value);
        });
        zipCodeTextField.getAttribute('value').then(function(value){
            assert.equal(customer.zipCode, value);
        });
    });

//Sixt test clicks on the Submit Order button, then waits for the alert popup window to appear. It then switches to this popup window to click ok, then switches back to the main browser window.
    test.it('Should click on Submit Order button and  handle alert popup', function(){
        submitOrderButton.click();
        driver.sleep(1000);
        driver.wait(until.alertIsPresent()).then(function(){
            driver.switchTo().alert().accept();
        });
        driver.switchTo().defaultContent();
    });

//Seventh test takes a screenshot of the browser and then calls the writeScreenshot function to save the image out as a .png to the img folder. 
    test.it('Should take a screenshot of completed order form and save to img folder', function(){
        driver.takeScreenshot().then(function(data){
            writeScreenshot(data);
        });
    });
});