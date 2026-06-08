import { useState, useEffect } from "react";

import LoadingPage from "@pages/Preloader";
import WelcomeScreen from "@pages/Welcome";
import MyTrips from "@pages/MyTrips/index";

import { checkDBExists } from "@utils/storage";


export default function Main() {
    const [state, setState] = useState("loading"); // "loading" | "welcome" | "app"
    
    const [doneLoading, setDoneLoading] = useState(false);

    useEffect(() => {
        (async () => {
        try {
            const exists = await checkDBExists();
            setState(exists ? "app" : "welcome");
        } catch (_) {
            setState("welcome");
        }
        })();
    }, []);
    

    if (!doneLoading) {
        return <LoadingPage onComplete={() => setDoneLoading(true)} />;
    }

    if (state === "welcome") {
        return <WelcomeScreen onStart={() => setState("app")} />;
    }

    return <MyTrips />; 
}