import { Link as RouterLink, Outlet } from 'react-router-dom';
import {
    Box, Flex, Heading, Text, ButtonGroup, Button, VStack, Link as ChakraLink
} from "@chakra-ui/react";

import {
    Header, Footer
} from "../components";
import { AuthProvider } from '../contexts/AuthContext';

export default function Root() {

    return (
        <AuthProvider>
            <Flex direction="column" minH="100vh">
                <Header />
                <Box as="main" flex="1" p={3}>
                    <Outlet />
                </Box>
                <Footer />
            </Flex>
        </AuthProvider>
    )
}