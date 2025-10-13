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
import MakePost from './views/MakePost';

const App = () => {
    const [userName, setUserName] = useState("");
    const [loginFailed, setLoginFailed] = useState(false);
    const [waitingTime, setWaitingTime] = useState(0);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        // showBusyIndicator(true, "Please wait, you are getting authenticated.");
        let loginTriesFlag = localStorage.getItem("DietPlanner-Login-Tries");
        // let lastLoginTime = localStorage.getItem("DietPlanner-Login-LastTime");
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
        
        } else {
            localStorage.removeItem("DietPlanner-Login-Tries");
            setLoginFailed(true);
            clearInterval(timer);
            // alert("SSO LOGIN FAILED!");
            // showBusyIndicator(false);
            return;
        }
return;
        // if(lastLoginTime && new Date().getTime() - lastLoginTime > 2) {
        //     localStorage.removeItem("DietPlanner-Login-LastTime");
        //     setLoginFailed(true);
        //     clearInterval(timer);
        //     return;
        // } else {
        //     localStorage.setItem("DietPlanner-Login-LastTime", new Date().getTime());
        // }

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
                <Route path="post" element={<MakePost />} />
            </Route>
        </Routes>
        :
        <>
        <div className='m-4 gap-2 text-blue-900 font-bold flex flex-col w-fit'>
            <span className="custom-background rounded p-6 text-xl">
                <span>
                    Welcome to 
                    <br/>
                    <span className='font-black text-white text-6xl'>Diet Planner</span>
                </span>
                <br/>
                <br/>
                Please wait while we are authenticating you...
                <br/>
                <span className='text-xl'>
                {!!waitingTime && 
                <div className='bg-cyan-400 p-2 w-fit mt-2 rounded'>
                    Waiting time: 
                    <br/>
                    <span className='text-5xl text-white font-black'>{waitingTime}s</span>
                    <br />
                    expect &lt;60s
                </div>}
                </span>
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
