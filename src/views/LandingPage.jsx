import H1 from "../components/ui/H1";
import { useState } from "react";
import { Button } from "../components/ui/Button";
import { Moon, Sun } from "lucide-react";
import { Outlet, useNavigate } from "react-router";

const LandingPage = ({ userName }) => {
    const [theme, setTheme] = useState("");
    
    const changeTheme = () => {
        const root = document.documentElement;
        root.classList.add("disable-transitions");

        setTheme(theme === "dark" ? "light" : "dark");
        if (root.classList.contains("dark")) {
            root.classList.remove("dark");
        } else {
            root.classList.add("dark");
        }

        setTimeout(() => {
            root.classList.remove("disable-transitions");
        }, 200);
    };

    return (
    <div className="flex flex-col items-center w-full selection:bg-foreground selection:text-background">
        <div className="flex w-full p-1">
            <H1 text="Diet Planner" />
            <span className="flex-1"/>
            <span className="me-2 font-bold">Welcome {userName}!</span>
            <Button variant="outline" onClick={changeTheme} size="icon">
                {theme === "dark" ? <Sun/> : <Moon/>}
            </Button>
        </div>
        <Outlet/>
    </div>)
}

export default LandingPage;