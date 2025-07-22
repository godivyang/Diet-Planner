import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "../components/ui/Card"
import { Combobox } from "../components/ui/Combobox";
import { Calendar28 } from "../components/ui/DatePicker";
import { Button } from "../components/ui/Button";
import { addName, getNames, removeName } from "../api/DietPlanner";
import { Input } from "../components/ui/Input";
import { Label } from "@radix-ui/react-label";
import { ArrowLeft, Delete, DeleteIcon, Plus, Trash, X } from "lucide-react";

const HomePage = () => {
    const navigate = useNavigate();

    const [names, setNames] = useState([]);
    const [allNames, setAllNames] = useState([]);
    const [date, setDate] = useState(new Date());
    const [addNewNameVisible, setAddNewNameVisible] = useState(true);

    const [newName, setNewName] = useState("");

    useEffect(() => {
        getNames().then(data => {
            setAllNames([...data]);
            if (data.length) setAddNewNameVisible(false);
            else setAddNewNameVisible(true);
        });
    }, []);

    const goToDietEntry = () => {
        if (names.length) navigate("diet", { state: { names, date } });
    };

    const addNewName = () => {
        if (newName) addName(newName).then(data => setAllNames([...data]));
        setNewName("");
        setAddNewNameVisible(false);
        getNames().then(data => {
            setAllNames([...data]);
        });
    };

    const deleteName = (_id) => {
        removeName(_id).then(data => setAllNames([...data]));
    }

    return (
        <>
            {!addNewNameVisible && 
            <div className="flex w-full">
                <Button onClick={() => setAddNewNameVisible(true)} className="text-2xl m-2" variant="Outline"><Plus/>&nbsp;Name</Button>
            </div>}
            {!addNewNameVisible && <Card className="m-2 bg-muted-foreground">
                <CardContent className="flex flex-col gap-2">
                    <Combobox data={allNames} onChange={(selected) => setNames(selected)}/>
                    <Calendar28 onChange={(date) => setDate(date)} className=" text-2xl"/>
                    <Button onClick={goToDietEntry} className="text-2xl mt-10   ">Next</Button>
                </CardContent>
            </Card>}
            {addNewNameVisible && <Card className="m-2">
                <CardTitle className="flex gap-2 items-center">
                    {!!allNames.length &&
                    <Button variant="outline" onClick={() => setAddNewNameVisible(false)} >
                        <ArrowLeft />
                    </Button>}
                    Add a new name
                </CardTitle>
                <CardContent className="flex flex-col gap-2 w-full">
                    <Input onChange={(e) => setNewName(e.target.value)} className="text-2xl my-4" placeholder="Add new name here..."></Input>
                    {newName && <Button onClick={addNewName}>Add name</Button>}
                    {!!allNames.length && <>
                        <Label className="font-bold">All names:</Label>
                        <ul>
                            {allNames.map(name => <Card key={name._id} className="m-2">
                                <CardContent className="w-full flex items-center">
                                    {name.name}
                                    <span className="flex-1"></span>
                                    <Button size="sm" onClick={() => deleteName(name._id)} className="bg-red-500"><X /></Button>
                                </CardContent>
                            </Card>)}
                        </ul>
                    </>}
                </CardContent>
            </Card>}
        </>)
}

export default HomePage;