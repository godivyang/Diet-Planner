import { useState } from "react";
import { Button } from "../components/ui/Button";
import { Textarea } from "../components/ui/Textarea";
import UnorderedListEditor from "../components/Slate";
import { generateImages, generateKeywordTitle } from "../api/DietPlanner";
import { AlignLeft, Download, List, Sparkle } from "lucide-react";

import * as htmlToImage from 'html-to-image';
// import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';

const sampleImages = [
    "https://images.unsplash.com/photo-1502082553048-f009c37129b9",
    "https://images.unsplash.com/photo-1495567720989-cebdbdd97913",
    "https://images.unsplash.com/photo-1503264116251-35a269479413",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    "https://images.unsplash.com/photo-1518837695005-2083093ee35b",
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745",
    "https://images.unsplash.com/photo-1503602642458-232111445657",
    "https://images.unsplash.com/photo-1501594907352-04cda38ebc29",
    "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368"];

const palette = [
    ["#fdf0d5","#c1121f","#003049"],
    ["#ffffff","#000000","#d90429"],
    ["#b2ff9e","#3c1642","#086375"],
    ["#ffd500","#00296b","#00509d"]
]

const Post = ({url="",title="",content="",palette=["#000","#fff","#fff"],name="",designation=""}) => {
    const calculateFontSize = (length) => {
        if(typeof content === "object") length += content.length * 10;
        if(length < 50) return "text-4xl";
        else if(length < 100) return "text-3xl";
        else if(length < 150) return "text-2xl";
        else if(length < 200) return "text-xl";
        else if(length < 250) return "text-lg";
        else if(length < 300) return "text-md";
        else if(length < 350) return "text-sm";
        return "text-xs";
    }

    return <div id="my-post" className="flex p-[10%] items-center w-full aspect-[4/5] bg-cover bg-center relative overflow-hidden border-[5px] border-primary rounded" style={{ backgroundColor: url ? undefined : "black", backgroundImage: url ? `url(${url})` : undefined, borderColor: palette[0] }}>
        {title && <div className="absolute top-2 left-0 h-fit bg-orange-500 flex flex-col px-4 rounded items-end shadow-sm" style={{background: palette[1], color: palette[0]}}>
            <span className="text-2xl">{title}</span>
        </div>}
        <div className="h-max-[90%] h-fit w-full rounded flex justify-center flex-col p-[5%]" style={{background: palette[0]+"C0", color: palette[2]}}>
            <span lang="en" className={`h-full flex flex-col gap-2 ${calculateFontSize(content.toString().length)}`}>
            {typeof content === "object" ? content.map(line => <span>
                {line}
            </span>) : content}</span>
        </div>
        {(name || designation) &&
        <div className="absolute bottom-2 right-0 h-fit flex flex-col px-4 rounded items-end shadow-sm" style={{background: palette[1], color: palette[0]}}>
            {name && <span className="text-2xl">{name}</span>}
            {designation && <span className="text-sm">{designation}</span>}
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
        if(!keyword) {
            let post = "Title: " + title + "\nContent: \n" + contType === 0 ? textPost : listPost.filter((line) => line.trim()).join("\n");
            generateKeywordTitle(post).then(data => {
                setKeyWord(data.keyword);
                generateImages(data.keyword).then(images => {
                    setImages([...images, ...sampleImages]);
                });
            })
        } else {
            generateImages(keyword).then(images => setImages([...images, ...sampleImages]));
        }
    }
    const getTitle = () => {
        if(!confirm("Are you sure you want to generate the title?")) return;
        generateKeywordTitle(contType === 0 ? textPost : listPost.filter((line) => line.trim()).join("\n")).then((data) => {
            // console.log(data);
            if(!title) setTitle(data.title);
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
    const isContentOfValidLength = () => {
        return ((contType === 0 && textPost.length > 15) || (contType === 1 && listPost.toString().length > 20));
    }

    return (<div className="max-w-[600px] w-full flex flex-col p-2 items-center gap-2 overflow-auto text-lg font-bold m-2 border-4 border-cyan-400 bg-background rounded">
        <div className="rounded flex p-2 w-full max-w-[500px] gap-2 flex-col">
            <span>Content Type:</span>
            <span className="flex-1 gap-2 flex w-full">
            <Button className="w-[50%] font-bold text-xl" variant={contType === 0 ? "default" : "outline"} onClick={() => setContType(0)}><AlignLeft/>&nbsp;Text</Button>
            <Button className="w-[50%] font-bold text-xl" variant={contType === 1 ? "default" : "outline"} onClick={() => setContType(1)}><List/>&nbsp;List</Button>
            </span>
        </div>
        <div className="rounded p-2 w-full max-w-[500px] gap-2 flex flex-col">
            Content:
            {contType === 0 ? <Textarea className="bg-background text-2xl" value={textPost} placeholder="Enter post here..." onChange={(e) => setTextPost(e.target.value)}/> : 
            <UnorderedListEditor className="w-full" 
            initialValue={listPost.map(val => ({
                type: 'list-item',
                children: [{ text: val }]
            }))} onListChange={(val) => setListPost(val)}/>}
        </div>
        <div className="flex w-fit p-2 w-full max-w-[500px] flex-col gap-2">
            Heading:
            <input className="w-full bg-background border-4 border-cyan-400 rounded p-2 text-xl" maxLength={20} value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Enter Title..."/>
            {isContentOfValidLength() && keyword.length === 0 &&
            <Button onClick={getTitle} className="w-full text-xl"><Sparkle/>&nbsp;Generate</Button>}
        </div>
        {keyword &&
        <div className="gap-2 flex p-2 w-full max-w-[500px] flex-col">
            Images:
            <div className="flex gap-2 w-full overflow-auto">
                {images.length === 0 ? <Button onClick={getImagesGenerated} className="w-full text-xl"><Sparkle/>&nbsp;Generate Images</Button> :
                images.map((imageURL, i) => <div className={`w-20 h-25 flex-shrink-0 bg-gray-200 flex items-center justify-center overflow-hidden ${urlSelected===i?"border-4 border-cyan-400":""} cursor-pointer`} key={i+"-urlKey"} onClick={()=>setURLSelected(i)}>
                    <img src={imageURL} alt="Image" className="w-full h-full object-cover"/>
                </div>)}
            </div>
        </div>}
        {isContentOfValidLength() &&
        <div className="rounded flex p-2 w-full max-w-[500px] gap-2 flex-col">
            <span>Colour Scheme:</span>
            <div className="flex gap-2 flex-wrap">
            {palette.map((arr,i) => <span key={i+"-palette"} className={`flex w-fit border-4 ${paletteSelected === i && "border-cyan-400"} rounded box-border`} onClick={()=>setPaletteSelected(i)}>
                {arr.map((color,j) => <span key={j+"-color"} className={`aspect-square h-7 max-h-10 max-w-10 inline-block`} style={{background: color}}></span>)}
            </span>)}
            </div>
        </div>}
        <div className="flex p-2 w-full max-w-[500px] gap-2 flex-col">
            <span className="items-begin">Name:</span>
            <input placeholder="Enter name..." className="w-full bg-background border-4 border-cyan-400 rounded p-2 text-xl" maxLength={20} value={name} onChange={e=>setName(e.target.value)}/>
        </div>
        <div className="flex p-2 w-full max-w-[500px] gap-2 flex-col">
            <span>Designation:</span>
            <input placeholder="Enter designation..." className="w-full bg-background border-4 border-cyan-400 rounded p-2 text-xl" maxLength={30} value={designation} onChange={(e)=>setDesignation(e.target.value)}/>
        </div>
        {isContentOfValidLength() &&
        <>
        <div className="rounded flex justify-center items-center p-2 w-full flex-col">
            <Post url={images.length && images[urlSelected]} title={title} content={contType === 0 ? textPost : listPost.filter((line,i) => line.trim()).map((line,i) => "• "+line)} palette={palette[paletteSelected]} name={name} designation={designation}/>
        </div>
        <Button className="width-full text-xl" onClick={downloadPost}><Download/>&nbsp;Download</Button>
        </>}
    </div>)
};

export default MakePost;