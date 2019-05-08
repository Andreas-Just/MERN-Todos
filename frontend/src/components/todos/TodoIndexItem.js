import "./todo_index_item.css";

import React, { useState } from "react";

import { Button } from "reactstrap";
import PropTypes from "prop-types";

export default function TodoIndexItem({
  todo,
  user,
  currentUserId,
  isDeleting,
  editTodo,
}) {
  let editBtn = null;
  let deleteBtn = null;
  let checkBox = null;

  const [isLoading, setIsLoading] = useState(false);

  async function handleToggle() {
    setIsLoading(true);
    await editTodo(todo._id, { ...todo, complete: !todo.complete });
    setIsLoading(false);
  }

  if (todo.user === currentUserId) {
    editBtn = (
      <Button disabled={isDeleting || isLoading} todoid={todo._id}>
        Edit
      </Button>
    );
    deleteBtn = (
      <Button disabled={isDeleting || isLoading} todoid={todo._id}>
        Delete
      </Button>
    );
    checkBox = (
      <input
        onChange={handleToggle}
        type="checkbox"
        checked={todo.complete}
        disabled={isDeleting || isLoading}
      />
    );
  }
  return (
    <li className="todo">
      {user.username} has to {todo.content} {editBtn} {deleteBtn} {checkBox}
    </li>
  );
}

TodoIndexItem.propTypes = {
  todo: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  currentUserId: PropTypes.string.isRequired,
  isDeleting: PropTypes.bool.isRequired,
  editTodo: PropTypes.func.isRequired,
};
