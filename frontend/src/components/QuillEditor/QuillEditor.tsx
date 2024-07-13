import { useEffect, useState } from "react";
import "./QuillEditor.css";
import Quill from "quill";
import "quill/dist/quill.snow.css";

function QuillEditor({setEventDetails,description}) {  
  const [editorContent, setEditorContent] = useState();
  
  useEffect(() => {
    const options = {
      debug: "info",
      modules: {
        toolbar: true,
      },
      placeholder: "Compose a description...",
      theme: "snow",
    };
    //@ts-ignore
    const quill = new Quill("#editor", options);

    // Add event listener to update state on text change
    if(description){
      quill.root.innerHTML= description;
    }
    console.log('quill root html is: ',description);
    
    quill.on("text-change", () => {
      setEditorContent(quill.root.innerHTML)
      setEventDetails((prev)=>{
        return {...prev , description:quill.root.innerHTML}
      })
    });
  }, []);
  return (
    <>
    <div className="w-full mt-7 rounded-md">
        <label>Description</label>
      <div id="editor" className="bg-slate-100 min-h-72 rounded-b-lg">
      </div>
    </div>
    </>
  );
}

export default QuillEditor;
