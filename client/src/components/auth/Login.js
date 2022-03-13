import React, { Fragment, useState } from 'react';
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { LoginAccount } from "../../flux/actions/auth";
import PropTypes from 'prop-types'

const Login = ({ auth: { isAuthenticated }, LoginAccount }) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onSubmit = async (e) => {
        e.preventDefault();
        const formData = {
            email,
            password
        }
        LoginAccount(formData);
    }

    if (isAuthenticated) {
        return <Redirect to="/dashboard"></Redirect>
    }

    return (
        <Fragment>
            <h1 className="large text-primary">Sign In</h1>
            <p className="lead"><i className="fas fa-user"></i> Sign Into Your Account</p>
            <form className="form" onSubmit={e => onSubmit(e)}>
                <div className="form-group">
                    <input
                        type="email"
                        placeholder="Email Address"
                        name="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </div>
                <input type="submit" className="btn btn-primary" value="Login" />
            </form>
            <p className="my-1">
                Not have an account? <Link to="/register">Sign Up</Link>
            </p>
        </Fragment>
    )
}

Login.propTypes = {
    LoginAccount: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
}

const mapStatetoProps = state => ({
    auth: state.auth
})

export default connect(mapStatetoProps, { LoginAccount })(Login);
