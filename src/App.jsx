import { useCallback, useRef, useEffect } from 'react';
import { v4 } from 'uuid';

import useLocalStorage from './useLocalStorage';

function App() {
	const [todos, setTodos] = useLocalStorage('todos', []);

	const addTodo = (e) => {
		e.preventDefault();
		const todoObj = {
			id: v4(),
			task: e.target.task.value,
			date: Date.now(),
		};
		setTodos([...todos, todoObj]);
		e.target.reset();
	};

	return (
		<div className="p-2">
			<h1 className="text-2xl font-bold">TODO.</h1>
			<form className="flex h-12 bg-dark-02 my-2" onSubmit={addTodo}>
				<input
					type="text"
					name="task"
					placeholder="Add a task"
					autoComplete="off"
					className="bg-transparent outline-none w-full px-2"
				/>
				<button type="submit" className="bg-green-500 px-4">
					Add
				</button>
			</form>
			<ul className="list-none space-y-2">
				{todos
					.sort((a, b) => a.date < b.date)
					.map((item) => {
						return <Task key={item.id} setTodos={setTodos} {...item} />;
					})}
			</ul>
		</div>
	);
}

function Task({ id, task, date, setTodos }) {
	const textRef = useRef(null);

	useEffect(() => {
		if (textRef) {
			textRef.current.onblur = () => {
				textRef.current.contentEditable = false;
			};
		}
	}, [textRef]);

	const editHandler = (e) => {
		setTodos((todos) => {
			return [...todos].map((todo) => {
				if (todo.id === id) {
					todo.task = e[0].target.outerText;
					return todo;
				}
				return todo;
			});
		});
	};
	const deleteHandler = () => {
		setTodos((todos) => todos.filter((item) => item.id !== id));
	};
	const toggleEditing = () => {
		textRef.current.contentEditable = true;
		textRef.current.focus();
	};

	const debounce = useCallback(() => {
		let timer;
		return (...args) => {
			if (timer) {
				clearTimeout(timer);
			}
			timer = setTimeout(() => {
				timer = null;
				editHandler(args);
			}, 500);
		};
	}, []);

	return (
		<li className="w-full bg-dark-01 px-2 pt-1">
			<p onInput={debounce()} ref={textRef} className="break-words">
				{task}
			</p>
			<div className="flex items-center">
				<p className="opacity-[75%]">{new Date(date).toLocaleDateString()}</p>
				<div className="ml-auto w-max">
					<button className="p-2 bg-yellow-500" onClick={toggleEditing}>
						EDIT
					</button>
					<button className="p-2 bg-rose-500" onClick={deleteHandler}>
						DELETE
					</button>
				</div>
			</div>
		</li>
	);
}

export default App;
