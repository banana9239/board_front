import { Box, VStack, HStack, Text, Icon, Image  } from "@chakra-ui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { BsPersonCircle } from "react-icons/bs";
import { Link, useParams } from "react-router-dom";
import { getImages } from "../api";
import { useEffect } from "react";

interface IAuthorProps {
    name: string,
    username: string,
    nickname: string
}

interface IPostProps {
    id: number,
    like_count: number,
    browsing_count: number,
    author: IAuthorProps,
    comments: string,
    board_name: string,
    created_at: string,
    updated_at: string,
    title: string,
    content: string,
    sortation: string,
    is_deleted: boolean,
    board: number,
    comment_count: number
}

interface IPhotoProps {
    id: number,
    created_at: string,
    updated_at: string,
    image: string,
    description: string,
    is_deleted: boolean,
    post: number
    authotr: number
}


export default function PostDetail( 
    {
        postData,
        beforeUrl,
    }:{
        postData:IPostProps,
        beforeUrl:string
    } ) {
    const {postPk} = useParams();
    const {isLoading, data:photos} = useQuery({
        queryKey: ["medias", postPk], 
        queryFn: getImages
      });
    useEffect(() => {
        
    }, [photos])
    return (
        <Box>
            {<VStack alignItems={"flex-start"}>
                <Box pb={10} width={"100%"} borderBottomWidth={2}>
                    <Box><Link to={beforeUrl}><Text fontSize={16}>{postData.board_name}</Text></Link></Box>
                    <Box><Text fontSize={35}>{postData.title}</Text></Box>
                    <HStack width={"100%"}>
                        {/* 계정정보 */}
                        <Box>
                            <HStack>
                                <Icon as={BsPersonCircle}/>
                                <Text>{postData.author.nickname}</Text>
                            </HStack>
                            <Text>{postData.updated_at.substring(0,10)}</Text>
                        </Box>
                        <HStack ml="auto">
                            <Text>갖가지</Text>
                            <Text>메뉴</Text>
                        </HStack>
                    </HStack>
                </Box>
                <Box mt={2}>
                    <Text mb={2}>
                        {postData.content}
                    </Text>
                    {photos?.map((photo:IPhotoProps, index:number) => {
                        return (
                            <>
                            <Image mb={2} src={photo.image} alt={photo.description} maxW={"500px"} maxH={"400px"}/>
                            <Text mb={2}>{photo.description}</Text>
                            </>
                        )
                    })}
                </Box>
            </VStack>}
        </Box>
    )
}