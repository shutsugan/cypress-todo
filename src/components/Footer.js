import React from "react";
import { Link } from "react-router-dom";

export default (props) => {
  const todosCount = props.todos.filter((todo) => !todo.isComplete).length;
  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{todosCount}</strong> {todosCount > 1 ? "todos" : "todo"} left
      </span>
      <ul className="filters">
        <li>
          <Link to="/">All</Link>
        </li>{" "}
        <li>
          <Link to="/active">Active</Link>
        </li>{" "}
        <li>
          <Link to="/completed">Completed</Link>
        </li>
      </ul>
    </footer>
  );
};
