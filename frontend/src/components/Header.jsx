import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

import {
    Box, Flex, Heading, Image, Button, Icon, FormControl, Input,
    ButtonGroup, useDisclosure, Modal, ModalOverlay, ModalContent, 
    ModalCloseButton, ModalHeader, Text, Link
} from "@chakra-ui/react";
import {
    IconBrandGithubFilled,
    IconMenu,
    IconUpload,
} from "@tabler/icons-react";

import { useAuth } from '../contexts/AuthContext';
import { axiosInstance } from '../axiosConfig';
import Cookies from 'js-cookie';

import Login from './forms/Login';
import SignUp from './forms/SignUp';
import Upload from './forms/Upload';

const Header = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [modalContent, setModalContent] = React.useState("login");
    const [menuCollapsed, setMenuCollapsed] = React.useState(false);
    const {userData, setUser} = useAuth();

    const openSignIn = () => {
        setModalContent("login");
        onOpen();
    }

    const openSignUp = () => {
        setModalContent("signup");
        onOpen();
    }

    const openUpload = () => {
        setModalContent("upload");
        onOpen();
    }

    const handleLogout = () => {
        axiosInstance.post('/accounts/logout/').then(() => {
            Cookies.remove('token');
            localStorage.removeItem('user');
            setUser(null);
            window.location.href = '/';
        }).catch((error) => {
            console.log(error);
        });
    }

    const renderModalContent = () => {
        switch (modalContent) {
            case "login":
                return <Login onClose={onClose} />;
            case "signup":
                return <SignUp onClose={onClose} />;
            case "upload":
                return <Upload onClose={onClose} />;
            default:
                return null; // Optional: Handle unknown modal types
        }
    };

    return (
        <>
        <Flex
            as="header"
            position="sticky"
            align="center"
            justify="space-between"
            wrap="wrap"
            p={3}
            gap={4}
            bg="black"
            color="white"
        >
            <Link as={RouterLink} to={"/"}>
                <Heading size="sm">
                    Fatmug Django
                </Heading>
            </Link>
            <Button 
                variant="outline" 
                colorScheme="black" 
                display={{ base: "flex", lg: "none" }}
                onClick={() => setMenuCollapsed(!menuCollapsed)}
            >
                <Icon as={IconMenu} name="menu" />
            </Button>
            {
                !menuCollapsed && (
                    <ButtonGroup 
                        display="flex" 
                        top="100%"
                        right="0px"
                        position={{ base: "absolute", lg: "relative" }}
                        flexDirection={{ base: "column", lg: "row" }} 
                        alignItems="center"
                        bg={{ base: "black", lg: "transparent" }}
                        p={{ base: 4, lg: 0 }}
                        gap={{ base: 4, lg: 2 }}
                    >
                        <Link href="https://github.com/consolenine/fatmug-django" target='_blank'>
                            <Flex alignItems="center" gap={2}>
                                <Icon as={IconBrandGithubFilled} name="github" fontSize="2xl" />
                                <Text as="span" fontWeight="bold" size="md" letterSpacing={"-.1rem"}>
                                    On GitHub
                                </Text>
                            </Flex>
                        </Link>
                        {
                            userData ? (
                                <>
                                    <Button colorScheme="red" onClick={openUpload}>
                                        <Icon as={IconUpload} name="upload" />
                                        Upload
                                    </Button>
                                    <Link as={RouterLink} to="/library">
                                        Video Library
                                    </Link>
                                    <Button size="sm" variant="ghost" colorScheme="red" onClick={handleLogout}>
                                        Log Out
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button size="sm" onClick={openSignIn}>
                                        Sign In
                                    </Button> 
                                    <Button size="sm" variant="ghost" colorScheme="white" onClick={openSignUp}>
                                        Sign Up
                                    </Button>
                                </>
                            )
                        }
                    </ButtonGroup>
                )
            }
        </Flex>
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />

            <ModalContent maxW="fit-content" p={[2,3,6]}>
                <ModalCloseButton />
                {
                    renderModalContent()
                }
            </ModalContent>
        </Modal>
        </>
    );
}

export default Header;