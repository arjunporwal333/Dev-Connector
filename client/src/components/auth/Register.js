import React, { Fragment, useState } from 'react';
import { Link, Redirect } from "react-router-dom"
import { connect } from "react-redux";
import { SetAlert } from "../../flux/actions/alert";
import { RegisterAccount } from "../../flux/actions/auth";
import PropTypes from 'prop-types'

const Register = ({ SetAlert, RegisterAccount, auth: { isAuthenticated } }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");

    const onSubmit = async (e) => {
        e.preventDefault();
        if (password2 !== password) {
            SetAlert('Password do not match', 'danger');
        }
        else {
            const formData = {
                name,
                email,
                password
            }
            RegisterAccount(formData);
        }
    }
    if (isAuthenticated) {
        return <Redirect to="/dashboard"></Redirect>
    }
    return (
        <Fragment>
            <h1 className="large text-primary">Sign Up</h1>
            <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
            <form className="form" onSubmit={e => onSubmit(e)}>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Name"
                        name="name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="email"
                        placeholder="Email Address"
                        name="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                    <small className="form-text">This site uses Gravatar so if you want a profile image, use a Gravatar email</small>
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        minLength="6"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        name="password2"
                        minLength="6"
                        value={password2}
                        onChange={e => setPassword2(e.target.value)}
                        required
                    />
                </div>
                <input type="submit" className="btn btn-primary" value="Register" />
            </form>
            <p className="my-1">
                Already have an account? <Link to="/login">Sign In</Link>
            </p>
        </Fragment>
    )
}

Register.propTypes = {
    SetAlert: PropTypes.func.isRequired,
    RegisterAccount: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
}
const mapStatetoProps = state => ({
    auth: state.auth
})
export default connect(mapStatetoProps, { RegisterAccount, SetAlert })(Register);
