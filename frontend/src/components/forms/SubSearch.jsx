import { useEffect, useState } from "react";
import {
    Box, Flex, Heading, SimpleGrid, Skeleton, Text,
    VStack, InputGroup, Input, InputRightElement, Button
} from "@chakra-ui/react";
import { axiosInstance } from "../../axiosConfig";
import debounce from 'lodash/debounce'; // Optionally install lodash for debouncing

const SubSearch = ({ video_uuid, subtitles, handleSeek }) => {
    const [search, setSearch] = useState("");
    const [activeSub, setActiveSub] = useState(subtitles[0].id);
    const [subData, setSubData] = useState("");
    const [timestamps, setTimestamps] = useState([]);
    const [loading, setLoading] = useState(false);
    const [noMatches, setNoMatches] = useState(false);

    const timestampToSeconds = (t) => {
        const [h, m, s] = t.split(':');
        const [sec, ms] = s.split(',');
        return (+h * 3600) + (+m * 60) + (+sec);
    };

    // Handle subtitle search
    const handleSearch = (query) => {
        setSearch(query);
        if (query === "") {
            setTimestamps([]);
            setNoMatches(false);
            return;
        }

        const matches = [];
        const srtPattern = /(\d+)\n(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})\n(.*?)\n\n/g;
        let match;

        while ((match = srtPattern.exec(subData)) !== null) {
            const [fullMatch, index, startTime, endTime, text] = match;
            const normalizedText = text.replace(/\n/g, ' ').trim();

            if (normalizedText.toLowerCase().includes(query.toLowerCase())) {
                matches.push({
                    index: parseInt(index, 10),
                    start: startTime,
                    text: normalizedText
                });
            }
        }
        setTimestamps(matches);
        setNoMatches(matches.length === 0); // Set no matches state
    }

    // Fetch subtitle data when component mounts or active subtitle changes
    useEffect(() => {
        setLoading(true);
        axiosInstance.get(`/vidapp/subtitle/${video_uuid}/${activeSub}/?of=raw`)
        .then((response) => {
            setSubData(response.data);
            setTimestamps([]);  // Reset timestamps on subtitle change
            setNoMatches(false); // Reset no match state
        }).catch((error) => {
            console.log(error);
        }).finally(() => {
            setLoading(false);
        })
    }, [activeSub]);

    useEffect(() => {
        handleSearch(search);
    }, [subData]);

    return (
        <VStack w="100%" maxW="400px" p={2} alignSelf="flex-start">
            <Heading as="h3" size="md" alignSelf="flex-start">
                Search subtitles in video
            </Heading>
            <InputGroup w="100%">
                <Input 
                    type="text" 
                    placeholder="Search subtitles..."
                    size="sm"
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)} // Debounced search
                />
            </InputGroup>
            <Flex
                w="100%"
                mt={4}
                gap={2}
                flexWrap="wrap"
            >
                {
                    subtitles.map((subtitle) => (
                        <Box 
                            key={subtitle.id} 
                            p={2} px={4} 
                            rounded="lg" 
                            bg={subtitle.id === activeSub ? "red.500" : "gray.200"}
                            cursor="pointer"
                            onClick={() => setActiveSub(subtitle.id)}
                        >
                            <Text fontSize="sm" fontWeight="500">
                                {subtitle.language}
                            </Text>
                        </Box>
                    ))
                }
            </Flex>
            <VStack 
                w="100%" 
                mt={4} 
                spacing={2}
                h={{ base: "200px", lg: "450px" }}
                overflowY="auto"
            >
                {
                    loading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                            <Skeleton key={i} w="100%" h="8" rounded="lg" />
                        ))
                    ) : (
                        timestamps.map((timestamp) => (
                            <Box
                                as="button"
                                key={timestamp.index}
                                display="flex"
                                flexDirection="column"
                                gap={2}
                                bg="gray.100"
                                p={2}
                                align="flex-start"
                                w="100%"
                                rounded="md"
                                onClick={() => handleSeek(timestampToSeconds(timestamp.start))}
                                cursor="pointer"
                            >
                                <Text fontWeight="bold">
                                    Seek to {timestamp.start}
                                </Text>
                                <Text fontSize="sm">
                                    {timestamp.text}
                                </Text>
                            </Box>
                        ))
                    )
                }
            </VStack>
        </VStack>
    )
}

export default SubSearch;
