import { Box, Button, HStack, LinkOverlay, Text, Link as CLink} from "@chakra-ui/react";
import CategoryList from "../components/CategoryList";
import { useQuery } from "@tanstack/react-query";
import { getboards, getLargeCategories, getMediumCategories, getPosts, getSmallCategories } from "../api";
import { Link, useParams } from "react-router-dom";
import PostList from "../components/PostList";
import { useEffect, useState } from "react";
import useUser from "../lib/useUser";


export default function Home() {  
  const { loadLargePk, loadMediumPk, loadSmallPk, loadBoardPk } = useParams();
  
  const {isLoading:largeLoding, data:largeData} = useQuery({
    queryKey: ['largeCategories'], 
    queryFn: getLargeCategories
  });
  const largePk = loadLargePk || (largeData && largeData.length > 0 ? largeData[0].id : null);

  const {data:mediumData} = useQuery({
    queryKey: ['mediumCategories', largePk], 
    queryFn: getMediumCategories,
    enabled: !!largePk
  });
  const mediumPk = loadMediumPk || (mediumData && mediumData.length > 0 ? mediumData[0].id : null);

  const {data:smallData} = useQuery({
    queryKey: ['smallCategories', largePk, mediumPk], 
    queryFn: getSmallCategories,
    enabled: !!mediumPk
  });
  const smallPk = loadSmallPk || (smallData && smallData.length > 0 ? smallData[0].id : null);

  const {data:boardData} = useQuery({
    queryKey: ['boards', largePk, mediumPk, smallPk], 
    queryFn: getboards,
    enabled: !!smallPk
  });
  const boardPk = loadBoardPk || (boardData && boardData.length > 0 ? boardData[0].id : null);

  const {isLoading:postLoading,data:postData} = useQuery({
    queryKey: ['posts', largePk, mediumPk, smallPk, boardPk], 
    queryFn: getPosts,
    enabled: !!boardPk
  });
  
  var board_name = boardData && boardData.length > 0 ? boardData[0].board_name : "";

  if(boardPk !== null && boardData){
    for(let i=0; i<boardData.length; i++){
      if(String(boardData[i].id) === boardPk){
        board_name = boardData[i].board_name;
      }
    }
  }
  const [beforeUrl, setBeforeUrl] = useState("");

  const [pageSize, setPageSize] = useState(5);
  const [page, setPage] = useState(1)
  const totalPages = postData ? (postData.length/pageSize) % 1 != 0 ? (postData.length/pageSize)+1 : postData.length/pageSize : 0;

  const startRange = (page - 1) * pageSize
  const endRange = startRange + pageSize

  const visibleItems = postData ? postData.slice(startRange, endRange):[];

  const {user} = useUser();

  const pageClick = (page:number) => {
    setPage(page+1);
  }

  useEffect(() => {
    setBeforeUrl(`/${largePk}/${mediumPk}/${smallPk}/${boardPk}`);
  },[boardPk]);
  

  return (
    <Box>
      {!largeLoding && <CategoryList largeData={largeData} mediumData={mediumData} smallData={smallData} boardData={boardData}/> }
      {postData ? 
      <PostList 
        data={visibleItems} 
        board_name={board_name}
        beforeUrl={beforeUrl}
        startNum={startRange}
      />
      :<Box py={5} px={10}><Text textAlign={"center"} width="100%" overflowX={"auto"}>게시판이 존재하지 않습니다.</Text></Box>}
      
      <Box py={5} px={10} width="100%">
        <HStack justifyContent={"center"} spacing={4}>
        {Array.from({length:totalPages}, (_, index) => {
          return (<>
          {page==index+1 ? <Button color={"red"} onClick={()=>pageClick(index)} mr={"-6px"} ml={"-6px"} variant={"plain"}>{index+1}</Button> 
          :<Button onClick={()=>pageClick(index)} mr={"-6px"} ml={"-6px"} variant={"plain"}>{index+1}</Button>}
            </>)})}
          </HStack>
      </Box>
      <Box width={"100%"} display="flex" justifyContent="flex-end" py={5} px={10}>
        {!user ? "":<Link to={"/post/editor"} state={{boardPk:boardPk, }}><Button ml="auto">글쓰기</Button></Link>}
        
      </Box>
    </Box>
  );
}