import { Box, Button, Input, InputGroup, InputLeftElement, InputRightElement, LightMode, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text, VStack } from "@chakra-ui/react";
import { SiCryptpad, SiEducative } from "react-icons/si";
import { MdAlternateEmail, MdOutlineDriveFileRenameOutline } from "react-icons/md";
import SocialLogin from "./SocialLogin";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { checkUsername, signUp } from "../api";
import { useState } from "react";

interface SignUpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface IForm {
    username:string;
    password:string;
    passwordCheck:string;
    email:string;
    nickname:string;
}

export default function SignUpModal({isOpen, onClose}: SignUpModalProps){
    function customOnClose(){
      reset();
      setIsUsernameValid(false);
      onClose();
    }
    const {register,watch, handleSubmit, formState:{errors,isValid}, reset } = useForm<IForm>({mode:"onChange"});
    const tempPw = watch("password");
    const [isUsernameValid, setIsUsernameValid] = useState(false);
    const signUpMutation = useMutation({
      mutationFn: signUp,
      onSuccess: () => {
        alert("회원가입 성공");
        customOnClose();
      },
      onError: () => {
        alert("회원가입 실패");
        customOnClose();
      },
    })
    const onSubmit = () => { 
      if(!isUsernameValid){
        alert("아이디 중복확인을 해주세요.");
        return;
      }
      signUpMutation.mutate({
        username: watch("username"),
        password: watch("password"),
        email: watch("email"),
        nickname: watch("nickname"),
      })

    }
    const checkMutation = useMutation({
      mutationFn: checkUsername,
      onSuccess: () => {
        alert("사용가능한 아이디입니다.");
        setIsUsernameValid(true)
      },
      onError: () => {
        alert("이미 사용중인 아이디입니다.");
        setIsUsernameValid(false)
      },
    })
    const onCheckUsername = (username:string) => {
      checkMutation.mutate(username);
    }

    return (
        <Modal isOpen={isOpen} onClose={customOnClose}>
          <ModalOverlay/>
          <ModalContent>
            <ModalHeader>Sign up</ModalHeader>
            <ModalCloseButton />
            <ModalBody as={"form"} onSubmit={handleSubmit(onSubmit)}>
              <VStack spacing={3}>
                <InputGroup >
                  <InputLeftElement children={
                    <Box color={"gray.500"}><SiEducative/></Box>
                  }/>
                  <InputRightElement mr={"6"} children={
                    <Box><Button onClick={() => onCheckUsername(watch("username"))} colorScheme="yellow">중복확인</Button></Box>
                  }/>
                  <Input {...register("username",{
                    required:("아이디를 입력해주세요."),
                    validate: {
                      
                    }
                    })} variant={"outline"} placeholder="Username" isDisabled={isUsernameValid}/>
                </InputGroup>
                {errors.username?.message && <Text color="red.500" textAlign={"center"} fontSize="sm">{errors.username?.message}</Text>}
                {isUsernameValid ? 
                <Text color="green.500" textAlign={"center"} fontSize="sm">사용가능한 아이디입니다.</Text> :
                <Text color="red.500" textAlign={"center"} fontSize="sm">중복확인을 눌러주세요.</Text>
                }
                <InputGroup>
                  <InputLeftElement children={
                    <Box color={"gray.500"}><SiCryptpad/></Box>
                  }/>
                  <Input type="password" {...register("password",{
                    required:"비밀번호를 입력해주세요.",
                    validate: {
                      
                    }
                    })} variant={"outline"} placeholder="Password"/>
                </InputGroup>
                {errors.password?.message && <Text color="red.500" textAlign={"center"} fontSize="sm">{errors.password?.message}</Text>}
                
                <InputGroup>
                  <InputLeftElement children={
                    <Box color={"gray.500"}><SiCryptpad/></Box>
                  }/>
                  <Input type="password" {...register("passwordCheck",{
                    required:"비밀번호를 한 번더 입력해주세요",
                    validate: {
                      passwordMatch : (value) => value === tempPw || "비밀번호가 일치하지 않습니다.",
                    }
                    })} variant={"outline"} placeholder="Password check!"/>
                </InputGroup>
                {errors.passwordCheck?.message && <Text color="red.500" textAlign={"center"} fontSize="sm">{errors.passwordCheck?.message}</Text>}

                <InputGroup>
                  <InputLeftElement children={
                    <Box color={"gray.500"}><MdAlternateEmail/></Box>
                  }/>
                  <Input {...register("email",{
                    required:"이메일을 입력해주세요.",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "유효한 이메일 주소를 입력해주세요."
                    }
                    })} variant={"outline"} placeholder="Email"/>
                </InputGroup>
                {errors.email?.message && <Text color="red.500" textAlign={"center"} fontSize="sm">{errors.email?.message}</Text>}
                
                <InputGroup>
                  <InputLeftElement children={
                    <Box color={"gray.500"}><MdOutlineDriveFileRenameOutline/></Box>
                  }/>
                  <Input {...register("nickname")} variant={"outline"} placeholder="Nickname"/>
                </InputGroup>
              </VStack>
              <LightMode><Button type="submit" mt={4} colorScheme="yellow" width={"100%"}>Sign up</Button></LightMode>
              <SocialLogin/>
            </ModalBody>
          </ModalContent>
        </Modal>
    )
}