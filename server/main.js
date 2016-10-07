import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http'
import { Random } from 'meteor/random'

Meteor.startup(() => {
	// code to run on server at startup


});


if (Meteor.isServer) {
		
		Todos = new Mongo.Collection('todos');


		Meteor.methods({
			signup: function (data) {
					this.unblock();
					// data ='{"todo": {"desc": "my first test123","state": 1,"schedule_attributes": {"date": "2016-08-14","time": "2016-08-13T09:13:48.157Z","rule": "weekly","day":  ["monday", "friday"]}}}'
					// data ={"email": "ac@happytodo.test","password": "temp123","password_confirmation": "temp123","name": "acro ac","domain_name": "test123"}
					return HTTP.call("POST", "http://happytodo.int2root.com/v1/signup",{data:data});
			},
			signin: function (data) {
					this.unblock();
					// data ='{"todo": {"desc": "my first test123","state": 1,"schedule_attributes": {"date": "2016-08-14","time": "2016-08-13T09:13:48.157Z","rule": "weekly","day":  ["monday", "friday"]}}}'
					// data ={"email": "ac@happytodo.test","password": "temp123", "domain_name": "test123"}
					return HTTP.call("POST", "http://happytodo.int2root.com/v1/signin",{data:data});
			},
			createTodo: function (token, data) {
					this.unblock();
					// data ={"todo": {"desc": "test123","state": 1,"schedule_attributes": {"date": "2016-08-14","time": "2016-08-13T09:13:48.157Z","rule": "weekly","day":  ["monday", "friday"]}}}
					// data ={"email": "ac@happytodo.test","password": "temp123", "domain_name": "test123"}
					return HTTP.call("POST", "http://happytodo.int2root.com/v1/todos",{data:data,headers:{"Authorization":token,'Content-Type': 'application/json'}});
			},
			editTodo: function (token, data, todoid) {
					this.unblock();
					// data ='{"todo": {"desc": "my first test123","state": 1,"schedule_attributes": {"date": "2016-08-14","time": "2016-08-13T09:13:48.157Z","rule": "weekly","day":  ["monday", "friday"]}}}'
					// data ={"email": "ac@happytodo.test","password": "temp123", "domain_name": "test123"}
					return HTTP.call("PUT", "http://happytodo.int2root.com/v1/todos/"+todoid,{data:data,headers:{"Authorization":token}});
			},
			deleteTodo: function (token, todoid) {
				this.unblock();
				// data ='{"todo": {"desc": "my first test123","state": 1,"schedule_attributes": {"date": "2016-08-14","time": "2016-08-13T09:13:48.157Z","rule": "weekly","day":  ["monday", "friday"]}}}'
				// data ={"email": "ac@happytodo.test","password": "temp123", "domain_name": "test123"}
				return HTTP.call("DELETE", "http://happytodo.int2root.com/v1/todos/"+todoid,{headers:{"Authorization":token}});
			}

		});


	const POLL_INTERVAL = 5000;
	Meteor.publish('todosSearch', function(query) {  
		const publishedKeys = [];
		var self = this;

		const poll = () => {
			// Let's assume the data comes back as an array of JSON documents, with an _id field, for simplicity
			if(query){
				const response = HTTP.get("http://happytodo.int2root.com/v1/todos",{headers:{"Authorization":query}});
				original_data = response.data.sort(
				    function(a, b) {
				        return b.id - a.id
				    });
				original_data.forEach((doc) => {
					if (publishedKeys[doc.id]) {
						this.changed('todos', doc.id, doc);
					} else {
						publishedKeys[doc.id] = true;
						this.added('todos', doc.id, doc);
					}
				});
			}
		};

		poll();
		this.ready();

		const interval = Meteor.setInterval(poll, POLL_INTERVAL);

		this.onStop(() => {
			Meteor.clearInterval(interval);
		});
	});


}