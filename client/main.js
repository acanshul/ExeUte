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
      return Todos.find().fetch().sort(
        function(a, b) {
            return b.id - a.id
        });
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
  },
  get_readonly: function() {
    if(this.state === 'complete'){
      return "readonly"
    }
    // body...
  },

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
              // $(".list-container div:first").before('<div class="list-container--items transition"><div class="grid-cell grid-cell--action"><span class="checkmark" currenttodoidforcomplate='+results.data.id+'><svg class="svg-tick" viewBox="0 0 32 32" title="checkmark"><polygon points="27.672,4.786 10.901,21.557 4.328,14.984 1.5,17.812 10.901,27.214 30.5,7.615 "></polygon></svg></span></div><div class="grid-cell"><input class="input-field single_todo_item" type="text" value='+results.data.desc+' currenttodoid='+results.data.id+'></div><div class="grid-cell grid-cell--action"><span class="delete" currenttodoid='+results.data.id+'><svg class="svg-delete transition" viewBox="0 0 482.428 482.429"><path d="M381.163,57.799h-75.094C302.323,25.316,274.686,0,241.214,0c-33.471,0-61.104,25.315-64.85,57.799h-75.098 c-30.39,0-55.111,24.728-55.111,55.117v2.828c0,23.223,14.46,43.1,34.83,51.199v260.369c0,30.39,24.724,55.117,55.112,55.117 h210.236c30.389,0,55.111-24.729,55.111-55.117V166.944c20.369-8.1,34.83-27.977,34.83-51.199v-2.828 C436.274,82.527,411.551,57.799,381.163,57.799z M241.214,26.139c19.037,0,34.927,13.645,38.443,31.66h-76.879 C206.293,39.783,222.184,26.139,241.214,26.139z M375.305,427.312c0,15.978-13,28.979-28.973,28.979H136.096 c-15.973,0-28.973-13.002-28.973-28.979V170.861h268.182V427.312z M410.135,115.744c0,15.978-13,28.979-28.973,28.979H101.266 c-15.973,0-28.973-13.001-28.973-28.979v-2.828c0-15.978,13-28.979,28.973-28.979h279.897c15.973,0,28.973,13.001,28.973,28.979 V115.744z"></path><path d="M171.144,422.863c7.218,0,13.069-5.853,13.069-13.068V262.641c0-7.216-5.852-13.07-13.069-13.07 c-7.217,0-13.069,5.854-13.069,13.07v147.154C158.074,417.012,163.926,422.863,171.144,422.863z"></path><path d="M241.214,422.863c7.218,0,13.07-5.853,13.07-13.068V262.641c0-7.216-5.854-13.07-13.07-13.07  c-7.217,0-13.069,5.854-13.069,13.07v147.154C228.145,417.012,233.996,422.863,241.214,422.863z"></path> <path d="M311.284,422.863c7.217,0,13.068-5.853,13.068-13.068V262.641c0-7.216-5.852-13.07-13.068-13.07 c-7.219,0-13.07,5.854-13.07,13.07v147.154C298.213,417.012,304.067,422.863,311.284,422.863z"></path></svg></span></div></div>')
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