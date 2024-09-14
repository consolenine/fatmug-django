import React, { useState } from 'react';
import { Formik, Field, Form } from 'formik';
import { Link as useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../axiosConfig';
import Cookies from 'js-cookie';
import { useAuth } from '../../contexts/AuthContext';

import {
    Box, Button, Checkbox, Flex, FormControl,
    FormLabel, FormErrorMessage, Input, VStack, 
    CircularProgress, Alert, AlertIcon, AlertDescription, Text
} from "@chakra-ui/react";

  
const Login = ({ onClose }) => {
    const navigate = useNavigate();
    const { setUser } = useAuth();
    const [ processing, setProcessing ] = useState(false);

    return (
        <Formik
            initialValues={{
                email: '',
                password: '',
                rememberMe: false,
            }}

            onSubmit={ async (values, { setSubmitting, setErrors }) => {
                setProcessing(true);
                try {
                    const response = await axiosInstance.post('/accounts/login/', {
                        username: values.email,
                        password: values.password,
                    }, {
                        withCredentials: false
                    });
                    // Raise an error if the response status is not 200
                    if (response.status !== 200) {
                        if (response.detail) {
                            throw new Error(response.detail);
                        }
                    }
                    if (response.data.user) {
                        setUser(response.data.user);
                        Cookies.set('token', response.data.token, { expires: new Date(response.data.expiry), sameSite: 'Lax' });
                        onClose();
                    }

                } catch (error) {
                    // Handle login errors (e.g., show a message to the user)
                    setErrors({ general: "Unable to login" });
                } finally {
                    setSubmitting(false);
                    setProcessing(false);
                }
            }}
        >
            {({ handleSubmit, errors, touched }) => (
                <Form onSubmit={handleSubmit}>
                    <VStack spacing={4} align="flex-start">
                        {errors.general && (
                            <Alert status="error" variant="solid">
                                <AlertIcon />
                                <AlertDescription>{errors.general}</AlertDescription>
                            </Alert>
                        )}
                        <FormControl w={[300,400,500]} isInvalid={!!errors.email && touched.email}>
                            <FormLabel htmlFor="email">Email Address</FormLabel>
                            <Field
                                as={Input}
                                id="email"
                                name="email"
                                type="email"
                                variant="filled"
                                p={6}
                                validate={(value) => {
                                    let error;
                                        
                                    if (!value) {
                                        error = "Email is required";
                                    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
                                        error = "Invalid email address";
                                    }

                                    return error;
                                }}

                            />
                            <FormErrorMessage>
                                {errors.email}
                            </FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={!!errors.password && touched.password}>
                            <FormLabel htmlFor="password">Password</FormLabel>
                            <Field
                                as={Input}
                                id="password"
                                name="password"
                                type="password"
                                variant="filled"
                                p={6}
                                validate={(value) => {
                                    let error;

                                    if (value.length < 6) {
                                        error = "Password must contain at least 6 characters";
                                    }

                                    return error;
                                }}
                            />
                            <FormErrorMessage>{errors.password}</FormErrorMessage>
                        </FormControl>
                        <Button type="submit" colorScheme="red" width="full">
                            {processing ? (
                                <>
                                Logging in
                                <CircularProgress isIndeterminate size="24px" color="white" />
                                </>
                            ) : (
                                "Login"
                            )}
                        </Button>
                    </VStack>
                </Form>
            )}
            
        </Formik>
    );
}


export default Login;