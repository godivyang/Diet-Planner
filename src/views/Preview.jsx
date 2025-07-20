import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "../components/ui/Card"
import { Label } from "../components/ui/Label"
import { useLocation, useNavigate } from "react-router"
import { useEffect, useRef, useState } from "react"
import { Button } from "../components/ui/Button"
import { ArrowLeft, Check, Key } from "lucide-react"
import { addDiet } from "../api/DietPlanner"

const data = [
    { title: "Early Morning", time: "7:00 am - 8:00 am" },
    { title: "Breakfast", time: "9:00 am - 10:00 am" },
    { title: "Mid Day", time: "12:00 noon" },
    { title: "Lunch", time: "1:00 pm - 2:00 pm" },
    { title: "Afternoon Snack", time: "3:00 pm" },
    { title: "Tea Time", time: "4:00 pm" },
    { title: "Evening Snack", time: "5:00 pm" },
    { title: "Dinner", time: "6:00 pm - 7:00 pm" },
    { title: "Before Bed", time: "1 hour before bed" }
]

const emojis = ["🍎","🍊","🥦","🥑","🥝","☕️","🍛","🥥","🥪","🥛","🍁","🌷","🪷","🌹","🌺","🌻","🌼","🌞","🪻","🌸"];

const Preview = () => {
    const location = useLocation();
    const { names } = location.state || {names:[]};
    const { diets } = location.state || {diets:{}};
    const { date } = location.state || {date:new Date()}

    const navigate = useNavigate();

    const [randomEmojis, setRandomEmojis] = useState([]);
    const [clipboardText, setClipboardText] = useState("");
    const [copiedSuccessfully, setCopiedSuccessfully] = useState(false);

    useEffect(() => {
        let re = diets[names[0]] && diets[names[0]].map(_ => emojis[Math.floor(Math.random() * emojis.length)]);
        setRandomEmojis(re || []);
        let ct = "";
        ct += "'''" + names.join(", ") + "'''\n";
        ct += "*" + date.toDateString() + "*\n";
        if(names.length) {
            diets[names[0]].forEach((_,i) => {
                let flag = true;
                for(let n of names) {
                    if(diets[n][i].filter(d => d).length) {
                        flag = false;
                        break;
                    }
                }
                if(flag) return;
                ct += Array(7).fill(0).map(() => re[i]).join("") + "\n";
                ct += "*" + data[i].title + "*\n";
                ct += "_" + data[i].time + "_\n";
                names.forEach((name) => {
                    if(diets[name][i].length === 0 || diets[name][i].length === 1 && diets[name][i][0] === "") {
                        return undefined;
                    }
                    if(names.length > 1) ct += "'''" + name + "'''\n";
                    ct += "• " + diets[name][i].join("\n• ") + "\n";
                });
            });
        }

        setClipboardText(ct);
    }, [names, diets]);

    const onBackButtonClick = () => {
        navigate("/diet", { state: { names, date } });
    }

    const onCopyButtonClick = () => {
        // localStorage.removeItem("Diet-Planner-Diet");
        if(!copiedSuccessfully) {
            addDiet(diets);
        }
        setCopiedSuccessfully(true);
        
        navigator.clipboard.writeText(clipboardText);
        console.log(clipboardText);
    }

    return <div className="w-full">
    <Card className="m-2">
        <CardTitle>
            <div className="mx-2 flex gap-2">
                <Button variant="outline" onClick={onBackButtonClick}><ArrowLeft/></Button>
                <Label>Diet Preview</Label>
            </div>
        </CardTitle>
        <CardContent className="flex flex-col w-full m-2">
            <strong>{names.join(", ")}</strong>
            <strong>{date.toDateString()}</strong>
            {names.length && diets[names[0]].map((diet, i) => {
                let flag = true;
                for(let n of names) {
                    if(diets[n][i].filter(d => d).length) {
                        flag = false;
                        break;
                    }
                }
                if(flag) return undefined;
                return (<div key={i}>
                <div>{Array(7).fill(0).map((_,j) => randomEmojis[i])}</div>
                <div className="flex flex-col">
                    <strong>{data[i].title}</strong> 
                    <i>{data[i].time}</i>
                </div>
                {names.map((name,j) => {
                    if(diets[name][i].length === 0) {
                        return undefined;
                    } else if(diets[name][i].length === 1 && diets[name][i][0] === "") {
                        return undefined;
                    }
                    return (
                        <div className="py-2" key={j}>
                        {names.length > 1 && <Label>{name}</Label>}
                        <ul className="list-disc">
                            {diets[name][i].map((d,k) => <li key={k}>{d}</li>)}
                        </ul>
                        </div>
                    )
                })}
                </div>)
            })}
        </CardContent>
        <CardFooter>
            <Button onClick={onCopyButtonClick}>
                {copiedSuccessfully && <Check className="mx-2"/>} Copy Diet
            </Button>
        </CardFooter>
    </Card>
    </div>
}

export default Preview;