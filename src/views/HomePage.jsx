import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "../components/ui/Card"
import { Combobox } from "../components/ui/Combobox";
import { Calendar28 } from "../components/ui/DatePicker";
import { Button } from "../components/ui/Button";
import { addName, getNames, removeName } from "../api/DietPlanner";
import { Input } from "../components/ui/Input";
import { Label } from "@radix-ui/react-label";
import { ArrowLeft, Delete, DeleteIcon, Plus, Sparkles, Trash, X } from "lucide-react";

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

  const goToMakePost = () => {
    navigate("post");
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
  };

  return (
    <>
      {!addNewNameVisible &&
        <div className="flex w-full justify-between">
          <Button onClick={() => setAddNewNameVisible(true)} className="text-2xl m-2" variant="Outline"><Plus />&nbsp;Name</Button>
          <Button onClick={() => goToMakePost()} className="text-xl font-bold m-2 bg-cyan-400"><Sparkles/>&nbsp;Make Post</Button>
        </div>}
      {!addNewNameVisible && <Card className="m-8 bg-black/80 font-bold border-4 border-cyan-400 max-w-[500px]">
        <CardContent className="flex flex-col gap-2">
          <Combobox data={allNames} onChange={(selected) => setNames(selected)} />
          <Calendar28 date={date} onDateChange={setDate} className=" text-2xl" />
          {!!names.length &&
            <Button onClick={goToDietEntry} className="text-2xl mt-10 font-black">Next</Button>}
        </CardContent>
      </Card>}
      {addNewNameVisible && !!allNames.length && <Card className="h-[90vh] w-full max-w-[500px] flex flex-col border-4 border-cyan-400 bg-black/80">
        <CardTitle className="flex gap-2 items-center m-2 p-2 bg-cyan-400 text-black rounded font-black">
          {!!allNames.length &&
            <Button variant="outline" onClick={() => setAddNewNameVisible(false)} className="border-0">
              <ArrowLeft />
            </Button>}
          Add a new name
        </CardTitle>

        <CardContent className="flex flex-col gap-2 w-full flex-1 min-h-0">
          <Input
            onChange={(e) => setNewName(e.target.value)}
            className="text-2xl my-2 bg-background font-bold h-20"
            placeholder="Add new name here..."
          />
          {newName && (
            <Button onClick={addNewName} className="border-0 font-black text-xl">
              Add name
            </Button>
          )}

          {!!allNames.length && (
            <div className="flex flex-col flex-1 min-h-0">
              <Label className="font-bold">All names:</Label>
              <ul className="flex-1 overflow-y-auto min-h-0">
                {allNames.map(name => (
                  <Card key={name._id} className="m-2 border-2 border-cyan-400">
                    <CardContent className="w-full flex items-center font-bold">
                      {name.name}
                      <span className="flex-1"></span>
                      <Button size="sm" onClick={() => deleteName(name._id)} className="bg-red-500">
                        <X />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
      }
    </>)
}

export default HomePage;