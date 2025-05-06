import { useNavigate } from "react-router-dom";
import useUser from "../lib/useUser"
import { useEffect } from "react";


interface IProtectPageProps {
    children: React.ReactNode
}

export default function ProtectPage({children}:IProtectPageProps) {
    const { userLoading, isLogIn } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if(!userLoading ){
            if(!isLogIn) {
                navigate("/");
            }
        }
    },[userLoading, isLogIn, navigate])
    return <>{children}</>
}