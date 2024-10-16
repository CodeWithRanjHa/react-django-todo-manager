import React, { useEffect, useState } from 'react';
import axios from 'axios';

import iconCross from './assets/icon-cross.svg';
// Remove the theme icons since we're using the toggle switch now

const Todo = () => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        // Fetch todos from Django backend
        axios.get('http://127.0.0.1:8000/')
            .then(response => {
                setTodos(response.data);
            })
            .catch(error => {
                console.error('Error fetching todos:', error);
            });
    }, []);

    const handleNewTodo = (e) => {
        e.preventDefault();
        if (newTodo.trim() === '') return;

        axios.post('http://127.0.0.1:8000/add-todo/', { title: newTodo, completed: false })
            .then(response => {
                setTodos([...todos, response.data]);
                setNewTodo('');
            })
            .catch(error => {
                console.error('Error adding todo:', error);
            });
    };

    const handleTodoToggle = (id, completed) => {
        axios.put(`http://127.0.0.1:8000/todos/${id}/`, { completed: !completed })
            .then(response => {
                setTodos(todos.map(todo => (todo.id === id ? response.data : todo)));
            })
            .catch(error => {
                console.error('Error updating todo:', error);
            });
    };

    const handleDeleteTodo = (id) => {
        axios.delete(`http://127.0.0.1:8000/delete/${id}/`)
            .then(() => {
                setTodos(todos.filter(todo => todo.id !== id));
            })
            .catch(error => {
                console.error('Error deleting todo:', error);
            });
    };

    const handleClearCompleted = () => {
        const completedTodos = todos.filter(todo => todo.completed);
        const deletePromises = completedTodos.map(todo => 
            axios.delete(`http://127.0.0.1:8000/delete/${todo.id}/`)
        );

        Promise.all(deletePromises)
            .then(() => {
                setTodos(todos.filter(todo => !todo.completed));
            })
            .catch(error => {
                console.error('Error clearing completed todos:', error);
            });
    };

    const handleThemeToggle = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    };

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    return (
        <div>
            <div className="app-container">
                <header className="title">
                    <h1>Todo</h1>
                    {/* Toggle Switch for Theme */}
                    <label className="switch">
                        <input 
                            type="checkbox" 
                            className="input__check" 
                            checked={theme === 'light'} 
                            onChange={handleThemeToggle} 
                        />
                        <span className="slider"></span>
                    </label>
                </header>

                <form className="todo-form" onSubmit={handleNewTodo}>
                    <input
                        type="text"
                        value={newTodo}
                        onChange={(e) => setNewTodo(e.target.value)}
                        placeholder="Create a new todo..."
                    />
                    <button type="submit">Add</button>
                </form>

                <ul className="todo-container">
                    {todos.map(todo => (
                        <li key={todo.id} className="todo-item">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={todo.completed}
                                    onChange={() => handleTodoToggle(todo.id, todo.completed)}
                                />
                                <span className={`checkbox-custom ${todo.completed ? 'checked' : ''}`}></span>
                            </label>
                            <p className={todo.completed ? 'completed' : ''}>{todo.title}</p>
                            <button className="delete-btn" onClick={() => handleDeleteTodo(todo.id)}>
                                <img src={iconCross} alt="delete-icon" />
                            </button>
                        </li>
                    ))}
                </ul>

                <footer className="todo-footer">
                    <p>{todos.filter(todo => !todo.completed).length} items left</p>
                    <button onClick={handleClearCompleted}>Clear Completed</button>
                </footer>
            </div>
        </div>
    );
};

export default Todo;
