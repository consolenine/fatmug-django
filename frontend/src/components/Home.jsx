import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
    Box, Flex, Heading, Text, Button, ButtonGroup, AspectRatio, SimpleGrid,
    Link, Skeleton
} from "@chakra-ui/react";
import { format } from "date-fns";

import { axiosInstance } from "../axiosConfig";

export const Home = () => {

    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pages, setPages] = useState({ active: 1, total: 1 });
    const pageSize = 20;

    useEffect(() => {
        axiosInstance.get(`/vidapp/video/?page=${pages ? pages.active : 1}&page_size=${pageSize}`)
        .then((response) => {
            setVideos(response.data.results);
            setPages({ ...pages, total: Math.max(Math.ceil(response.data.count / pageSize), 1) });
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
                spacing={[4, 8, 12]} 
                columns={{ base: 1, md: 2, lg: 4 }}
                mt={8}
                w="100%"
            >
            {
                loading ? (
                    Array.from({ length: 8 }).map((_, i) => (
                        <Skeleton key={i} h="200px" rounded="lg" />
                    ))
                ) : (
                    videos.map((video) => (
                        <Box key={video.uuid} w="100%" cursor="pointer">
                            <Link as={RouterLink} to={`/video/${video.uuid}`} _hover={{ color: "red.500" }}>
                                <AspectRatio ratio={16 / 9} rounded="lg" overflow="hidden">
                                    <img src={video.thumbnail} alt={video.title} />
                                </AspectRatio>
                                <Text mt={2} fontSize="sm" fontWeight="500">
                                    {video.title}
                                </Text>
                                <Text mt={2} fontSize="xs">
                                    {format(new Date(video.uploaded_at), "d MMMM yyyy, hh:mm a")}
                                </Text>
                            </Link>
                            <Flex
                                w="100%"
                                mt={4}
                                gap={2}
                                flexWrap="wrap"
                            >
                                {
                                    video.subtitles.map((subtitle) => (
                                        <Box 
                                            key={subtitle.id} 
                                            p={2} px={4} 
                                            rounded="lg" 
                                            bg="gray.200"
                                            cursor="pointer"
                                        >
                                            <Text fontSize="sm" fontWeight="500">
                                                {subtitle.language}
                                            </Text>
                                        </Box>
                                    ))
                                }
                            </Flex>
                        </Box>
                    ))
                )
            }
            </SimpleGrid>
            {
                pages.total > 1 && (
                    <ButtonGroup mt={8}>
                        <Button
                            onClick={() => setPages({ ...pages, active: pages.active - 1 })}
                            isDisabled={pages.active === 1}
                        >
                            Previous
                        </Button>
                        {
                            Array.from({ length: pages.total }).map((_, i) => (
                                <Button
                                    key={i}
                                    onClick={() => setPages({ ...pages, active: i + 1 })}
                                    colorScheme={pages.active === i + 1 ? "red" : "gray"}
                                >
                                    {i + 1}
                                </Button>
                            ))
                        }
                        <Button
                            onClick={() => setPages({ ...pages, active: pages.active + 1 })}
                            isDisabled={pages.active === pages.total}
                        >
                            Next
                        </Button>
                    </ButtonGroup>
                )
            }
        </Flex>
    );
}