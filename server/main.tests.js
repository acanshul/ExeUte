import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { chai, expect } from 'meteor/practicalmeteor:chai';
// import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Tasks } from './main.js';
 
if (Meteor.isServer) {
  describe('Tasks', () => {
    describe('methods', () => {
      const userId = Random.id();
      // let token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoyNCwiZXhwIjoxNDc2Nzk5OTM0fQ.rQ1741n283KlNJDUdw0eYwgHhVWxyi_jyoeZRRmRFEc"
      let token;
      // let todoId = 267
      let todoId;
      beforeEach(() => {
        // const signin = Meteor.server.method_handlers['signin'];
        // const invocation = function(error,result){
        //   console.log("result",result);
        //   console.log("error",error);
        //   signin.apply(invocation, [{"email": "ac@happytodo.test","password": "temp123", "domain_name": "test123"}]);
        // }

        Meteor.call('signin', {"email": "ac@happytodo.test","password": "temp123", "domain_name": "test123"},function(err,res){
          console.log("err",err);
          console.log("res",res);
          token = res.data['auth_token']
        });

      });

      it('should be able to signin', function () {
        // const signIn = new Promise((resolve, reject) => {
        //   Meteor.call('signIn',{"email": "ac@happytodo.test","password": "temp123", "domain_name": "test123"}, function(error,res){
        //     if (error) {
        //         reject(error);
        //       } else {
        //         const newSession = res.data['auth_token'];
        //         resolve(newSession);
        //       }
        //   });
        // });
        // return signIn.then(function (newSession) {
        //   expect(newSession).to.not.be.undefined;
        //   expect(newUser.email).to.equal('ac1@happytodo.test');
        //   expect(newUser.name).to.equal('acro ac1');
        // });
      });

      it('should be able to signup', function () {
        // const signUp = new Promise((resolve, reject) => {
        //   Meteor.call('signup',{"email": "ac1@happytodo.test","password": "temp123","password_confirmation": "temp123","name": "acro ac1","domain_name": "test12345"}, function(error,res){
        //     if (error) {
        //         reject(error);
        //       } else {
        //         const newUser = res.data.user;
        //         resolve(newUser);
        //       }
        //   });
        // });
        // return signUp.then(function (newUser) {
        //   expect(newUser).to.not.be.undefined;
        //   expect(newUser.email).to.equal('ac1@happytodo.test');
        //   expect(newUser.name).to.equal('acro ac1');
        // });
      });


      it('should be able to create a todo', function () {
        const createTodo = new Promise((resolve, reject) => {
          Meteor.call('createTodo',token, {"todo": {"desc": "test123","state": 0}}, function(error,res){
            if (error) {
                reject(error);
              } else {
                const newTodo = res.data;
                todoId = res.data.id
                resolve(newTodo);
              }
          });
        });
        return createTodo.then(function (newTodo) {
          expect(newTodo).to.not.be.undefined;
          expect(newTodo.desc).to.equal('test123');
        });
      });

      it('should be able to edit a todo', function () {
        const editTodo = new Promise((resolve, reject) => {
          Meteor.call('editTodo',token, {"todo": {"desc": "test123","state": 1}}, todoId , function(error,res){
            if (error) {
                reject(error);
              } else {
                const edittodo = res.data;
                resolve(edittodo);
              }
          });
        });
        return editTodo.then(function (edittodo) {
          expect(edittodo).to.not.be.undefined;
          expect(edittodo.desc).to.equal('test123');
          expect(edittodo.state).to.equal('complete');
        });
      });

      it('should be able to delete a todo', function () {
        const deleteTodo = new Promise((resolve, reject) => {
          Meteor.call('deleteTodo',token, todoId , function(error,res){
            if (error) {
                reject(error);
              } else {
                const deletetodo = res.data;
                console.log("res",res);
                resolve(deletetodo);
              }
          });
        });
        return deleteTodo.then(function (deletetodo) {
          expect(deletetodo).to.be.null;
        });
      });


    });
  });
}
