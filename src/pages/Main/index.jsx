import { useState, useEffect } from "react";

import LoadingPage from "@pages/Preloader";
import WelcomeScreen from "@pages/Welcome";
import MyTrips from "@pages/MyTrips/index";

import { checkDBExists } from "@utils/storage";

const LOADING_SEEN_KEY = "trip_planner_loading_seen";

export default function Main() {
    const [state, setState] = useState("loading");
    const [showLoading, setShowLoading] = useState(false);

    useEffect(() => {
        const loadingSeen = localStorage.getItem(LOADING_SEEN_KEY);

        if (!loadingSeen) {
            setShowLoading(true);
        }

        (async () => {
            try {
                const exists = await checkDBExists();
                setState(exists ? "app" : "welcome");
            } catch (_) {
                setState("welcome");
            }
        })();
    }, []);

    const handleLoadingComplete = () => {
        localStorage.setItem(LOADING_SEEN_KEY, "true");
        setShowLoading(false);
    };

    if (showLoading) {
        return <LoadingPage onComplete={handleLoadingComplete} />;
    }

    if (state === "welcome") {
        return <WelcomeScreen onStart={() => setState("app")} />;
    }

    return <MyTrips />;
}