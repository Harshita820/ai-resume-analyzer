import axios from "axios";
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [resume, setResume] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [fileData, setFileData] = useState(null);
  const [prompt, setPrompt] = useState("");

  async function handleSubmit(type) {
    if(!resume && ! fileData) return;
    setLoading(true);

    const formdata = new FormData();
    if(resume) {
       formdata.append("resumeText", resume);
    }

    formdata.append("promptType", type);
    formdata.append("customPrompt", prompt);

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
      console.log(err.response?.data); 
      setResponse("Something went wrong");
    }
    setLoading(false);
  }

  async function testAPI() {
    const res = await axios.get("https://ai-resume-analyzer-kbfe.onrender.com");
    console.log(res.data);
  }

  useEffect(() => {
    testAPI();
  }, []);

  return (
    <div className="container">
      <div className="card">
        <h1>AI Resume Analyzer</h1>
        <div>
        <textarea
          placeholder="Paste your resume..."
          value={resume}
          onChange={(e) => setResume(e.target.value)}
        />

        <textarea
          placeholder="Write your custom prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <input type = "file" accept = ".pdf" onChange = {(e) => setFileData(e.target.files[0])}/>
         <button onClick={() => handleSubmit("send")}>
            Send
          </button>
        </div>

        <div className="buttons">
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

        {loading ? <p>Loading...</p> : <div className="result">{response}</div>}
      </div>
    </div>
  );
}

export default App;

//input text box for custom prompt
//attach resume feature
//initial screen: either show two buttons, one paste resume another attach resume
//if i click paste then the text area appears, if i click attach file explorer opens
//after that i can click any of the prompt buttons or write own custom prompt and click send
//then the result will be shown below. 