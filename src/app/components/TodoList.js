"use client";

export default function TodoList({ todos, toggleTodo, deleteTodo }) {
    return (
        <ul>
            {todos.map((todo) => (
                <li key={todo.id} className={todo.completed ? "completed" : ""}>
                    <span onClick={() => toggleTodo(todo.id)}>{todo.text}</span>
                    <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                </li>
            ))}
        </ul>
    );
}
