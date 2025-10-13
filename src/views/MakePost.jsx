import { useState } from "react";
import { Button } from "../components/ui/Button";
import { Textarea } from "../components/ui/Textarea";
import UnorderedListEditor from "../components/Slate";
import { generateImages, generateKeywordTitle } from "../api/DietPlanner";
import { Download, Sparkle } from "lucide-react";

import * as htmlToImage from 'html-to-image';
// import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';

const sampleImages = ["https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?ixid=M3w4MTU1MTZ8MHwxfHNlYXJjaHwxfHxhcHBsZXxlbnwwfHx8fDE3NjAyODM3MjZ8MA&ixlib=rb-4.1.0"
,"https://images.unsplash.com/photo-1630563451961-ac2ff27616ab?ixid=M3w4MTU1MTZ8MHwxfHNlYXJjaHwyfHxhcHBsZXxlbnwwfHx8fDE3NjAyODM3MjZ8MA&ixlib=rb-4.1.0"
,"https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?ixid=M3w4MTU1MTZ8MHwxfHNlYXJjaHwzfHxhcHBsZXxlbnwwfHx8fDE3NjAyODM3MjZ8MA&ixlib=rb-4.1.0"
,"https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?ixid=M3w4MTU1MTZ8MHwxfHNlYXJjaHw0fHxhcHBsZXxlbnwwfHx8fDE3NjAyODM3MjZ8MA&ixlib=rb-4.1.0"
,"https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?ixid=M3w4MTU1MTZ8MHwxfHNlYXJjaHw1fHxhcHBsZXxlbnwwfHx8fDE3NjAyODM3MjZ8MA&ixlib=rb-4.1.0"];

const palette = [
    ["#fdf0d5","#c1121f","#003049"],
    ["#e5e5e5","#000000","#fca311"],
    ["#ebeb7f","#386641","#25aa00"],
    ["#ffd500","#00296b","#00509d"]
]

const Post = ({url="",title="",content="",palette=["#000","#fff","#fff"],name="",designation=""}) => {
    return <div id="my-post" className="flex p-[10%] items-center w-full aspect-[4/5] bg-cover bg-center relative overflow-hidden border-4 border-primary" style={{ backgroundColor: url ? undefined : "black", backgroundImage: url ? `url(${url})` : undefined, borderColor: palette[2] }}>
        {title && <div className="absolute top-2 left-0 h-fit bg-orange-500 flex flex-col p-1 px-4 rounded items-end shadow-sm" style={{background: palette[1], color: palette[0]}}>
            <span className="text-4xl py-2">{title}</span>
        </div>}
        <div className="h-fit w-full rounded flex justify-center flex-col p-[5%]" style={{background: palette[0]+"C0", color: palette[2]}}>
            <span className="flex flex-col text-4xl">
            {typeof content === "object" ? content.map(line => <span>
                {line}
            </span>) : content}</span>
        </div>
        {(name || designation) &&
        <div className="absolute bottom-2 right-0 h-fit flex flex-col p-1 px-4 rounded items-end shadow-sm" style={{background: palette[1], color: palette[0]}}>
            {name && <span className="text-xl">{name}</span>}
            {designation && <span className="text-xs">{designation}</span>}
        </div>}

    </div>
}

