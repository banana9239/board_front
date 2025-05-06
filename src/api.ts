
import axios from "axios"
import {QueryFunctionContext} from "@tanstack/react-query"
import Cookies from "js-cookie";
import { IForm } from "./components/LoginModal";



const instance = axios.create({
    baseURL: "https://board-0h8i.onrender.com/api/v1/",
    withCredentials: true,
})

const getCSRFToken = ():string | undefined => {
    return Cookies.get('csrftoken');
}



export async function getPosts({queryKey}:QueryFunctionContext){
    const [_, largePk, mediumPk, smallPk, boardPk] = queryKey;
    const response = await instance.get(`posts/board/${boardPk}`)
    return response.data;
}

export async function getPost({queryKey}:QueryFunctionContext){
    const [_, postPk] = queryKey;
    const response = await instance.get(`posts/${postPk}`)
    return response.data;
}

export async function getLargeCategories(){
    const response = await instance.get('boards/largeCategoryList')
    return response.data;
}

export async function getMediumCategories({queryKey}:QueryFunctionContext){
    const [_,largePk] = queryKey;
    const response = await instance.get(`boards/${largePk}/mediumCategoryList`)
    return response.data;
}

export async function getSmallCategories({queryKey}:QueryFunctionContext){
    const [_, largePk, mediumPk] = queryKey;
    const response = await instance.get(`boards/${mediumPk}/smallCategoryList`)
    return response.data;
}

export async function getboards({queryKey}:QueryFunctionContext){
    const [_, largePk, mediumPk, smallPk] = queryKey;
    const response = await instance.get(`boards/${smallPk}/boards`)
    return response.data;
}

export async function getboard({queryKey}:QueryFunctionContext){
    const [_,boardPk] = queryKey;
    const response = await instance.get(`boards/${boardPk}`)
    return response.data;
}

export async function getComments({queryKey}:QueryFunctionContext){
    const [_, postPk] = queryKey;
    const response = await instance.get(`posts/${postPk}/comment`)
    return response.data;
}

export const getMe = () => instance.get('users/me').then(res => res.data);

export const logOut = () => instance.post(
    'users/log-out',
    null,
    {
        headers: {
            'X-CSRFToken': getCSRFToken(),
        }
    }
).then(res => res.data);

export const githubLogin = (code:string) => instance.post(
    'users/github',
    {code},
    {
        headers: {
            'X-CSRFToken': getCSRFToken(),
        }
    }
).then(res => res.status);

export interface IDefaultLoginProps {
    username:string;
    password:string;
}
export interface IDefaultLoginSuccess {
    ok:string
}
export interface IDefaultLoginError {
    error:string
}

export const defaultLogin = ({username, password}:IDefaultLoginProps) => instance.post(
    'users/log-in',
    {username, password},
    {
        headers: {
            'X-CSRFToken': getCSRFToken(),
        }
    }
).then(res => res.data);

interface ISignUpProps {
    username:string;
    password:string;
    email:string;
    nickname:string;
}

export const signUp = ({username, password, email, nickname}:ISignUpProps) => instance.post(
    'users/',
    {username, password, email, nickname},
    {
        headers: {
            'X-CSRFToken': getCSRFToken(),
        }
    }
).then(res => res.data);

export const checkUsername = async (username:string) => await instance.post(
    'users/check-username',
    {username},
    {
        headers: {
            'X-CSRFToken': getCSRFToken(),
        }
    }
).then(res => res.status);

interface IPostingProps {
    title:string;
    content:string;
    sortation:string;
    board:string;
}

export const posting = async (data:IPostingProps) => await instance.post(
    'posts/',
    {data},
    {
        headers: {
            'X-CSRFToken': getCSRFToken(),
        }
    }
).then(res => res.data);

interface ICommentingProps {
    content:string;
    post_id:number;
}

export const commenting = async ({content, post_id}:ICommentingProps) => await instance.post(
    `posts/${post_id}/comment`,
    {content},
    {
        headers: {
            'X-CSRFToken': getCSRFToken(),
        }
    }
).then(res => res.data);

export const commentDelete = async (comment_id:number) => await instance.delete(
    `posts/comment/${comment_id}`,
    {
        headers: {
            'X-CSRFToken': getCSRFToken(),
        }
    },
).then(res => res.data);

export const isPostLikeDo = async (post_id:string) => await instance.get(`posts/${post_id}/like`).then(res => res.data);

export const postLikeDo = async (post_id:string) => await instance.post(
    `posts/${post_id}/like`,
    null,
    {
        headers: {
            'X-CSRFToken': getCSRFToken(),
        }
    },
).then(res => res.data);

export const postLikeDelete = async (post_id:string) => await instance.delete(
    `posts/${post_id}/like`,
    {
        headers: {
            'X-CSRFToken': getCSRFToken(),
        }
    },
).then(res => res.data);

export const getURL = () => instance.post('medias/get-url', null, {
    headers: {
        'X-CSRFToken': getCSRFToken(),
    }
}).then(res => res.data);

export const uploadImage = ({file, url}:{file:any, url:string}) => {
    const formData = new FormData();
    formData.append('file', file);
    return axios.post(url, formData).then(res => res.data);
}

export const backUploadImage = async ({postPk, image, description}:{postPk:number, image:string, description:string}) => await instance.post(
    `medias/${postPk}/imageUpload`,
    {image,description},
    {
        headers: {
            'X-CSRFToken': getCSRFToken(),
        }
    }
).then(res => res.data);

export async function getImages({queryKey}:QueryFunctionContext){
    const [_, postPk] = queryKey;
    const response = await instance.get(`medias/${postPk}/getImages`)
    return response.data;}