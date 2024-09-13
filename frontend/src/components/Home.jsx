import { useEffect, useState } from "react";

import {
    Box, Flex, Heading, Text, Button, AspectRatio, SimpleGrid
} from "@chakra-ui/react";

import { axiosInstance } from "../axiosConfig";

export const Home = () => {

    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pages, setPages] = useState({ active: 1, total: 1 });

    useEffect(() => {
        axiosInstance.get(`/vidapp/video/?page=${pages ? pages.active : 1}`)
        .then((response) => {
            setVideos(response.data.results);
            setPages({ ...pages, total: response.data.count });
        }).catch((error) => {
            console.log(error);
        }).finally(() => {
            setLoading(false);
        });
    }, [pages.active]);

    return (
        <Flex direction="column" align="center" justify="center">
            <Heading as="h1" size="2xl" textAlign="center">
                Subtitle Extractor
            </Heading>
            <Text align="center" fontSize="xl" mt={4}>
                A simple tool to extract subtitles from videos.
                Just select your video file and upload. <br /> 
                Create a free account to start!
            </Text>
            <SimpleGrid 
                spacing={4} 
                columns={{ base: 1, md: 2, lg: 4 }}
                mt={8}
                w="100%"
            >
                {videos.map((video) => (
                    <Box key={video.uuid} w="100%">
                        <AspectRatio ratio={16 / 9}>
                            <video controls>
                                <source src={video.video_file} type="video/mp4" />
                            </video>
                        </AspectRatio>
                        <Heading as="h2" size="lg" mt={2}>
                            {video.title}
                        </Heading>
                        <Text>{video.description}</Text>
                    </Box>
                ))}
            </SimpleGrid>
        </Flex>
    );
}