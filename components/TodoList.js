import TodoItem from './TodoItem';
import styles from '../styles/Home.module.css';

export default function TodoList({ todos, toggleComplete, deleteTodo }) {
    return (
        <div className={styles.todoList}>
            {todos.length === 0 ? (
                <p className={styles.emptyMessage}>No todos yet. Add one above!</p>
            ) : (
                todos.map(todo => (
                    <TodoItem
                        key={todo.id}
                        todo={todo}
                        toggleComplete={toggleComplete}
                        deleteTodo={deleteTodo}
                    />
                ))
            )}
        </div>
    );
}