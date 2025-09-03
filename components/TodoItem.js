import styles from '../styles/Home.module.css';

export default function TodoItem({ todo, toggleComplete, deleteTodo }) {
  return (
    <div className={`${styles.todoItem} ${todo.completed ? styles.completed : ''}`}>
      <div 
        className={styles.todoText}
        onClick={() => toggleComplete(todo.id)}
      >
        {todo.text}
      </div>
      <button 
        onClick={() => deleteTodo(todo.id)}
        className={styles.deleteButton}
      >
        Delete
      </button>
    </div>
  );
}