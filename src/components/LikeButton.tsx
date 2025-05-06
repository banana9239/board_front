import { Button } from '@chakra-ui/react';
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { BsFillHeartbreakFill  } from "react-icons/bs";
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { isPostLikeDo, postLikeDelete, postLikeDo } from '../api';

export default function LikeButton() {
    const {postPk} = useParams();
    const [isLiked, setIsLiked] = useState(false);
    const [isHover, setIsHover] = useState(false);
    const likeMutation = useMutation({
        mutationFn: postLikeDo,
        onSuccess: () => {
            setIsLiked(true);
        }
    })
    const unlikeMutation = useMutation({
        mutationFn: postLikeDelete,
        onSuccess: () => {
            setIsLiked(false);
        }
    })
    const isLikeMutation = useMutation({
        mutationFn: isPostLikeDo,
        onSuccess: () => {
            setIsLiked(true);
        },
        onError: () => {
            setIsLiked(false);
        }
    });

    useEffect(() => {
        isLikeMutation.mutate(postPk||"");
    },[isLiked])


    const likePost = () => {
        likeMutation.mutate(postPk||"");
    }

    const unlikePost = () => {
        unlikeMutation.mutate(postPk||"");
    }

    const onMouseEnter = () => {
        setIsHover(true);
    }
    
    const onMouseLeave = () => {
        setIsHover(false);
    }

    return (<>
        {!isLiked && (
            <Button onClick={()=>likePost()} 
                    leftIcon={<FaRegHeart/>}
                >좋아요 </Button>
            )}
        {isLiked && (
            <Button onClick={()=>unlikePost()} 
                    leftIcon={isHover?<BsFillHeartbreakFill/>:<FaHeart/>}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                >좋아요 </Button>
            )}
    </>)
}