import React from "react";

export default (props) => (
  <form onSubmit={props.handleAddTodo}>
    <input
      autoFocus
      type="text"
      className="new-todo"
      value={props.currentTodo}
      onChange={props.handleCurrentTodo}
      placeholder="What needs to be done?"
    />
  </form>
);
