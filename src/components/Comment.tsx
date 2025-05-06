import { Box, Button, HStack, Icon, Text, Textarea, VStack } from '@chakra-ui/react';
import { BsPersonCircle } from "react-icons/bs";
import { HiOutlineReply } from "react-icons/hi";
import useUser from '../lib/useUser';
import { useMutation } from '@tanstack/react-query';
import { commentDelete, commenting } from '../api';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

interface IAuthorProps {
    name: string,
    username: string,
    nickname: string
}

interface IReplyProps {
    id: number,
    content: string,
    author: IAuthorProps
    created_at: string
}

interface ICommentProps {
    id: number,
    content: string,
    author: IAuthorProps,
    created_at: string,
    replies: IReplyProps[]
}

interface ICommentFormProps {
    content:string,
    post_id:number
}

export default function Comment(
    {
        commentData,
        postId
    }:{
        commentData:ICommentProps[],
        postId:number
    }) {
    const {register, handleSubmit} = useForm<ICommentFormProps>();
    const {user, userLoading} = useUser();
    const navagate  = useNavigate();
    const commentDeleteMutation = useMutation({
        mutationFn: commentDelete,
        onSuccess: (data) => {
            alert("삭제되었습니다.");
            window.location.reload();
        },
        onError: (data) => {
            alert(data);
        }
    })
    const mutation = useMutation({
        mutationFn: commenting,
        onSuccess: (data) => {
            window.location.reload();
        },
        onError: (data) => {
            alert(data);
        }
    })

    const onSubmit = (data:ICommentFormProps) => {
        data.post_id = postId;
        mutation.mutate(data);
    }

    const deleteComment = (comment_id:number) => {
        commentDeleteMutation.mutate(comment_id)
        return () => {}
    }
    
    return (
            <Box>
                <VStack spacing={4} align="stretch">
                    {commentData?.map((comment) => (
                        <Box>
                            <VStack width={"100%"} alignItems={"flex-start"} p={4}>
                                <HStack width={"100%"} alignItems={"flex-start"}>
                                    <Icon alignSelf={"center"} as={BsPersonCircle}/><Text mr={10}>{comment.author.nickname}</Text>
                                    <Text>{comment.content}</Text>
                                    <Box ml={"auto"}>
                                        <Text>{`${comment.created_at.substring(0,10)}, ${comment.created_at.substring(11,19)}`}</Text>
                                    </Box>
                                </HStack>
                                {user && user.username === comment.author.username && (
                                <Box ml={"auto"}>
                                    <Button height={7} fontSize={15}>수정</Button>
                                    <Button onClick={() => deleteComment(comment.id)} height={7} fontSize={15}>삭제</Button>
                                </Box>
                                )}
                            </VStack>
                            
                            {comment.replies.map((reply) => (
                                <Box ml={"98"} >
                                    <VStack width={"100%"} alignItems={"flex-start"} p={7} pt={0}>
                                        <HStack width={"100%"} alignItems={"flex-start"}>
                                            <Icon as={HiOutlineReply} transform={"rotate(180deg)"}/>
                                            <Icon alignSelf={"center"} as={BsPersonCircle}/>
                                            <Text mr={10}>{reply.author.nickname}</Text>
                                            <Text>{reply.content}</Text>
                                            <Box ml={"auto"}>
                                                <Text>{`${reply.created_at.substring(0,10)}, ${reply.created_at.substring(11,19)}`}</Text>
                                            </Box>
                                        </HStack>
                                        {user && user.username === reply.author.username && (
                                        <Box ml={"auto"}>
                                            <Button height={7} fontSize={15}>수정</Button>
                                            <Button height={7} fontSize={15}>삭제</Button>
                                        </Box>
                                        )}
                                    </VStack>
                                </Box>
                            ))}
                        </Box>
                    ))}
                    {user ? (
                    <Box as='form' onSubmit={handleSubmit(onSubmit)}>
                        <Textarea {...register("content",{
                            required:true
                        })} placeholder="댓글을 작성하세요..." />
                        <Button type='submit' mt={2}>댓글 작성</Button>
                    </Box>
                    ):""}
                </VStack>
            </Box>            
    );
}