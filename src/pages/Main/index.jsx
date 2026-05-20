import { useState, useEffect } from "react";

import Preloader from "@pages/Preloader";
import Welcome from "@pages/Welcome";
import MyTrips from "@pages/MyTrips/index";

import { checkDBExists } from "@utils/storage";


export default function Main() {
    const [state, setState] = useState("loading"); // "loading" | "welcome" | "app"


    const resolveScreen = async () => {
        try {
            const exists = await checkDBExists();
            setState(exists ? "app" : "welcome");
        } catch (_) {
            setState("welcome");
        }
    };
    
    useEffect(() => {
        resolveScreen();
    }, []);
    

    if (state === "loading") {
        return <Preloader onDone={resolveScreen} />;
    }

    if (state === "welcome") {
        return <Welcome onStart={() => setState("app")} />;
    }

    return <MyTrips />;
}