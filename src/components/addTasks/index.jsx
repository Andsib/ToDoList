import React, { useState } from 'react';
import axios from 'axios';

import './addTasks.scss';

const AddTasks = ({ activeTopic }) => {
    const [visibleAddTasks, setVisibleAddTasks] = useState(false);
    const [textAddTasks, setTextAddTasks] = useState('');
    const [loading, setLoading] = useState(false);

    const onClose = () => {
        setVisibleAddTasks(!visibleAddTasks);
        setTextAddTasks('');
    }

    const addTask = () => {
        if (textAddTasks === '') {
            alert('Enter the Task');
            return;
        }
        setLoading(true);
        const newTask = {
            "id": activeTopic.tasks.length === 0 ? 1 : Math.max(...activeTopic.tasks.map(item => {
                return item.id;
            })) + 1,
            "taskText": textAddTasks
        }

        axios.patch(`http://localhost:3001/store/${activeTopic.id}`, {
            "tasks":[...activeTopic.tasks, newTask]
        }).then(()=> {
            onClose();
            window.location.reload();
        })
        .catch(() => {
            alert('Something went wrong!')
        
        })
    }


    return (
        <div className='addTasks__wrapper'>
            {!visibleAddTasks && <button className='addTopics__button addTasks__button' onClick={() => setVisibleAddTasks(!visibleAddTasks)}>{loading ? 'Task Adding...' : '+ Add new Task'}</button>}
            { visibleAddTasks && <div className='addTopics__form addTasks__form'>
                <input
                    className='addTopics__form__text addTasks__text'
                    type='text' placeholder="Enter new Task"
                    value={textAddTasks} onChange={e => setTextAddTasks(e.target.value)}>
                </input>
                <div className='addTasks__buttons'>
                    <button onClick={() => loading ? false : addTask()} className='addButton addTasks__addButton'>Add Task</button>
                    <button onClick={onClose} className='addButton addTasks__cancelButton'>Cancel</button>
                </div>
            </div>
            }
        </div>
    )
}

export default AddTasks;