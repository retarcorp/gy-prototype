import { useEffect, useState } from "react";
import AuthFacade from "./AuthFacade/AuthFacade";

export default function Facade({ mode = 'auth' }) {
    
    const [internalMode, setInternalMode] = useState(mode);
    useEffect(() => {
        setInternalMode(mode);
    }, [mode])

    return <>
        { internalMode === 'auth' ? <AuthFacade /> : null}
    </>
    
}