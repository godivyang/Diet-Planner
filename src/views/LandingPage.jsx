import H1 from "../components/ui/H1";
import { useState, useEffect } from "react";
import { Button } from "../components/ui/Button";
import { Moon, Sun } from "lucide-react";
import { Outlet, useNavigate } from "react-router";

const LandingPage = ({ userName }) => {
    const [theme, setTheme] = useState("");
    const [bgGif, setBgGif] = useState(null);

    useEffect(() => {
        let userTheme = localStorage.getItem("userTheme");
        if(!userTheme) {
            if(!root.classList.contains("dark")) changeTheme({_theme:"dark"});
            setTheme("dark");
            localStorage.setItem("userTheme", "dark");
        } else {
            if(!root.classList.contains(userTheme)) changeTheme({_theme:userTheme});
            setTheme(userTheme);
        }
    }, []);

    useEffect(() => {
        setBgGif(theme === "dark" ?
        "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExY2sxdHplMm1mazJqaXhxNjNnN2NocmVvN25seGN4c2cxYnR3YWxqayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/U3qYN8S0j3bpK/giphy.gif" :
        "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExcHMyM2Y4czZ5ZTVpazcxZHNzNTB0bHo5anNpanR0aHY3cmpldmtybyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26tn9VcEGATKdw8xi/giphy.gif")
    }, [theme]);
    
    const changeTheme = ({_theme}) => {
        const root = document.documentElement;
        root.classList.add("disable-transitions");

        setTheme(theme === "dark" ? "light" : "dark");
        if (_theme === "light" || (!_theme && root.classList.contains("dark"))) {
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
    <div className="flex flex-col items-center w-full h-screen selection:bg-foreground selection:text-background">
        <img
            src={bgGif}
            alt="Background GIF"
            className="absolute top-0 left-0 w-screen h-screen object-cover"
        />
        <div className="flex flex-col z-10 w-full h-full">
        <div className="flex w-full p-1">
            <H1 text="Diet Planner" />
            <span className="flex-1"/>
            {userName && <Button className="text-lg bg-cyan-400 font-bold">{userName}</Button>}
            <Button variant="outline" onClick={changeTheme} size="icon">
                {theme === "dark" ? <Sun/> : <Moon/>}
            </Button>
        </div>
        <Outlet/>
        </div>
    </div>)
}

export default LandingPage;