import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList";
import Footer from "./Footer";
import { saveTodo, destroyTodo, updateTodo, loadTodos } from "../lib/service";
import { filterTodos } from "../lib/utils";

export default class TodoApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTodo: "",
      todos: [],
      error: false,
    };

    this.handleCurrentTodo = this.handleCurrentTodo.bind(this);
    this.handleAddTodo = this.handleAddTodo.bind(this);
    this.handleDeleteTodo = this.handleDeleteTodo.bind(this);
    this.handleUpdateTodo = this.handleUpdateTodo.bind(this);
  }

  componentDidMount() {
    loadTodos()
      .then(({ data }) => this.setState({ todos: data }))
      .catch((err) => {
        this.setState({ error: true });
      });
  }

  handleCurrentTodo({ target }) {
    this.setState({ currentTodo: target.value });
  }

  handleAddTodo(event) {
    event.preventDefault();

    const newTodo = {
      name: this.state.currentTodo,
      isComplete: false,
    };

    saveTodo(newTodo)
      .then(({ data }) =>
        this.setState({ todos: this.state.todos.concat(data), currentTodo: "" })
      )
      .catch((err) => this.setState({ error: true }));
  }

  handleDeleteTodo(id) {
    destroyTodo(id).then(() =>
      this.setState({
        todos: this.state.todos.filter((todo) => todo.id !== id),
      })
    );
  }

  handleUpdateTodo(id) {
    const targetTodo = this.state.todos.find((todo) => todo.id === id);
    const updated = {
      ...targetTodo,
      isComplete: !targetTodo.isComplete,
    };

    updateTodo(updated).then(({ data }) => {
      const todos = this.state.todos.map((todo) =>
        todo.id === data.id ? data : todo
      );

      this.setState({ todos });
    });
  }

  render() {
    return (
      <Router>
        <div>
          <header className="header">
            <h1>todos</h1>
            <TodoForm
              currentTodo={this.state.currentTodo}
              handleAddTodo={this.handleAddTodo}
              handleCurrentTodo={this.handleCurrentTodo}
            />
          </header>
          <section className="main">
            <Route
              path="/:filter?"
              render={({ match }) => {
                const todos = filterTodos(
                  match.params.filter,
                  this.state.todos
                );

                return (
                  <TodoList
                    todos={todos}
                    handleDeleteTodo={this.handleDeleteTodo}
                    handleUpdateTodo={this.handleUpdateTodo}
                  />
                );
              }}
            />
          </section>
          {this.state.error && <span className="error">Oh no!</span>}
          <Footer todos={this.state.todos} />
        </div>
      </Router>
    );
  }
}
