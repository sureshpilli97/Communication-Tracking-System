import React, { useEffect, useState } from 'react';
import { TextField, Button, Typography, Box, CircularProgress } from '@mui/material';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { auth, signIn } from '../firebase';
import { useNavigate } from 'react-router-dom';
import CommunicationIcon from './CommunicationIcon';
import { useAuth } from '../App';

const LogIn = () => {
    const [loginError, setLoginError] = useState("");
    const [loder, setLoder] = useState(false);
    const navigate = useNavigate();
    const { setUser } = useAuth();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.role) {
            navigate(user.role === "admin" ? "/admin" : "/user");
        }
    }, [navigate]);

    const validationSchema = Yup.object({
        username: Yup.string().email('Invalid email format').required('Email is required'),
        password: Yup.string().required('Password is required'),
    });

    const handleLogin = (values) => {
        setLoder(true);
        const { username, password } = values;

        signIn(auth, username, password)
            .then((userCredential) => {
                const user = userCredential.user;
                setLoder(false);
                if (user && user.email) {
                    const role = user.email === "admin123@gmail.com" ? "admin" : "user";
                    const userData = { email: user.email, role };
                    localStorage.setItem('user', JSON.stringify(userData));
                    setUser(userData);
                    navigate(`/${role}`);
                }
            })
            .catch((error) => {
                setLoginError("Invalid username or password.");
                console.error(error.message);
                setLoder(false);
            });
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh" bgcolor="#f5f5f5" color={'#000'}>
            <Box
                width={{ xs: '70%', sm: '50%', md: '30%' }}
                padding={4}
                bgcolor="white"
                borderRadius={2}
                boxShadow={3}
            >
                <Box display="flex" justifyContent="center" mb={3}>
                    <Typography variant="h5" fontWeight="bold" component="h1">
                        Log In
                    </Typography>
                </Box>
                <Box mb={2}
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    gap={2}
                >
                    <CommunicationIcon />
                    <Typography variant="h6" component="h3" align="center">
                        Communication Tracking System
                    </Typography>
                </Box>
                {loginError && (
                    <Typography variant="body2" color="error" mb={2} align="center">
                        {loginError}
                    </Typography>
                )}
                <Formik
                    initialValues={{ username: '', password: '' }}
                    validationSchema={validationSchema}
                    onSubmit={handleLogin}
                >
                    {({ errors, touched }) => (
                        <Form>
                            <Box mb={2}>
                                <Field
                                    name="username"
                                    as={TextField}
                                    label="Email"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    helperText={touched.username && errors.username ? errors.username : ''}
                                    error={touched.username && Boolean(errors.username)}
                                />
                            </Box>
                            <Box mb={2}>
                                <Field
                                    name="password"
                                    type="password"
                                    as={TextField}
                                    label="Password"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    helperText={touched.password && errors.password ? errors.password : ''}
                                    error={touched.password && Boolean(errors.password)}
                                />
                            </Box>
                            <Box mb={2}>
                                <Button type="submit" fullWidth variant="contained" sx={{ backgroundColor: '#000' }} disabled={loder}>
                                    {loder ? <CircularProgress color='white' size={24} /> : "Log In"}
                                </Button>
                            </Box>
                        </Form>
                    )}
                </Formik>
            </Box>
        </Box>
    );
};

export default LogIn;
