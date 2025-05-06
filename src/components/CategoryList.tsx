import { Box, Grid, GridItem } from '@chakra-ui/react';
import { Link, useParams } from 'react-router-dom';

interface ILargeCategoryProps {
    id: number,
    created_at: string,
    updated_at: string,
    name: string
}

interface IMediumCategoryProps {
    id: number,
    created_at: string,
    updated_at: string,
    name: string,
    large_category: number
}

interface ISmallCategoryProps {
    id: number,
    created_at: string,
    updated_at: string,
    name: string,
    medium_category: number
}

interface IBoardProps {
    id: number,
    created_at: string,
    updated_at: string,
    board_name: string,
    board_category: number
}

export default function CategoryList(
    {
        largeData, 
        mediumData,
        smallData,
        boardData
    }: {
        largeData:ILargeCategoryProps[],
        mediumData:IMediumCategoryProps[],
        smallData:ISmallCategoryProps[],
        boardData:IBoardProps[]
    }
) {
    const {loadLargePk, loadMediumPk, loadSmallPk} = useParams();

    const largePk = loadLargePk || (largeData && largeData.length > 0 ? largeData[0].id : null);
    const mediumPk = loadMediumPk || (mediumData && mediumData.length > 0 ? mediumData[0].id : null);
    const smallPk = loadSmallPk || (smallData && smallData.length > 0 ? smallData[0].id : null);

    return (
        <Box mt={10} py={5} px={10}>
            <Grid borderBottom={"1px"} gap={2} templateColumns={"repeat(10, 1fr)"}>
                {largeData?.map((category) => (
                    <GridItem textAlign={"center"} w='100%' h='10'><Link to={`/${String(category.id)}`}>{category.name}</Link></GridItem>    
                ))}
            </Grid>

            <Grid borderBottom={"1px"} mt={2} gap={2} templateColumns={"repeat(10, 1fr)"}>
                {mediumData?.map((category) => (
                    <GridItem textAlign={"center"} w='100%' h='10'><Link to={`/${String(largePk)}/${String(category.id)}`}>{category.name}</Link></GridItem>
                ))}
            </Grid>
            <Grid mt={2} gap={2} templateColumns={"repeat(10, 1fr)"}>
                {smallData?.map((category) => (
                    <GridItem textAlign={"center"} w='100%' h='10'><Link to={`/${String(largePk)}/${String(mediumPk)}/${String(category.id)}`}>{category.name}</Link></GridItem>
                ))}
            </Grid>
            <Grid mt={2} gap={2} templateColumns={"repeat(10, 1fr)"}>
                {boardData?.map((board) => (
                    <GridItem textAlign={"center"} w='100%' h='10'><Link to={`/${String(largePk)}/${String(mediumPk)}/${String(smallPk)}/${String(board.id)}`}>{board.board_name}</Link></GridItem>
                ))}
            </Grid>
        </Box>
    );

}