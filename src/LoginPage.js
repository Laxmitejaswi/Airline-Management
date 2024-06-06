import React, { useState } from 'react';
import './LoginPage.css'; // Create and import the CSS file for styling

const LoginPage = () => {
    const [isSignup, setIsSignup] = useState(true);
    const [role, setRole] = useState('passenger');
    const [message, setMessage] = useState('');
    const [logIn , islogIn] = useState(false);

    const handleSignupSubmit = (event) => {
        event.preventDefault();
        const username = event.target.signupUsername.value;
        const email = event.target.signupEmail.value;
        const password = event.target.signupPassword.value;

        // Simulate server-side check for username and email availability
        // Replace with actual server-side logic
        if (username === 'takenUsername') {
            setMessage('Username is already taken. Please choose another.');
        } else if (email === 'takenEmail@example.com') {
            setMessage('This email address is already signed up. If you want to log in, please click here.');
        } else {
            // Proceed with the signup process
            console.log('Signup:', username, email, password, role);
            // Here you would send the signup data to the server
        }
    };

    const handleLoginSubmit = (event) => {
        event.preventDefault();
        const email = event.target.loginEmail.value;
        const password = event.target.loginPassword.value;

        // Add logic to handle login
        console.log('Login:', email, password);
        // Here you would send the login data to the server
    };

    const handleAdminLoginSubmit = (event) => {
        event.preventDefault();
        const email = event.target.adminLoginEmail.value;
        const password = event.target.adminLoginPassword.value;
    };

    const handleRoleChangeAdmin = (event) => {
        setRole(event.target.value);
        setIsSignup(false);
    };

    const handleRoleChangePass = (event) => {
        setRole(event.target.value);
        setIsSignup(true);
    };

    return (
        <div id="outerContainer">
            <div className="container" id="loginPage">
                {isSignup && (!logIn) ? (
                    <div id="signupContainer" className="active">
                        <h2>Signup</h2>
                        <form id="signupForm" onSubmit={handleSignupSubmit}>
                            <input type="text" name="signupUsername" placeholder="Username" required />
                            <input type="password" name="signupPassword" placeholder="Password" required />
                            <input type="email" name="adminLoginEmail" placeholder="Email Address" required />
                            <div className="role-selection">
                                <label>
                                    <input
                                        type="radio"
                                        name="role"
                                        value="admin"
                                        checked={role === 'admin'}
                                        onChange={handleRoleChangeAdmin}
                                    /> Admin
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="role"
                                        value="passenger"
                                        checked={role === 'passenger'}
                                        onChange={handleRoleChangePass}
                                    /> Passenger
                                </label>
                            </div>
                            <button type="submit" id="button1">Sign Up</button>
                        </form>
                        <div className="message" id="signupMessage">{message}</div>
                        <p className="message">Already a user? <a onClick={() => {setIsSignup(false); islogIn(true)}}>Log in</a></p>
                    </div>
                ) : (role === 'admin' ?(
                    <div id="adminLoginContainer" className="active">
                        <h2>Admin Login</h2>
                        <form id="adminLoginForm" onSubmit={handleAdminLoginSubmit}>
                            <input type="text" name="signupUsername" placeholder="Username" required />
                            <input type="password" name="adminLoginPassword" placeholder="Password" required />
                            <div className="role-selection">
                                <label>
                                    <input
                                        type="radio"
                                        name="role"
                                        value="admin"
                                        checked={role === 'admin'}
                                        onChange={handleRoleChangeAdmin}
                                    /> Admin
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="role"
                                        value="passenger"
                                        checked={role === 'passenger'}
                                        onChange={handleRoleChangePass}
                                    /> Passenger
                                </label>
                            </div>
                            <button type="submit">Login</button>
                        </form>
                    </div>
                ): (
                    <div id="loginContainer" className="active">
                        <h2>Login</h2>
                        <form id="loginForm" onSubmit={handleLoginSubmit}>
                            <input type="email" name="loginEmail" placeholder="Email Address" required />
                            <input type="password" name="loginPassword" placeholder="Password" required />
                            <div className="role-selection">
                                <label>
                                    <input
                                        type="radio"
                                        name="role"
                                        value="admin"
                                        checked={role === 'admin'}
                                        onChange={handleRoleChangeAdmin}
                                    /> Admin
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="role"
                                        value="passenger"
                                        checked={role === 'passenger'}
                                        onChange={handleRoleChangePass}
                                    /> Passenger
                                </label>
                            </div>
                            <button type="submit" className='button1'>Login</button>
                        </form>
                        <p className="message">Already not a user? <a onClick={() => {setIsSignup(true); islogIn(false)}}>Sign up</a></p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LoginPage;
