import axios from "axios";
import { useState } from "react";

function ResumeScreen({mode , setMode}) {
    
  const [resume, setResume] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [fileData, setFileData] = useState(null);
  const [prompt, setPrompt] = useState("");


  const handleFile = (e) => {
    const selected = e.target.files[0];
    setFileData(selected);
  }

  async function handleSubmit(type) {
    if(!resume && ! fileData) return;
    setLoading(true);

    const formdata = new FormData();
    if(resume) {
       formdata.append("resumeText", resume);
    }

    formdata.append("promptType", type);
    // formdata.append("customPrompt", prompt);

    if(fileData) {
      formdata.append("resume", fileData);
    }

    try {
      const request = await axios.post("https://ai-resume-analyzer-kbfe.onrender.com/analyze", 
        formdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResponse(request.data.result);
    } catch (err) {
      console.log("FULL ERROR:", err);
      console.log("RESPONSE:", err.response);
      console.log("DATA:", err.response?.data);
      setResponse(err.response?.data?.error || "Something went wrong");
    }
    setLoading(false);
  }

    return (
        <div className = "screen">
            <button className = "back" onClick = {() => setMode("")}>Back</button>
           {mode === "upload" && !fileData && (
           <div className="upload-section">
  <label className="upload-box">
     
        
        <input
      type="file"
      accept=".pdf"
      onChange={handleFile}
      hidden
    />
    <span> Upload Resume (PDF)</span> 
    
  </label> 

  
</div>)}
{fileData && <p className="file-name">Selected: {fileData.name}</p>}

            {mode === "paste" && (
                   <textarea
          placeholder="Paste your resume..."
          value={resume}
          onChange={(e) => setResume(e.target.value)}
          className="resume-box"
        />
            )}

        <div className = "prompt-bar">
            <textarea
          placeholder="Ask anyting about your resume..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button onClick = {() => handleSubmit("custom")}>➤</button>
        </div>    

        <div className = "buttons"> 
            <button onClick={() => handleSubmit("improve")}>
            Improve my resume
          </button>
          <button onClick={() => handleSubmit("ats")}>
            What is the ATS score of my resume
          </button>
          <button onClick={() => handleSubmit("analyze")}>
            Do a proper analysis of my resume
          </button>
          <button onClick={() => handleSubmit("talk")}>
            Give me summary of my resume
          </button>
        </div>

    {loading ? <p>Analyzing...</p> : <div className="result">{response}</div>}

        </div>
    )
}
export default ResumeScreen;