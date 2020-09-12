import React, { useState } from "react";
import Base from "../core/Base";
import { Link, Redirect } from "react-router-dom";
import { signin, authenticate, isAuthenticated } from "../auth/helper";

const Signin = () => {
  const [values, setValues] = useState({
    name: "",
    email: "salonidarji3335@gmail.com",
    password: "saloni",
    error: "",
    success: false,
    loading: false,
    didRedirect: false,
  });

  const {
    name,
    email,
    password,
    error,
    success,
    loading,
    didRedirect,
  } = values;
  const handleChange = (name) => (event) => {
    setValues({ ...values, error: false, [name]: event.target.value });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: false, loading: true });
    signin({ email, password })
      .then((data) => {
        console.log(("DATA: ", data));

        if (data.token) {
          let sessionToken = data.token;
          authenticate(sessionToken, () => {
            console.log("token added");
            setValues({
              ...values,
              didRedirect: true,
            });
          });
        } else {
          setValues({
            ...values,
            loading: false,
          });
        }
      })
      .catch((e) => console.log(e));
  };

  const performRedirect = () => {
    if (isAuthenticated()) {
      return <Redirect to="/" />;
    }
  };

  const loadingMessage = () => {
    return (
      loading && (
        <div className="alert alert-info">
          <h2>Loading...</h2>
        </div>
      )
    );
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

  const signInForm = () => {
    return (
      <div className="col-md-6 offset-sm-3 text-left">
        <form>
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
    <Base title="Signin page" description="ecom website">
      {loadingMessage()}
      {signInForm()}
      <p className="text-white text-center">Welcome to Signin</p>
      {JSON.stringify(values)}
      {performRedirect()}
    </Base>
  );
};
export default Signin;
