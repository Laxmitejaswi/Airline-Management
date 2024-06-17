import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'; 

const LoginPage = ({ setIsLoggedIn }) => {
    const [isSignup, setIsSignup] = useState(true);
    const [role, setRole] = useState('passenger');
    const [message, setMessage] = useState('');
    const [logIn, setLogIn] = useState(false);
    const navigate = useNavigate();

    const handleSignupSubmit = async (event) => {
        event.preventDefault();
        const username = event.target.signupUsername.value;
        const email = event.target.signupEmail.value;
        const password = event.target.signupPassword.value;
        const name = event.target.signupName.value;
        const contact = event.target.signupContact.value;

        try {
            const response = await fetch(`https://airline-management-2.onrender.com/api/passenger/register?username=${username}&password=${password}&email=${email}&name=${name}&contact=${contact}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password, email , name , contact }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Signup failed');
            }
            localStorage.setItem('token', true);
            localStorage.setItem('username', username);
            setIsLoggedIn(true);
            navigate(-1);
        } catch (error) {
            setMessage(error.message || 'Signup failed. Please try again.');
        }
    };

    const handleLoginSubmit = async (event) => {
        event.preventDefault();
        const username = event.target.loginUsername.value;
        const password = event.target.loginPassword.value;

        try {
            const response = await fetch(`https://airline-management-2.onrender.com/api/passenger/authenticate?username=${username}&password=${password}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }
            localStorage.setItem('token', true);
            localStorage.setItem('username', username);
            setIsLoggedIn(true);
            navigate(-1);
        } catch (error) {
            setMessage(error.message || 'Login failed. Please try again.');
        }
    };

    const handleAdminLoginSubmit = async (event) => {
        event.preventDefault();
        const username = event.target.adminUsername.value;
        const password = event.target.adminLoginPassword.value;

        try {
            const response = await fetch(`https://airline-management-2.onrender.com/api/admin/authenticate?username=${username}&password=${password}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Admin login failed');
            }
            navigate('/Admin');
        } catch (error) {
            setMessage(error.message || 'Admin Login failed. Please try again.');
        }
    };

    const handleRoleChangeAdmin = () => {
        setRole('admin');
        setIsSignup(false);
    };

    const handleRoleChangePass = () => {
        setRole('passenger');
        setIsSignup(true);
    };

    return (
        <div id="outerContainer">
            <div className="container" id="loginPage">
                {isSignup && !logIn ? (
                    <div id="signupContainer" className="active">
                        <h2 className='signUp'>Signup</h2>
                        <form id="signupForm" onSubmit={handleSignupSubmit}>
                            <input type="text" name="signupUsername" placeholder="Username" required />
                            <input type="password" name="signupPassword" placeholder="Password" required />
                            <input type="email" name="signupEmail" placeholder="Email Address" required />
                            <input type="text" name="signupName" placeholder="Name" required />
                            <input type="text" name="signupContact" placeholder="Phone Number" required />
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
                        <div className="message_2" id="signupMessage">{message}</div>
                        <p className="message_2">Already a user? <a onClick={() => { setIsSignup(false); setLogIn(true); }}>Log in</a></p>
                    </div>
                ) : (role === 'admin' ? (
                    <div id="adminLoginContainer" className="active">
                        <h2 className='signUp'>Admin Login</h2>
                        <form id="adminLoginForm" onSubmit={handleAdminLoginSubmit}>
                            <input type="text" name="adminUsername" placeholder="Username" required />
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
                            <button type="submit" >Login</button>
                        </form>
                        <div className="message_2" id="adminLoginMessage">{message}</div>
                    </div>
                ) : (
                    <div id="loginContainer" className="active">
                        <h2 className='signUp'>Login</h2>
                        <form id="loginForm" onSubmit={handleLoginSubmit}>
                            <input type="text" name="loginUsername" placeholder="Username" required />
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
                        <div className="message_2" id="loginMessage">{message}</div>
                        <p className="message_2">Not a user yet? <a onClick={() => { setIsSignup(true); setLogIn(false); }}>Sign up</a></p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LoginPage;
