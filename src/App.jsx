import { Route, Routes } from 'react-router';
import './App.css';
import LandingPage from './views/LandingPage';
import HomePage from './views/HomePage';
import DietEntry from './views/DietEntry';
import Preview from "./views/Preview";
import { useEffect, useState } from 'react';
import { checkIfLogin, wakeUltimateUtility } from './api/DietPlanner';
import { Button } from './components/ui/Button';
import { RefreshCcw } from 'lucide-react';

const App = () => {
    const [userName, setUserName] = useState("");
    const [loginFailed, setLoginFailed] = useState(false);
    const [waitingTime, setWaitingTime] = useState(0);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        // showBusyIndicator(true, "Please wait, you are getting authenticated.");
        let loginTriesFlag = localStorage.getItem("DietPlanner-Login-Tries");
        let timer, time = 0;
        if (!loginTriesFlag) {
            localStorage.setItem("DietPlanner-Login-Tries", "fresh");
            timer = setInterval(() => {
                time++;
                setWaitingTime(time);
            }, 1000);
        } else if (loginTriesFlag === "tried") {
            localStorage.setItem("DietPlanner-Login-Tries", "final");
        } else if (loginTriesFlag === "fresh") {
            return;
        } else {
            localStorage.removeItem("DietPlanner-Login-Tries");
            setLoginFailed(true);
            // alert("SSO LOGIN FAILED!");
            // showBusyIndicator(false);
            return;
        }
        wakeUltimateUtility();
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
                // alert("SSO LOGIN FAILED!");
                setLoginFailed(true);
            }
        }).then(() => {
            clearInterval(timer);
            // showBusyIndicator(false);
        });
    }, []);

    const refreshPage = () => {
        window.location.href = process.env.REACT_APP_DIET_PLANNER_URL;
    }

    return (userName ? 
        <Routes>
            <Route path="/" element={<LandingPage userName={userName}/>}>
                <Route index element={<HomePage />} />
                <Route path="diet" element={<DietEntry />} />
                <Route path="preview" element={<Preview />} />
            </Route>
        </Routes>
        :
        <>
        <div className='m-4 gap-2 text-white font-bold flex flex-col'>
            <span className="bg-primary rounded p-4">
                Please wait while we are logging you in...
                <br/>
                {!!waitingTime && `Waiting time: ${waitingTime}s`}
            </span>
            {loginFailed &&
            <Button className="w-fit" onClick={refreshPage}>
                <RefreshCcw className="mr-2"/>Refresh</Button>
            }
        </div>
        </>
    );
};

export default App;
