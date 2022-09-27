import React, {useState, useEffect} from "react";
import '/workspace/react-hello/src/styles/index.css'
import {userName} from '..'



const TodoList = () => {

	const [inputValue, setInputValue ] = useState('');
	const [todoList, setTodoList] = useState([]);
	
//           Using useEffect to do the GET AND POST >>>>>>>> API REST 

useEffect(()=>{

	function getApi(){
		return fetch(`https://assets.breatheco.de/apis/fake/todos/user/${userName}`)
		.then(res =>{
			if(!res.ok){
				console.log('MEEEEEP problem with fetch GET')
				throw Error(res.statusText);
			}
			return res.json();
		})
		.catch(error => {
			console.log('Error on the fetch GET', error);
			return false
		})
	}

	function postApi(){
	return fetch(`https://assets.breatheco.de/apis/fake/todos/user/${userName}`, {
		method: "POST",
		body: JSON.stringify([]),
		headers: {
			"Content-Type": "application/json"
		}
		})
		.then(res =>{
			if(!res.ok){
				console.log("MEEEEEP problem with fetch POST")
				throw Error(res.statusText);
			}
			return res.json();
		})
		.catch(error => {
			console.log('Error on the fetch POST', error);
			return false
		})
	}
	const getUserList = async () => {

		let userList = []
		let getFetchResult = await getApi()
		
		if(!getFetchResult){
			await postApi()
		}else{
			userList = getFetchResult
		}
		setTodoList(userList)
	}
	getUserList();
},[]);


const newItem = (value) =>{
	return {
		label: value,
		done: false
	}
}

// FUNCTION THAT ALLOWS PRESS ENTER CREATE AN ARRAY WITH THE VALUE OF THE INPUT

const pressEnterToInput = async(evt) =>{
	if(evt.key === 'Enter' && inputValue !== '')
		{
		const item = newItem(inputValue);
		const newTodoList = [...todoList, item]
		setTodoList(newTodoList)
	
		fetch(`https://assets.breatheco.de/apis/fake/todos/user/${userName}`, {
			method: "PUT",
			body: JSON.stringify(
				newTodoList),
			headers: {
			"Content-Type": "application/json"
			}
		})
		.then(resp => {
			console.log(resp.ok); // will be true if the response is successfull
			console.log(resp.status); // the status code = 200 or code = 400 etc.
			console.log(resp.text()); // will try return the exact result as string
			return resp; // (returns promise) will try to parse the result as json as return a promise that you can .then for results
		})
		.catch(error => {
			//error handling
			console.log(error);
		});

		setInputValue("")
		}
	}



	// FUNCTION THAT DELETES TASKS FROM THE TODO LIST
	const deleteTask= async (e)=>
	{
		const newListOfTodos= todoList.filter((item, idx)=>idx !== parseInt(e.target.id))
		setTodoList(newListOfTodos)
		fetch(`https://assets.breatheco.de/apis/fake/todos/user/${userName}`, {
			method: "PUT",
			body: JSON.stringify(newListOfTodos),
			headers: {
				"Content-Type": "application/json"
			}
			})
			.then(response =>{
				if(!response.ok){
					console.log("Response from PUT is not ok")
					throw Error(response.statusText);
				}
				return response.json();
			})
			.then(
				console.log("User list initialized")
				)
			.catch(error => {
				console.log('Looks like there was a problem doing PUT: \n', error);
				return false
			})
	}


	//FUNCTION THAT DELETES TASKS FROM THE API
	const deleteTaskApi = async () =>{
		fetch(`https://assets.breatheco.de/apis/fake/todos/user/${userName}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json"
			}
		})
		setTodoList([])
		await fetch(`https://assets.breatheco.de/apis/fake/todos/user/${userName}`, {
			method: "POST",
			body: JSON.stringify([]),
			headers: {
				"Content-Type": "application/json"
			}
			})
			.then(response =>{
				if(!response.ok){
					console.log("Response from POST is not ok")
					throw Error(response.statusText);
				}
				return response.json();
			})
			.then(
				console.log("User list initialized")
				)
			.catch(error => {
				console.log('Looks like there was a problem doing POST: \n', error);
				return false
			})	
	}
	

	// CREATING THE TASK THAT DISPLAYS AS "LI's" IN THE PAGE
	const listOfTodos= todoList.map((task, index)=>
	{
	return <li className="list-group-item d-flex justify-content-between" key={index}>{task.label}
	<button id={index} className="button btn-close justify-content-end"  aria-label="Close" onClick={deleteTask}></button>
	</li>
	})
	
	return (
		<div>
			<h1 className="text-center my-3">Todos</h1>
			<ul className="list-group">
				<li className="list-group-item"><input onKeyDown={pressEnterToInput} onChange={ e=> setInputValue(e.target.value)} value={inputValue} type="text" className="form-control" placeholder="Add a task to do" aria-label="Recipient's username" aria-describedby="basic-addon2"/></li>
				{listOfTodos}
				{(todoList.length > 0) ? <li className="list-group-item"><b>{todoList.length}</b> tasks to do!</li> : null }
			</ul>
			<div className="d-flex justify-content-center">
			{todoList.length > 0 ? <button onClick={deleteTaskApi} type="button" className="mx-auto btn btn-danger my-3">Delete all tasks</button> : null }
			</div>
		</div>
	);

};

export default TodoList;
