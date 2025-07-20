import { Route, Routes } from 'react-router';
import './App.css';
import LandingPage from './views/LandingPage';
import HomePage from './views/HomePage';
import DietEntry from './views/DietEntry';
import Preview from "./views/Preview";
import { useEffect, useState } from 'react';
import { checkIfLogin } from './api/DietPlanner';

const App = () => {
    const [userName, setUserName] = useState("");

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        // showBusyIndicator(true, "Please wait, you are getting authenticated.");
        let loginTriesFlag = localStorage.getItem("DietPlanner-Login-Tries");
        if (!loginTriesFlag) {
            localStorage.setItem("DietPlanner-Login-Tries", "fresh");
        } else if (loginTriesFlag === "tried") {
            localStorage.setItem("DietPlanner-Login-Tries", "final");
        } else {
            localStorage.removeItem("DietPlanner-Login-Tries");
            alert("SSO LOGIN FAILED!");
            // showBusyIndicator(false);
            return;
        }
        checkIfLogin(code).then((userName) => {
            localStorage.removeItem("DietPlanner-Login-Tries");
            setUserName(userName);
            if (code) window.location.href = process.env.REACT_APP_DIET_PLANNER_URL;
        }).catch((e) => {
            if (localStorage.getItem("DietPlanner-Login-Tries") === "fresh") {
                window.location.href = process.env.REACT_APP_ULTIMATE_UTILITY_URL + "?redirect=DIET_PLANNER";
                localStorage.setItem("DietPlanner-Login-Tries", "tried");
            } else {
                localStorage.removeItem("DietPlanner-Login-Tries");
                alert("SSO LOGIN FAILED!");
            }
        }).then(() => {
            // showBusyIndicator(false);
        });
    }, [])

    return (
        <Routes>
            <Route path="/" element={<LandingPage userName={userName}/>}>
                <Route index element={<HomePage />} />
                <Route path="diet" element={<DietEntry />} />
                <Route path="preview" element={<Preview />} />
            </Route>
        </Routes>
    );
};

export default App;
