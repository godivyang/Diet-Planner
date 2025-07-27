import H1 from "../components/ui/H1";
import { useState, useEffect } from "react";
import { Button } from "../components/ui/Button";
import { Moon, Sun } from "lucide-react";
import { Outlet, useNavigate } from "react-router";

const LandingPage = ({ userName }) => {
    const [theme, setTheme] = useState("");

    useEffect(() => {
        let userTheme = localStorage.getItem("userTheme");
        if(!userTheme) {
            if(!root.classList.contains("dark")) changeTheme({theme:"dark"});
            setTheme("dark");
            localStorage.setItem("userTheme", "dark");
        } else {
            if(!root.classList.contains(userTheme)) changeTheme({theme:userTheme});
            setTheme(userTheme);
        }
    }, []);
    
    const changeTheme = ({theme}) => {
        const root = document.documentElement;
        root.classList.add("disable-transitions");

        setTheme(theme === "dark" ? "light" : "dark");
        if (theme === "light" || (!theme && root.classList.contains("dark"))) {
            root.classList.remove("dark");
            localStorage.setItem("userTheme", "light");
        } else {
            root.classList.add("dark");
            localStorage.setItem("userTheme", "dark");
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
            {userName && <Button className="text-lg bg-cyan-500 font-bold">{userName}</Button>}
            <Button variant="outline" onClick={changeTheme} size="icon">
                {theme === "dark" ? <Sun/> : <Moon/>}
            </Button>
        </div>
        <Outlet/>
    </div>)
}

export default LandingPage;