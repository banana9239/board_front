import { Box, Button, Input, InputGroup, InputLeftElement, LightMode, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text, useToast, VStack } from "@chakra-ui/react";
import { SiCryptpad, SiEducative } from "react-icons/si";
import SocialLogin from "./SocialLogin";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { defaultLogin, IDefaultLoginError, IDefaultLoginProps, IDefaultLoginSuccess } from "../api";

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export interface IForm {
  username:string;
  password:string;
}

export default function LoginModal({isOpen, onClose}: LoginModalProps){
    const {register, handleSubmit, formState:{errors}, reset } = useForm<IForm>();
    const toast = useToast();
    const queryClient = useQueryClient();
    const mutation = useMutation<IDefaultLoginSuccess, IDefaultLoginError, IDefaultLoginProps>({
        mutationFn: defaultLogin,
        onSuccess: () => {
          reset();
          queryClient.refetchQueries({queryKey:['me']});
          toast({
            title: "welcome!",
            status: "success",
          });
          onClose();
        },
    })
    function onSubmit({ username, password }: IForm){
        mutation.mutate({username, password});
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay/>
          <ModalContent>
            <ModalHeader>Log in</ModalHeader>
            <ModalCloseButton />
            <ModalBody as={"form"} onSubmit={handleSubmit(onSubmit)}>
              <VStack spacing={3}>
                <InputGroup>
                  <InputLeftElement children={
                    <Box color={"gray.500"}><SiEducative/></Box>
                  }/>
                  <Input isInvalid={Boolean(errors.username?.message)} {...register("username",{required:true})} variant={"outline"} placeholder="Username"/>
                </InputGroup>
                <InputGroup>
                  <InputLeftElement children={
                    <Box color={"gray.500"}><SiCryptpad/></Box>
                  }/>
                  <Input isInvalid={Boolean(errors.password?.message)} type="password" {...register("password",{required:true})} variant={"outline"} placeholder="Password"/>
                </InputGroup>
              </VStack>
              {mutation.isError ? (
              <Text color="red.500" textAlign={"center"} fontSize="sm">
                Username or Password are wrong
              </Text>
              ) : null}
              <LightMode><Button type="submit" mt={4} colorScheme="yellow" width={"100%"}>Log in</Button></LightMode>
              <SocialLogin/>
            </ModalBody>
          </ModalContent>
        </Modal>
    )
}