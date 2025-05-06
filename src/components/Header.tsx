import { Box, Button, HStack, IconButton, LightMode, Menu, MenuButton, MenuItem, MenuList, Text, ToastId, useColorMode, useColorModeValue, useToast } from '@chakra-ui/react'
import { SiBillboard} from 'react-icons/si'
import { PiBlueprintFill, PiBlueprintLight } from "react-icons/pi";
import { Link, useNavigate } from 'react-router-dom'
import { useDisclosure } from '@chakra-ui/react'
import LoginModal from './LoginModal'
import SignUpModal from './SignUpModal'
import useUser from '../lib/useUser';
import { BsPersonCircle } from "react-icons/bs";
import { logOut } from '../api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';

export default function Header() {
    const {isOpen:isLoginOpen, onClose:onLoginClose, onOpen:onLoginOpen} = useDisclosure();
    const {isOpen:isSignupOpen, onClose:onSignupClose, onOpen:onSignupOpen} = useDisclosure();
    const {toggleColorMode} = useColorMode();
    const Icon = useColorModeValue(PiBlueprintFill, PiBlueprintLight);
    const toast = useToast();
    const toastId = useRef<ToastId>();
    const {userLoading, user, isLogIn} = useUser();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const mutation = useMutation({
        mutationFn: logOut,
        onMutate: () => {
            toastId.current = toast({
                title: "로그아웃 중..",
                status: "info",
            })
        },
        onSuccess: () => {
            if(toastId.current){
                queryClient.refetchQueries({queryKey:['me']});
                toast.update(toastId.current, {
                    title: "로그아웃 성공",
                    status: "success",
                })
                navigate("/")
            }

        },
        onError: () => {
            if(toastId.current){
                toast.update(toastId.current, {
                title: "로그아웃 실패",
                status: "error",
                })
            }
        }
    });
    async function logOutDo(){
        mutation.mutate();
    }
    
    return (
        <HStack justifyContent={"space-between"} py={5} px={10} borderBottomWidth={1}>
            <Box color="blue.500">
            <Link to="/" >
                <SiBillboard size={80} />
            </Link>
            </Box>
            <HStack spacing={2}>
            <IconButton onClick={toggleColorMode} aria-label="Toglle dark mode" variant={"ghost"} icon={<Icon size={40} />}></IconButton>
            {!userLoading && isLogIn ? 
            <Menu>
                <MenuButton>
                    <HStack><BsPersonCircle /><Text>{user.nickname}</Text></HStack>
                </MenuButton>
                <MenuList>
                    <MenuItem>설정</MenuItem>
                    <MenuItem onClick={logOutDo}>로그아웃</MenuItem>
                </MenuList>
            </Menu>
             : 
            <>
            <Button onClick={onLoginOpen}>Log in</Button>
            <LightMode><Button onClick={onSignupOpen} colorScheme="yellow">Sign up</Button></LightMode>
            </>}
            </HStack>
            <LoginModal isOpen={isLoginOpen} onClose={onLoginClose}/>
            <SignUpModal isOpen={isSignupOpen} onClose={onSignupClose}/>
        </HStack>
    )
}