// https://www.youtube.com/watch?v=w7ejDZ8SWv8&t=5764s&ab_channel=TraversyMedia
import Header from "./components/Header";
import Tasks from "./components/Tasks";
import AddTasks from "./components/AddTasks";
import {useState, useEffect} from "react";

const App = () => {

    const [showAddTask, setShowAddTask] = useState(false)

    const [tasks, setTasks] = useState([])

    useEffect(() => {
        const getTasks = async () => {
            const tasksFromServer = await fetchTasks()
            setTasks(tasksFromServer)
        }
        getTasks()
    }, [])

    const fetchTasks = async () => {
        const response = await fetch('http://localhost:5000/tasks')
        const data = await response.json()

        return data
    }

    const fetchTask = async (id) => {
        const response = await fetch(`http://localhost:5000/tasks/${id}`)
        const data = await response.json()

        return data
    }

    const addTask = async (task) => {
        const  response = await fetch('http://localhost:5000/tasks', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(task)
        })

        const data = await response.json()

        setTasks([...tasks, data])
    }

    const deleteTask = async (id) => {
        await fetch(`http://localhost:5000/tasks/${id}`, {method: 'DELETE'})

        setTasks(tasks.filter((task) => task.id !== id))
    }

    const toggleReminder = async (id) => {
        const taskToToggle = await fetchTask(id)
        const updTask = {...taskToToggle, reminder: !taskToToggle.reminder}

        const response = await fetch (`http://localhost:5000/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(updTask)
        })

        const data = await response.json()

        setTasks(tasks.map(
            (task) => task.id === id
                ? {
                    ...task,
                    reminder: data.reminder
                }
                : task
        ))
    }

    return (
        <div className="container">
            <Header onAdd={() => setShowAddTask(!showAddTask)} showAdd={showAddTask}></Header>
            {showAddTask && <AddTasks onAdd={addTask}></AddTasks>}
            {
                tasks.length > 0
                    ? <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder}/>
                    : 'No Tasks To Show'
            }
        </div>
    );
}

export default App;
