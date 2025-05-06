import { Box, Button, Input, Text, VStack, FormControl, FormHelperText, FormLabel, Textarea, Select, LightMode, Image, InputGroup, InputRightElement, Checkbox  } from "@chakra-ui/react";
import ProtectPage from "../components/ProtectPage";
import { set, useForm } from "react-hook-form";
import useUser from "../lib/useUser";
import { useMutation, useQuery } from "@tanstack/react-query";
import { backUploadImage, getboard, getURL, posting, uploadImage } from "../api";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface IPostProps {
    title: string,
    content: string,
    sortation: string,
    board:string
    file: FileList,
}

interface IBoardProps {
    id: string,
    post_count: number,
    created_at: string,
    updated_at: string,
    board_name: string,
    board_category: number
}

type IImage = string[];

export default function PostForm() {
    const { register, handleSubmit, watch, setValue } = useForm<IPostProps>();
    let num = 0;
    const [postPk, setPostPk] = useState<number>(0);
    const location = useLocation();
    const [loading, setLoading] = useState<boolean>(false);
    const {boardPk} = location.state||null;
    const {user} = useUser();
    var fileSize = 0;
    const { data: boardData } = useQuery<IBoardProps>({
        queryKey: ["boards",boardPk], 
        queryFn: getboard,
        enabled: !!boardPk
    });
    
    const imageProcess = async (i:number) => {
        num = i;
        return new Promise<void>((resolve, reject) => {
            urlMutation.mutate();
            resolve();
        });
    }

    const navigate = useNavigate();
    const mutation = useMutation({
        mutationFn: posting,
        onSuccess: async (data) => {
            setPostPk(data.id);
            num = 0;
            const fileCount = watch("file").length;
            const imageTime = ((fileSize/1024/1024)*1000)+2000;
            try {
                const temp = await Promise.all(Array.from({ length: fileCount }, (_, i) => imageProcess(i)));
                setTimeout(()=>navigate(`/post/${data.id}`),imageTime);
            } catch (error) {
                alert("이미지 업로드 중 오류가 발생했습니다.");
            }
        },
        onError: (data) => {
            alert(data);
        }
    })
    
    const urlMutation = useMutation({
        mutationFn: getURL,
        onSuccess: (data) => {
            const file = watch("file")[num];
            imageMutation.mutate({ file: file, url: data.result.uploadURL });
        },
    })
    const imageMutation = useMutation({
        mutationFn: uploadImage,
        onSuccess: (data) => {
            backMutation.mutate({
                postPk: postPk,
                image: `https://imagedelivery.net/5xm8vIkUK7gGW5P9F43X-Q/${data.result.id}/public`,
                description: (document.getElementsByName("description" + String(num))[0] as HTMLTextAreaElement).value
            });

        },
        onError: (data) => {
            alert(data);
        }

    })
    const backMutation = useMutation({
        mutationFn: backUploadImage,
        onSuccess: (data) => {
            console.log(data);
        }
    })
    const onSubmit = (data: IPostProps) => {
        data.board = boardData?.id||"";
        setLoading(true);
        mutation.mutate(data)
    }
    const tempSubmit = () => {
        urlMutation.mutate();
    }

    const [image, setImage] = useState<IImage>();
    
    const handleImage = (e: any) => {
        if (!e.target.files) return;
        const files = e.target.files;
        
        if (files){
            let images = [];
            for (let i=0; i<files.length; i++){
                images.push(window.URL.createObjectURL(files[i]));
            }
            setImage(images);
        }
        
    }
    const mediaReset = () => {
        setImage([]);
        const dataTransfer = new DataTransfer();
        setValue("file", dataTransfer.files);
        
    }

    useEffect(() => {
        Array.from({length: watch("file").length}, (_, i) => fileSize+=watch("file")[i].size);
        console.log(fileSize);
      },[image]);
    return (
        <ProtectPage>
            <Box py={5} px={10} width={"100%"} height={"400px"}>
                <VStack as={"form"} onSubmit={handleSubmit(onSubmit)}>
                    <FormControl>
                        <FormLabel>게시판</FormLabel>
                        <Input type="text"  {...register("board", {
                            required:true
                        })} isDisabled={false} value={boardData?.board_name}/>
                    </FormControl>
                    <FormControl>
                        <FormLabel>이름</FormLabel>
                        <Input isDisabled value={`${user.nickname ? user.nickname : user.username}`}/> 
                    </FormControl>
                    <FormControl>
                        <FormLabel>제목</FormLabel>
                        <Input type="text" {...register("title", {
                            required:true
                        })}/>  
                    </FormControl>
                    <FormControl>
                        <FormLabel>내용</FormLabel>
                        <Textarea {...register("content",{
                            required:true
                        })}/>
                        <InputGroup>
                            <Input mb={5} multiple type="file" accept="image/*" {...register("file", {onChange: handleImage})}/>
                            <InputRightElement>
                                <Button onClick={mediaReset} size="sm">reset</Button>
                            </InputRightElement>
                        </InputGroup>
                        <Box >
                        {image ? image.map((ima, index) => (<>
                            <Image src={ima} maxWidth={"250px"} alt="불만있냐?"/>
                            <Textarea name={"description"+String(index)} mb={5} placeholder={"미디어에 대한 설명을 쓰시오."}/>
                            </>)):""}
                        </Box>
                    </FormControl>
                    <FormControl>
                        <FormLabel>종류</FormLabel>
                        <Select
                            {...register("sortation", { required: true })}
                            placeholder="글의 종류를 선택해주세요"
                        >
                            <option value="공지">공지</option>
                            <option value="자유">자유</option>
                        </Select>
                    </FormControl>
                    <FormControl>
                        <Checkbox onSelect={()=>console.log("눌렀냐")}>암호를 설정하시겠습니까?</Checkbox>
                    </FormControl>
                    <LightMode>
                        <Button mt={10}
                            type="submit"
                            colorScheme={"red"}
                            size="lg"
                            w="100%"
                            isLoading={loading}
                            >
                            posting!
                        </Button>
                    </LightMode>
                </VStack>
            </Box>
        </ProtectPage>
    )
}