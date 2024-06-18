import React, { useState } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';

import signinImage from '../assets/signup.jpg';

const cookies = new Cookies();

const initialState = {
    fullName: '',
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    avatarURL: '',
}

const Auth = () => {
    const [form, setForm] = useState(initialState);
    const [isSignup, setIsSignup] = useState(false);

    const [userExists, setUserExists] = useState(false);
    const [userNotExists, setUserNotExists] = useState(false);
    const [usernameLengthError, setUsernameLengthError] = useState(false);
    
    const [passwordIncorrect, setPasswordIncorrect] = useState(false);
    const [passwordLengthError, setPasswordLengthError] = useState(false);
    const [passwordConfirmError, setPasswordConfirmError] = useState(false);
    

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { password, confirmPassword, username } = form;

        // if username is too short
        if(isSignup && username.length < 4) {
            setPasswordConfirmError(false);
            setPasswordLengthError(false);
            setUsernameLengthError(true);
        // if password and confirm password are different
        } else if(isSignup && password != confirmPassword) {
            setPasswordConfirmError(true);
            setPasswordLengthError(false);
            setUsernameLengthError(false);
        // if password is too short
        } else if(isSignup && password.length < 6) {
            setPasswordConfirmError(false);
            setPasswordLengthError(true);
            setUsernameLengthError(false);
        } else {
            try {
                const { username, password, email, avatarURL } = form;
    
                const URL = 'https://messaging-app-b1q0.onrender.com/auth';
    
                const { data : { token, userId, hashedPassword, fullName } } = await axios.post(`${URL}/${isSignup ? 'signup' : 'login'}`, {
                    username, password, fullName: form.fullName, email, avatarURL
                });
    
                cookies.set('token', token);
                cookies.set('username', username);
                cookies.set('fullName', fullName);
                cookies.set('userId', userId);
    
                if(isSignup) {
                    cookies.set('email', email);
                    cookies.set('avatarURL', avatarURL);
                    cookies.set('hashedPassword', hashedPassword);
                };
    
                setUserNotExists(false);
                setUsernameLengthError(false);
                setUserExists(false);
                setPasswordIncorrect(false);
                setPasswordConfirmError(false);
                setPasswordLengthError(false);
    
                window.location.reload();
    
            } catch(error) {
                if(error.response.status == 400) {
                    // if username already exists (on signup)
                    if(isSignup) {
                        console.log('Username already exists');
                        setUserNotExists(false);
                        setPasswordIncorrect(false);
                        setUserExists(true);
                        setPasswordLengthError(false);
                        setUsernameLengthError(false);
                    // if username does not exist (on login)
                    } else {
                        console.log('User does not exist');
                        setUserNotExists(true);
                        setPasswordIncorrect(false);
                        setUserExists(false);
                    }
                // if password is incorrect
                } else if(error.response.status == 500) {
                    console.log('Incorrect password');
                    setUserNotExists(false);
                    setPasswordIncorrect(true);
                    setUserExists(false);
                }
            }
        }    
    };

    const switchMode = () => {
        setUserNotExists(false);
        setPasswordIncorrect(false);
        setUserExists(false);
        setPasswordConfirmError(false);
        setPasswordLengthError(false);

        setIsSignup((prevIsSignup) => !prevIsSignup)
    };

    return (
        <div className='auth__form-container'>
            <div className='auth__form-container_fields'>
                <div className='auth__form-container_fields-content'>
                    <p>{isSignup ? 'Sign Up' : 'Sign In'}</p>
                    <form onSubmit={handleSubmit}>
                        {isSignup && (
                            <div className='auth__form-container_fields-content_input'>
                                <label htmlFor='fullName'>Full Name</label>
                                <input 
                                    name='fullName'
                                    type='text'
                                    placeholder='Full Name'
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}
                        <div className='auth__form-container_fields-content_input'>
                            <label htmlFor='username'>Username</label>
                            <input 
                                name='username'
                                type='text'
                                placeholder='Username'
                                onChange={handleChange}
                                required
                            />
                            <div className='auth__form-container_fields-content-error'>
                                {userNotExists && <p>User does not exist</p>}
                                {userExists && <p>Username already exists</p>}
                                {usernameLengthError && <p>Username must be at least 4 characters long</p>}
                            </div>
                        </div>
                        {isSignup && (
                            <div className='auth__form-container_fields-content_input'>
                                <label htmlFor='email'>Email</label>
                                <input 
                                    name='email'
                                    type='text'
                                    placeholder='Email'
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}
                        {isSignup && (
                            <div className='auth__form-container_fields-content_input'>
                                <label htmlFor='avatarURL'>Avatar URL</label>
                                <input 
                                    name='avatarURL'
                                    type='text'
                                    placeholder='Avatar URL'
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}
                        <div className='auth__form-container_fields-content_input'>
                            <label htmlFor='password'>Password</label>
                            <input 
                                name='password'
                                type='password'
                                placeholder='Password'
                                onChange={handleChange}
                                required
                            />
                            <div className='auth__form-container_fields-content-error'>
                                {passwordIncorrect && <p>Incorrect password</p>}
                                {passwordLengthError && <p>Password must be at least 6 characters long</p>}
                            </div>
                        </div>
                        {isSignup && (
                            <div className='auth__form-container_fields-content_input'>
                                <label htmlFor='confirmPassword'>Confirm Password</label>
                                <input 
                                    name='confirmPassword'
                                    type='password'
                                    placeholder='Confirm Password'
                                    onChange={handleChange}
                                    required
                                />
                                <div className='auth__form-container_fields-content-error'>
                                    {passwordConfirmError && <p>Passwords do not match</p>}
                                </div>
                            </div>
                        )}
                        <div className='auth__form-container_fields-content_button'>
                            <button>{isSignup ? 'Sign Up' : 'Sign In'}</button>
                        </div>
                    </form>
                    <div className='auth__form-container_fields-account'>
                        <p>
                            {isSignup
                             ? 'Already have an account? '
                             : "Don't have an account? "
                            }
                            <span onClick={switchMode}>
                            {isSignup ? 'Sign In' : 'Sign Up'}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
            <div className='auth__form-container_image'>
                <img src={signinImage} alt='sign in' />
            </div>
        </div>
    )
}

export default Auth