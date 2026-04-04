function HomeScreen({setMode}) {
    return (
    <div className="home">
        <h1>AI Resume Analyzer</h1>
        
        <div className = "home-buttons">
            <button onClick = {() => setMode("paste")}> Paste your resume text</button>
            <button onClick = {() => setMode("upload")}>Uploade your resume pdf</button>
        </div>
    </div>
    );
}

export default HomeScreen;