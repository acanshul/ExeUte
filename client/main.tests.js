import { Meteor } from 'meteor/meteor';
import { chai, expect } from 'meteor/practicalmeteor:chai';
import { todo } from './main.js';


if (Meteor.isClient) {
	let signupButton;
	let loginButton;
	describe("the home page", function(){
	    it("shows the 'Welcome Guest' without login", function(){
	      expect($(".center-container h2").text()).to.equal("Welcome Guest");
	    });
  	});

	describe("DOM tests - Signup/Signin form", function(){
	    before(function(done){
	      // $(".user_login").click();
	      signupButton = document.getElementById('sign_up');
	      loginButton = document.getElementById('login_id');
	      done();
	    }); 

	    it('Signup button has the right text', function() {
		   expect(signupButton.innerHTML).to.equal('Sign-Up');
		});

		 it('Signin button has the right text', function() {
		   expect(loginButton.innerHTML).to.equal('Login');
		});
  	});

}