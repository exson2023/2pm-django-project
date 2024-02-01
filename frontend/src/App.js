import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const baseUrl = process.env.REACT_APP_BASE_URL
  const [todos, setTodos] = useState([]);
  const [editTodo, setEditTodo] = useState(null)
  const [newTodo, setNewTodo] = useState({ 'title': '', 'description': '', 'completed': false });


  useEffect(() => {
    axios.get(baseUrl)
      .then((response) => setTodos(response.data.todos))
      .catch((error) => console.log(error))
  }, [])

  const handleEditTodo = (todo) => {
    setEditTodo(todo)
  }

  const handleUpdateTodo = () => {
    axios.put(`${baseUrl}/${editTodo.id}`, editTodo).then(() => {
      const updateTodo = todos.map((todo) =>
        todo.id === editTodo.id ? editTodo : todo
      );
      setTodos(updateTodo);
      setEditTodo(null);
    })
  }

  const handleToggleComplete = (id) => {
    const updatedTodos = todos.map((todo) => todo.id === id ? { ...todo, completed: !todo.completed } : todo);

    setTodos(updatedTodos)
  }

  const handleInputChange = (e) => {
    const {name, value} = e.target;

    setNewTodo({...newTodo, [name]:value});

  }

  const handleAddTodo = () => {
    axios.post(baseUrl, newTodo).then((response) => {
      setTodos([...todos, response.data]);
      setNewTodo({ 'title': '', 'description': '', 'completed': false })
    })
  }

  const handleDeleteTodo = (id) => {

    axios.delete(`${baseUrl}/${id}`).then(() => {
      setTodos(todos.filter((todo)=> todo.id !== id))
      
    })
  }

  return (
    <div>
      <h1>Todo app</h1>
      <ul>
        {
          todos.map((todo) => (
            <li key={todo.id}>

              <strong style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>{todo.title}</strong> <br />
              <span>{todo.description}</span>
              <button onClick={() => handleToggleComplete(todo.id)}>{todo.completed ? 'Mark Incompleted' : 'Mark Complete'}</button>
              <button onClick={()=>handleDeleteTodo(todo.id)}>Delete</button>
              <button onClick={() => handleEditTodo(todo)}>Edit</button>
            </li>
          ))
        }
      </ul>

      {editTodo && (
        <div>
          <input type="text" name='title' placeholder='Title' value={editTodo.title} onChange={(e) => setEditTodo({ ...editTodo, title: e.target.value })} />
          <input type="text" name='description' placeholder='Description' value={editTodo.description} onChange={(e) => setEditTodo({ ...editTodo, description: e.target.value })} />
          <button onClick={handleUpdateTodo}>Update</button>
        </div>
      )}


      <div>
        <input type="text" name="title" placeholder='title' value={newTodo.title} onChange={handleInputChange} />
        <input type="text" name="description" placeholder='description' value={newTodo.description} onChange={handleInputChange} />

        <button onClick={handleAddTodo}>Add todo</button>
      </div>
    </div>
  );
}

export default App;
