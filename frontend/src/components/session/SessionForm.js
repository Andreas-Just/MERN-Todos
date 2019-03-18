import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import PropTypes from "prop-types";

export default function SessionForm({
  submit,
  btnText,
  history,
  otherText,
  errors,
  clearErrors,
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    submit({ username, password }).then(res => {
      if (res === "success") {
        history.push("/todos");
      }
    });
  }

  useEffect(() => {
    clearErrors();
  }, [history.location.pathname]);

  useEffect(() => {
    const validPaths = ["/signin", "/signup"];
    if (!validPaths.includes(history.location.pathname)) {
      history.push("/signin");
    }
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={username}
        onChange={e => setUsername(e.currentTarget.value)}
        placeholder="Username"
        autoComplete="username"
        required
      />
      {errors.username}
      <br />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.currentTarget.value)}
        placeholder="Password"
        autoComplete="current-password"
        required
      />
      {errors.password}
      <button>{btnText}</button>
      <Link to={`/${otherText}`}>{otherText}</Link>
    </form>
  );
}

SessionForm.propTypes = {
  submit: PropTypes.func.isRequired,
  btnText: PropTypes.string.isRequired,
  otherText: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
  clearErrors: PropTypes.func.isRequired,
};