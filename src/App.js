import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Route, useHistory } from 'react-router-dom';

import List from './components/listTasks';
import Tasks from './components/tasks';

import './app.scss';

function App() {

  const [lists, setLists] = useState();
  const [colors, setColors] = useState();
  const [activeTopic, setActiveTopic] = useState();
  let history = useHistory();

  useEffect(() => {
    axios.get('http://localhost:3001/store').then(({ data }) => {
      setLists(data);
    });
    axios.get('http://localhost:3001/colors').then(({ data }) => {
      setColors(data);
    });
  }, [activeTopic])

  useEffect(() => {
    const listId = history.location.pathname.split('/listTasks/')[1];

    if (lists) {
      const selectedList = lists.find(item => item.id === Number(listId));
      setActiveTopic(selectedList);
    }

  }, [lists, history.location.pathname])

  const onAdd = (obj) => {
    const newList = [...lists, obj];
    setLists(newList);
  }

  const onAddNewTopic = (id, topic) => {
    const newList = lists.map(item => {
      if (item.id === id) {
        item.topic = topic;
      }
      return item;
    });
    setLists(newList);

    axios.patch(`http://localhost:3001/store/${id}`, {
      topic: topic,
    }).catch(() => {
      alert('Something went wrong!')
    })
  }

  const onAddNewTask = (activeTopic, task, taskValue) => {
    activeTopic.tasks.find(item => item.id === task.id).taskText = taskValue;
    const newList = lists.map(item => {
      if (item.id === activeTopic.id) {
        item.tasks = activeTopic.tasks;
      }
      return item;
    });
    setLists(newList);

    axios.patch(`http://localhost:3001/store/${activeTopic.id}`, {
      tasks: activeTopic.tasks
    }).catch(() => {
      alert('Something went wrong!')
    })
  }

  const confirmRemoveTask = (item) => {
    if (window.confirm('Are you sure you want to remove this task?')) {
      const deletedTask = activeTopic.tasks.filter(task => task.id !== item)
      axios.patch(`http://localhost:3001/store/${activeTopic.id}`, {
        tasks: deletedTask
      }).catch(() => {
        alert('Something went wrong!')
      })
    }
  }

  return (
    <>
      {lists && colors &&
        <div className='container'>
          <List onAdd={onAdd} colors={colors} items={lists} onTopic={item => setActiveTopic(item)} activeTopic={activeTopic}
            remove={id => {
              const newList = lists.filter(item => item.id !== id);
              setLists(newList);
            }} />
          <Route exact path='/'>
            <div className='tasks__wrapper'>
              {lists.map((list) =>
                < Tasks key={list.id} activeTopic={list} addNewTitle={onAddNewTopic} addNewTask={onAddNewTask} removeTask={confirmRemoveTask} />
              )
              }
            </div>
          </Route>
          <Route exact path={activeTopic && `/listTasks/${activeTopic.id}`}>
            <Tasks activeTopic={activeTopic} addNewTitle={onAddNewTopic} addNewTask={onAddNewTask} removeTask={confirmRemoveTask} />
          </Route>
        </div >
      }
    </>
  );
}

export default App;