import {
    Flex, Text, Link
} from "@chakra-ui/react";

const Footer = () => {
    return (
        <Flex
            as="footer"
            align="center"
            justify="center"
            wrap="wrap"
            padding={3}
            color="gray.800"
            borderTop="1px"
            gap={4}
        >
            <Text align="center">
                This is a demo page for Fatmug assignmet by &nbsp;
                <Link href="https://shashankdeep.com" isExternal color="blue.400">Shshnk Deep</Link>
            </Text>
        </Flex>
    );
}

export default Footer;