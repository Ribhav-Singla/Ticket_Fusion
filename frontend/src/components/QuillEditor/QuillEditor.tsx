import { useEffect, useState } from "react";
import "./QuillEditor.css";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline",'strike'],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["clean"],
];

function QuillEditor({setEventDetails,description}:{setEventDetails:any,description:any}) {  
  //@ts-ignore
  const [editorContent, setEditorContent] = useState();
  
  useEffect(() => {
    // const options = {
    //   debug: "info",
    //   modules: {
    //     toolbar: true,
    //   },
    //   placeholder: "Compose a description...",
    //   theme: "snow",
    // };
    //@ts-ignore
    const quill = new Quill("#editor", {
      theme: "snow",
      modules: {
        toolbar: TOOLBAR_OPTIONS,
      },
    });

    // Add event listener to update state on text change
    if(description){
      quill.root.innerHTML= description;
    }
    console.log('quill root html is: ',description);
    
    quill.on("text-change", () => {
      //@ts-ignore
      setEditorContent(quill.root.innerHTML)
      //@ts-ignore
      setEventDetails((prev)=>{
        return {...prev , description:quill.root.innerHTML}
      })
    });
  }, []);
  return (
    <>
    <div className="w-full mt-7 rounded-md">
        <label>Description</label>
        <div id="editor" className="bg-slate-100 rounded-b-lg">
        </div>
    </div>
    </>
  );
}

export default QuillEditor;
