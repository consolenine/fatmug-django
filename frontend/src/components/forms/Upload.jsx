import React, { useRef, useState } from 'react';

import { axiosFilesInstance } from '../../axiosConfig';

import {
    Box, Button, Checkbox, Flex, Text,
    FormControl, FormLabel, Textarea, FormErrorMessage, Link,
    Input, VStack, HStack, useToast, Tooltip, Image, IconButton, Heading, Toast
} from "@chakra-ui/react";

const Upload = ({ onClose }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const fileRef = useRef();
    const formRef = useRef();
    const toast = useToast();
    const toastStatRef = useRef();

    const handleFileChange = (event) => {
        
        const files = Array.from(event.target.files);
    
        setSelectedFile(files[0]);
    
        // Reset the input field after processing the files
        event.target.value = null;
    };

    const handleAddFile = () => {
        fileRef.current.click();
    }

    const handleRemoveFile = () => {
        setSelectedFile(null);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const formData = new FormData();
            formData.append('video_file', selectedFile);
            formData.append('title', selectedFile.name);
            toastStatRef.current = toast({
                title: 'Uploading video...',
                status: 'info',
                duration: null,
            })
            axiosFilesInstance.post(`/vidapp/video/`, formData)
            .then((response) => {
                if (toastStatRef.current) {
                    toast.update(toastStatRef.current, {
                        title: 'Video uploaded successfully',
                        status: 'success',
                        duration: 5000,
                        isClosable: true,
                    })
                }
                onClose();
            }).catch((error) => {
                if (toastStatRef.current) {
                    toast.update(toastStatRef.current, {
                        title: 'Failed to upload video',
                        status: 'error',
                        duration: 5000,
                        isClosable: true,
                    })
                }
            });
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Box flex="1">
            <form ref={formRef} onSubmit={handleSubmit}>
                <VStack spacing={8} align="stretch">
                    <FormControl>
                        <FormLabel display="flex" gap={2} align="center">
                            Video File
                        </FormLabel>
                        <Flex wrap="wrap" gap={4} border="1px dashed" w="100%" p={4} borderColor="gray.500">
                            <Flex 
                                align="center" 
                                justify="center" 
                                direction="column" 
                                bg="primary.50" w="200px" h="150px" 
                                gap={4} p={3} rounded="lg" shadow="lg"
                                cursor="pointer"
                                onClick={() => {handleAddFile()}}
                            >
                                <Text align="center">Allowed file types <br /> .mp4, .mkv, .mov (Less than 250 MB)</Text>
                                <Text align='center'>Click to add</Text>
                            </Flex>
                            {
                                selectedFile != null && (
                                    <Box position="relative" maxW="150px">
                                        {selectedFile.type.startsWith('image/') ? (
                                            <Image src={URL.createObjectURL(selectedFile)} alt={`file-preview-0`} objectFit="cover" w="150px" h="150px" rounded="lg" shadow="lg" />
                                        ) : (
                                            <Box bg="gray.200" w="150px" h="150px" display="flex" alignItems="center" justifyContent="center">
                                                <Text>{selectedFile.name}</Text>
                                            </Box>
                                        )}
                                        <Button size="xs" colorScheme="red" onClick={() => handleRemoveFile()} mt={2}>
                                            Remove
                                        </Button>
                                        <Link href={URL.createObjectURL(selectedFile)} target="_blank" ml="1">
                                            <Button size="xs" colorScheme="primary" mt={2}>
                                                View
                                            </Button>
                                        </Link>
                                    </Box>
                                )
                            }
                        </Flex>
                        <Input ref={fileRef} display="none" id="media" name="media" type="file" accept='.mp4,.mkv,.mov' onInput={handleFileChange} />
                    </FormControl>
                    <HStack mb={4}>
                        <Button p={2} type="submit" colorScheme="red">
                            Start Processing
                        </Button>
                        <Button variant="outline" onClick={onClose} colorScheme="red">
                            Cancel
                        </Button>
                    </HStack>
                </VStack>
            </form>
        </Box>
    );
}

export default Upload;