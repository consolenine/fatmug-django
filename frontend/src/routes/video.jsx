import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
    Box, Flex, Heading, Text, AspectRatio,
    VStack, Skeleton
} from "@chakra-ui/react";
import ReactPlayer from 'react-player/lazy';

import { axiosInstance } from "../axiosConfig";
import SubSearch from "../components/forms/SubSearch";

export const Video = () => {
    const { video_uuid } = useParams();
    const [video, setVideo] = useState(null);
    const videoRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState(null);

    const handleSeek = (seconds) => {
        console.log(seconds);
        if (videoRef.current) {
            if (!videoRef.current.playing) {
                
            }
            videoRef.current.playing = true;
            videoRef.current.seekTo(seconds);
        }
    };

    const fetchVideo = async () => {
        setLoading(true); // Set loading to true when starting the fetch
        try {
            const response = await axiosInstance.get(`/vidapp/video/${video_uuid}/`);
            setVideo(response.data);
            setLoading(false);
        } catch (error) {
            setErrors(error.response ? error.response.data : 'An error occurred');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVideo();
    }, [video_uuid]);

    if (errors) {
        return (
            <Heading size="sm">{errors.detail || 'An error occurred'}</Heading>
        );
    }

    return (
        <Flex 
            direction={{ base: "column", lg: "row" }} 
            align="center"
        >
            <VStack flex={1} spacing={4}>
                {
                    loading || video == null ? (
                        <Skeleton h="200px" w="100%" rounded="lg" />
                    ) : (
                        <AspectRatio ratio={16 / 9} w="100%" maxW={{ base: "100vw" }}>
                            <ReactPlayer 
                                ref={videoRef}
                                config={{
                                    file: {
                                        tracks: video.subtitles.map((subtitle, idx) => ({
                                            kind: "subtitles",
                                            src: subtitle.url,
                                            srcLang: subtitle.language,
                                            label: subtitle.language,
                                            default: idx === 0
                                        }))
                                    }
                                }}
                                url={video.video_file}
                                playing={true}
                                controls
                                width="100%"
                                height="100%"
                            />
                        </AspectRatio>
                    )
                }
                <Heading as="h2" size="md" alignSelf="flex-start" maxW={{ base: "100vw" }}>
                    {video?.title}
                </Heading>
            </VStack>
            {
                video && video.subtitles.length > 0 ? (
                    <SubSearch video_uuid={video.uuid} subtitles={video.subtitles} handleSeek={handleSeek} />
                ) : (
                    <Box w="100%" maxW="400px">
                        <Text align="center" fontSize="xl">
                            No subtitles available for this video.
                        </Text>
                    </Box>
                )
            }
        </Flex>
    );
}
