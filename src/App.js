import React, { useState,useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Typography } from '@mui/material'; //to change ListItemText Font-Size
import {
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './App.css';

// to change the textfield bordercolor when it is clicked
const theme = createTheme({
  palette: {
    primary: {
      main: '#fff',
    },
  },components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#79AC78',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#79AC78',
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        outlined: {
          '&.Mui-focused': {
            color: '#618264',
          },
        },
      },
    },
  },
});


const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const TodoApp = () => {
  const [todos, setTodos] = useState(JSON.parse(localStorage.getItem('todos'))||[]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(()=>{
     localStorage.setItem('todos',JSON.stringify(todos));
  },[todos]);

  const addTodo = () => {
    if (newTodo.trim() !== '') {
      setTodos((prevTodos) => {
        // Find the position of the first completed todo
        const firstCompletedIndex = prevTodos.findIndex((todo) => todo.completed);
        // If there are no completed todos, add it to the end
        const insertIndex = firstCompletedIndex === -1 ? prevTodos.length : firstCompletedIndex;
        // Create a new todo
        const todo = {
          id: Date.now(),
          text: newTodo,
          completed: false,
          gradient: `#FF8F8F`,
        };
        // Insert the new todo at the correct position
        return [...prevTodos.slice(0, insertIndex), todo, ...prevTodos.slice(insertIndex)];
      });
      setNewTodo('');
    }
  };
  
  

  const toggleTodo = (id) => {
    setTodos((prevTodos) => {
      const todoIndex = prevTodos.findIndex((todo) => todo.id === id);
      const todo = prevTodos[todoIndex];
      const newTodos = [...prevTodos];
      newTodos.splice(todoIndex, 1); // remove the todo
  
      if (todo.completed) {
        newTodos.unshift({ ...todo, completed: !todo.completed }); // add it back to the top
      } else {
        newTodos.push({ ...todo, completed: !todo.completed }); // add it back to the end
      }
  
      return newTodos;
    });
  };
  
  
  const deleteTodo = (id) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const updatedTodos = reorder(
      todos,
      result.source.index,
      result.destination.index
    );

    setTodos(updatedTodos);
  };

  return (
    
    <ThemeProvider theme={theme}>
      
      <div className="App" style={{ backgroundColor: '#B0D9B1', minHeight: '100vh', padding: '50px' }}>
      <h1 style={{  textAlign: 'center' }}>Todo List</h1>
      <div style={{ justifyContent: 'center', marginRight:'20px',marginBottom: '30px' }}>
        <TextField
          className='add-text'
          label="Add a new todo"
          variant="outlined"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          style={{ marginRight: '10px', height: '40px'  }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              addTodo();
              e.preventDefault();
            }}}
        />
        <Button  style={{backgroundColor: '#79AC78',height: '40px',marginTop: '10px' }} variant="contained"  onClick={addTodo}>
          Add
        </Button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="todos">
          {(provided) => (
            <List {...provided.droppableProps} ref={provided.innerRef}>
              {todos.map((todo, index) => (
                <Draggable key={todo.id} draggableId={todo.id.toString()} index={index}>
                  {(provided) => (
                    <ListItem
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        background: todos.gradient,
                        color: '#fff',
                        borderRadius: '5px',
                        margin: '12px 0',
                        ...provided.draggableProps.style,
                        
                      }}
                    >
                      <Checkbox
                        checked={todo.completed}
                        onChange={() => toggleTodo(todo.id)}
                        color="primary"
                      />
                      <ListItemText
                        primary={
                          <Typography style={{ fontSize: '20px' }}>
                             {todo.text}
                         </Typography>
                         }
                        style={{ textDecoration: todo.completed ? 'line-through' : 'none',fontSize:'1px' }}
                      />
                      <IconButton edge="end" onClick={() => deleteTodo(todo.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItem>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </List>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  </ThemeProvider>
  );
};

export default TodoApp;
