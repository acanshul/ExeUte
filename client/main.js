import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';

import './main.html';

Todos = new Mongo.Collection('todos');




if(localStorage.getItem('current_user') && localStorage.getItem('current_user') !== "undefined")
{
  Session.set("is_login",true);
  Meteor.subscribe('todosSearch', JSON.parse(localStorage.getItem('current_user'))['auth_token']);
} else{ 
  Session.set("is_login",false);
}

Deps.autorun(function(c) {
  if (Session.get('query')) {
   // var searchHandle = Meteor.subscribe('todosSearch', Session.get("session-id"));
   // Session.set('query',false);
  }
});

Template.hello.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);
});

Template.hello.helpers({
  counter() {
    return Template.instance().counter.get();
  },
  todos: function() {
    if(Session.get("is_login")){
      return Todos.find();
    }
    else{
      return [];
    }
    // }
  },
  user_name: function(){
    if(Session.get("is_login")){
      Meteor.subscribe('todosSearch', JSON.parse(localStorage.getItem('current_user'))['auth_token']);
      return JSON.parse(localStorage.getItem('current_user'))['user_name'];
    }else{
      return "Guest"
    }
  },
  welcome_title: function(){
    if(Session.get("is_login")){
      return "My Todo List";
    }else{
      return "Welcome Guest"
    }
  },
  get_completed: function() {
    if(this.state === 'complete'){
      return "completed"
    }
    // body...
  },
  islogout: function(){
    if(Session.get("is_login")){
      return true;
    }else{
      return false;
    }
  }

});



Template.hello.events({
  'keypress #create_todo'(event, instance) {
    if(Session.get("is_login")){
      if(event.which == 13){
      	var todoText = event.currentTarget.value;
        Session.set('query',true);
        var token = JSON.parse(localStorage.getItem('current_user'))['auth_token']
        var data ={"todo":{"desc": todoText,"state": 0}}
        event.currentTarget.value = "";
      	Meteor.call("createTodo", token, data, function(error, results) {
          	if(results){
              Meteor.subscribe('todosSearch', token);
              alert("Todo Added Successfully");
          		// Session.set("session-id",JSON.parse(results.content)['auth_token'])
          		// Meteor.UserId = JSON.parse(results.content)['auth_token']
          	}
      	});
      }
    }
    else{
      alert("please login before creating todos")
    }
  },
});



Template.hello.events({
  'click .checkmark'(event, instance) {
    var todoText = event.currentTarget.value;
    var parent = $(event.currentTarget).parent().parent();
    var self = event.currentTarget;
    var todoid = event.currentTarget.getAttribute("currenttodoidforcomplate");
    var token = JSON.parse(localStorage.getItem('current_user'))['auth_token']
    var data ={"todo":{"desc": todoText,"state": 1}}
    Meteor.call("editTodo", token, data, todoid, function(error, results) {
        //results.data should be a JSON object
        if(results){
          $(parent).addClass('completed');
        }else{
          alert('Some Issue coming')
        }
    });
  }
});




Template.hello.events({
  'click .delete'(event, instance) {
    var parent = $(event.currentTarget).parent().parent();
    var todoid = event.currentTarget.getAttribute("currenttodoid");
    var token = JSON.parse(localStorage.getItem('current_user'))['auth_token']
    Meteor.call("deleteTodo", token, todoid, function(error, results) {
        //results.data should be a JSON object
        if(results){
          $(parent).hide();
        }else{
          alert('Some Issue coming')
        }
    });
  }
});



Template.hello.events({
  'click #login_id'(event, instance) {
    if(true){
      var uname = $("#uname").val();
      var email = $("#email_id").val();
      var password = $("#password").val();
      var domain_name = $("#domain_name").val();
      var password_confirmation = $("#password_confirmation").val();
      Session.set('query',true);
      var data ={"email": email,"password": password, "domain_name": domain_name, "name": uname, "password_confirmation": password_confirmation}
      // localStorage.setItem("current_user",{'user_name':"test1",'domain_name':"test123",'auth_token':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoyNCwiZXhwIjoxNDc1Njc4NzAzfQ.hkrbYpOSAauF1klSYwGomH8Y2JCHgy2oDtNriU2YcLo'})
      Meteor.call("signin", data, function(error, results) {
        //results.data should be a JSON object
          if(results){
            cuser = JSON.stringify({'user_name':uname,'domain_name':domain_name,'email':email,'auth_token':results.data['auth_token']})
            localStorage.setItem("current_user",cuser);
            $("#uname").val('');
            $("#email_id").val('');
            $("#password").val('');
            $("#domain_name").val('');
            $("#password_confirmation").val('');
            $(".user-login-overly").removeClass("active")
            Session.set("is_login",true);
          }
          if(error){
            alert("Something went wrong")
          }
      });
    }
  },
});


Template.hello.events({
  'click #sign_up'(event, instance) {
    if(true){
      var uname = $("#uname").val();
      var email = $("#email_id").val();
      var password = $("#password").val();
      var domain_name = $("#domain_name").val();
      var password_confirmation = $("#password_confirmation").val();
      Session.set('query',true);
      var data ={"email": email,"password": password, "domain_name": domain_name, "name": uname, "password_confirmation": password_confirmation}
      // localStorage.setItem("current_user",{'user_name':"test1",'domain_name':"test123",'auth_token':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoyNCwiZXhwIjoxNDc1Njc4NzAzfQ.hkrbYpOSAauF1klSYwGomH8Y2JCHgy2oDtNriU2YcLo'})
      Meteor.call("signup", data, function(error, results) {
        //results.data should be a JSON object
        console.log("results",results);
          if(results){
            cuser = JSON.stringify({'user_name':uname,'domain_name':domain_name,'email':email,'auth_token':results.data['auth_token']})
            $("#uname").val('');
            $("#email_id").val('');
            $("#password").val('');
            $("#domain_name").val('');
            $("#password_confirmation").val('');
            // localStorage.setItem("current_user",cuser);
            alert("you are Successfully sign up, Now you can login");
            $(".user-login-overly").removeClass("active")
            // Session.set("is_login",true);
          }
          if(error){
            alert("Something went wrong")
          }
      });
    }
  },
});





Template.hello.events({
  'click .logout'(event, instance) {
    localStorage.setItem("current_user",undefined);
    Session.set("is_login",false);
    Meteor.subscribe('todosSearch', false);
  }
});




Template.hello.rendered = function(){
  function openOverly() {
  $(".user_login").click(function(e){
     if(!Session.get("is_login")){
      e.preventDefault();
      $(".user-login-overly").addClass("active");
    }
  });
  $(".close_login").click(function(e){
    e.preventDefault();
    $(".user-login-overly").removeClass("active");
  });
   

}
 openOverly();
};


Meteor.startup(() => {
  // code to run on server at startup
  

});