const MakePost = () => {
    const [contType, setContType] = useState(0);
    const [images, setImages] = useState([]);
    const [title, setTitle] = useState("");
    const [textPost, setTextPost] = useState("");
    const [listPost, setListPost] = useState([""]);
    const [urlSelected, setURLSelected] = useState(0);
    const [keyword, setKeyWord] = useState("");
    const [paletteSelected, setPaletteSelected] = useState(0);
    const [name, setName] = useState("");
    const [designation, setDesignation] = useState("");

    const getImagesGenerated = () => {
        generateImages(keyword).then(images => setImages(images));
    }
    const getTitle = () => {
        if(!confirm("Are you sure you want to generate the title?")) return;
        generateKeywordTitle(contType === 0 ? textPost : listPost.filter((line) => line.trim()).join("\n")).then((data) => {
            console.log(data);
            setTitle(data.title);
            setKeyWord(data.keyword);
        });
    }
    const downloadPost = () => {
        htmlToImage
        .toPng(document.getElementById('my-post'))
        .then((dataUrl) => {
            const a = document.createElement("a");
            a.href = dataUrl;
            a.download = (title||"Generated_Image")+".png";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });
    }

    return (<div className="max-w-[500px] flex flex-col p-2 items-center gap-2 overflow-auto text-lg font-bold m-2 border-4 border-cyan-400 bg-background rounded">
        <div className="rounded flex justify-center items-center p-2 w-full max-w-[500px] gap-2">
            <span>Content Type:</span>
            <span className="flex-1 gap-2 flex">
            <Button className="w-[50%] font-bold" variant={contType === 0 ? "default" : "outline"} onClick={() => setContType(0)}>Text</Button>
            <Button className="w-[50%] font-bold" variant={contType === 1 ? "default" : "outline"} onClick={() => setContType(1)}>List</Button>
            </span>
        </div>
        <div className="rounded p-2 w-full max-w-[500px]">
            {contType === 0 ? <Textarea className="bg-background text-2xl" value={textPost} placeholder="Enter post here..." onChange={(e) => setTextPost(e.target.value)}/> : 
            <UnorderedListEditor className="w-full" 
            initialValue={listPost.map(val => ({
                type: 'list-item',
                children: [{ text: val }]
            }))} onListChange={(val) => setListPost(val)}/>}
        </div>
        {(textPost.length > 15 || listPost.toString().length > 20) &&
        <div className="flex justify-center w-fit items-center p-2 w-full max-w-[500px]">
            {title ? <span>{title}</span> : 
            <Button onClick={getTitle} className="w-full text-xl"><Sparkle/>&nbsp;Generate Title</Button>}
        </div>}
        {keyword &&
        <div className="rounded flex justify-center items-center p-2 w-full max-w-[500px]">
            <div className="flex gap-2 w-full overflow-auto">
                {images.length === 0 ? <Button onClick={getImagesGenerated} className="w-full text-xl"><Sparkle/>&nbsp;Generate Images</Button> :
                images.map((imageURL, i) => <div className={`w-20 h-25 flex-shrink-0 bg-gray-200 flex items-center justify-center overflow-hidden ${urlSelected===i?"border-4 border-cyan-400":""} cursor-pointer`} key={i+"-urlKey"} onClick={()=>setURLSelected(i)}>
                    <img src={imageURL} alt="Image" className="w-full h-full object-cover"/>
                </div>)}
            </div>
        </div>}
        {(textPost.length > 15 || listPost.toString().length > 20) &&
        <div className="rounded flex justify-center items-center p-2 w-full max-w-[500px] gap-2">
            <span>Select Palette:</span>
            <div className="flex gap-2 flex-wrap">
            {palette.map((arr,i) => <span key={i+"-palette"} className={`flex w-fit border-4 ${paletteSelected === i && "border-cyan-400"} rounded box-border`} onClick={()=>setPaletteSelected(i)}>
                {arr.map((color,j) => <span key={j+"-color"} className={`aspect-square h-7 max-h-10 max-w-10 inline-block`} style={{background: color}}></span>)}
            </span>)}
            </div>
        </div>}
        <div className="rounded flex justify-center items-left p-2 w-full max-w-[500px] gap-2 flex-col">
            <span className="items-begin">Name:</span>
            <input placeholder="Enter name..." className="w-full bg-background border-4 border-cyan-400 rounded p-2 text-xl" maxLength={20} value={name} onChange={e=>setName(e.target.value)}/>
        </div>
        <div className="rounded flex justify-center items-left p-2 w-full max-w-[500px] gap-2 flex-col">
            <span>Designation:</span>
            <input placeholder="Enter designation..." className="w-full bg-background border-4 border-cyan-400 rounded p-2 text-xl" maxLength={30} value={designation} onChange={(e)=>setDesignation(e.target.value)}/>
        </div>
        {(textPost.length > 15 || listPost.toString().length > 20) &&
        <>
        <div className="rounded flex justify-center items-center p-2 w-full flex-col">
            <Post url={images.length && images[urlSelected]} title={title} content={contType === 0 ? textPost : listPost.filter((line,i) => line.trim()).map((line,i) => "• "+line)} palette={palette[paletteSelected]} name={name} designation={designation}/>
        </div>
        <Button className="width-full text-xl" onClick={downloadPost}><Download/>&nbsp;Download</Button>
        </>}
    </div>)
};

export default MakePost;