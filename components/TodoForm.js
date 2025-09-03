import { useState } from 'react';
import styles from '../styles/Home.module.css';

export default function TodoForm({ addTodo }) {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value) return;
    addTodo(value);
    setValue('');
  };

  return (
    <form onSubmit={handleSubmit} className={styles.todoForm}>
      <input
        type="text"
        className={styles.todoInput}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Add a new todo..."
      />
      <button type="submit" className={styles.todoButton}>
        Add Todo
      </button>
    </form>
  );
}