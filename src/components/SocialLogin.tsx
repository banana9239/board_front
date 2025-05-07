import { Box, Button, Divider, HStack, LightMode, Text, VStack } from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";
import { RiKakaoTalkFill } from "react-icons/ri";

export default function SocialLogin(){


    return (
        <Box mb={4}>
            <HStack my={8}>
                <Divider/>
                    <Text fontSize={"xs"} as={"b"}>Or</Text>
                <Divider/>
            </HStack>
            <VStack>
                <LightMode>
                    <Button as={"a"} href="https://github.com/login/oauth/authorize?client_id=Iv23liJ0sUDaHyhdk9pf&scope=read:user,user:email" w="100%" colorScheme="red" leftIcon={<FaGithub/>}>github</Button>
                    <Button w="100%" colorScheme="green" leftIcon={<RiKakaoTalkFill/>}>kakao</Button>
                </LightMode>
            </VStack>
        </Box>
    )
}