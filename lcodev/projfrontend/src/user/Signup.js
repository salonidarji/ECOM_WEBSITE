import React, { useState } from "react";
import Base from "../core/Base";
import { Link } from "react-router-dom";
import { signup } from "../auth/helper";

const Signup = () => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    error: "",
    success: false,
  });

  const { name, email, password, error, success } = values;
  const handleChange = (name) => (event) => {
    setValues({ ...values, error: false, [name]: event.target.value });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: false });
    signup({ name, email, password })
      .then((data) => {
        console.log("DATA:", data);
        if (data.email === email) {
          setValues({
            ...values,
            name: "",
            email: "",
            password: "",
            error: "",
            success: true,
          });
        } else {
          setValues({
            ...values,
            error: true,
            success: false,
          });
        }
      })
      .catch((e) => console.log(e));
  };

  const successMessage = () => {
    return (
      <div className="row">
        <div className="col-md-6 offset-sm-3 text-left">
          <div
            className="alert alert-success"
            style={{ display: success ? "" : "none" }}
          >
            New Account created Successfully...
            <Link to="/signin">Login</Link> Now.
          </div>
        </div>
      </div>
    );
  };

  const errorMessage = () => {
    return (
      <div className="row">
        <div className="col-md-6 offset-sm-3 text-left">
          <div
            className="alert alert-danger"
            style={{ display: error ? "" : "none" }}
          >
            Check Again... Error occured
          </div>
        </div>
      </div>
    );
  };

  const signUpForm = () => {
    return (
      <div className="col-md-6 offset-sm-3 text-left">
        <form>
          <div className="form-group">
            <label className="text-light">Name</label>
            <input
              className="form-control"
              value={name}
              onChange={handleChange("name")}
              type="text"
            />
          </div>

          <div className="form-group">
            <label className="text-light">Email</label>
            <input
              className="form-control"
              value={email}
              onChange={handleChange("email")}
              type="email"
            />
          </div>

          <div className="form-group">
            <label className="text-light">Password</label>
            <input
              className="form-control"
              value={password}
              onChange={handleChange("password")}
              type="password"
            />
          </div>
          <div className="form-group">
            <button
              onClick={onSubmit}
              className="form-control btn btn-large btn-success"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <Base title="Signup page" description="A signup page">
      {successMessage()}
      {errorMessage()}
      {signUpForm()}

      <p className="text-white text-center">Test of signup page</p>
      {JSON.stringify(values)}
    </Base>
  );
};
export default Signup;
