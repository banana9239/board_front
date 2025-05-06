import { createBrowserRouter } from "react-router-dom";
import Root from "./components/Root"
import NotFound from "./routes/NotFound";
import Home from "./routes/Home";
import Post from "./routes/Post";
import GithubLogin from "./routes/GithubLogin";
import PostForm from "./routes/PostForm";

const router = createBrowserRouter([
    {path: "/", element: <Root/>, errorElement:<NotFound/>, children: [
        {path: "", element: <Home/>},
        {path: ":loadLargePk", element: <Home/>},
        {path: ":loadLargePk/:loadMediumPk", element: <Home/>},
        {path: ":loadLargePk/:loadMediumPk/:loadSmallPk", element: <Home/>},
        {path: ":loadLargePk/:loadMediumPk/:loadSmallPk/:loadBoardPk", element: <Home/>},
        {path: "post/:postPk", element: <Post/>},
        {path: "social",children:[
            {
                path: "github",
                element: <GithubLogin/>
            },
        ]},
        {path: "post/editor", element: <PostForm/>},
    ]},
])

export default router;