import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, } from "../components/ui/Carousel"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "../components/ui/Card"
import { Label } from "../components/ui/Label"
import { Textarea } from "../components/ui/Textarea"
import { useLocation, useNavigate } from "react-router"
import { useEffect, useState } from "react"
import { Button } from "../components/ui/Button"
import UnorderedListEditor from "../components/Slate"
import { ArrowLeft } from "lucide-react"
import { getSuggestions } from "../api/DietPlanner"

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

const DietEntry = () => {
    const location = useLocation();
    const { names } = location.state || {names: []};
    const { date } = location.state || {date: new Date()};
    
    const navigate = useNavigate();

    const [diets, setDiets] = useState({});
    const [api, setApi] = useState(() => { });
    const [page, setPage] = useState(0);
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        // console.log(location.state)
        let flag = false;
        if (localStorage.getItem("Diet-Planner-Diet")) {
            let d = JSON.parse(localStorage.getItem("Diet-Planner-Diet"));
            // console.log(d, names)
            if (names.length && Object.keys(d).length && names.every(name => Object.keys(d).includes(name))) {
                setDiets(d);
                flag = true;
            }
        }
        if(!flag) {
            for (let name of names) {
                diets[name] = Array.from({ length: data.length }, () => [""]);
            }
            setDiets({ ...diets });
        }
        getSuggestions().then(data => {
            setSuggestions([...data]);
        });
    }, []);

    useEffect(() => {
        if (!api) return;
        setPage(api.selectedScrollSnap() + 1);
        api.on("select", () => {
            setPage(api.selectedScrollSnap() + 1)
        });
    }, [api]);

    useEffect(() => {
        if (Object.keys(diets).length) {
            localStorage.setItem("Diet-Planner-Diet", JSON.stringify({ ...diets }));
        }
    }, [diets])

    const onDietChange = (val, name, i) => {
        val.forEach((v,j) => {
            diets[name][i][j] = v.trim();
        });
        setDiets({ ...diets });
    }

    const onSubmit = () => {
        navigate("/preview", { state: { diets, names, date } });
    }

    const onBackButtonClick = () => {
        navigate("/");
    }

    return (diets && Object.keys(diets).length) ?
        <Carousel className="flex w-full flex-col justify-center p-2 flex-1 overflow-y-auto" setApi={setApi}>
            <CarouselContent className="h-full">
                {data.map((item, i) => (<CarouselItem key={i} className="overflow-y-auto h-full">
                    <Card className="items-center bg-black/80 border-4 border-cyan-400">
                        <CardTitle className="flex items-center text-black w-[90%] gap-2 px-2 bg-cyan-400 rounded">
                            <Button variant="outline" onClick={onBackButtonClick} className="border-0">
                                <ArrowLeft/>
                            </Button>
                            <div className="flex flex-col">
                                <span className="text-2xl font-black">{item.title}</span>
                                <span className="text-lg">{item.time}</span>
                            </div>
                        </CardTitle>
                        <CardContent className="flex flex-col gap-2 w-full p-2">
                            {names.map((name, j) => (<div key={j} className="gap-2 flex flex-col w-full">
                                <Label className="text-2xl font-black text-cyan-400">{name}</Label>
                                {diets[name] &&
                                <UnorderedListEditor onListChange={(val) => onDietChange(val, name, i)}
                                    initialValue={diets[name][i].map(val => ({
                                        type: 'list-item',
                                        children: [{ text: val }]
                                    }))}
                                    suggestions={suggestions} placeholder="Enter diet here..."/>
                                }
                            </div>))}
                        </CardContent>
                    </Card>
                </CarouselItem>)
                )}
            </CarouselContent>
            <div className="flex gap-4 p-2 content-center">
                <CarouselPrevious />
                <CarouselNext />
                <span className="flex-1"></span>
                {page === data.length && <Button onClick={onSubmit} className="font-black">Done</Button>}
            </div>
        </Carousel>
        : undefined
}

export default DietEntry;