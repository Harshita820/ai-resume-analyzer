const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const Groq = require("groq-sdk");
const multer = require("multer");
const pdfParse = require("pdf-parse");
console.log("pdfParse type:", typeof pdfParse);
console.log("pdfParse value:", pdfParse);
const PORT = process.env.PORT || 5000;;

dotenv.config();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 }});
const app = express();

app.use(cors());
app.use(express.json());

//GROQ setup
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

//main AI route

console.log("---- NEW REQUEST ----");

app.post("/analyze", upload.single("resume"), async (req, res) => {
  console.log("BODY:", req.body);
  console.log("FILE:", req.file);
  try {
    let resumeText = req.body.resumeText;
    const { promptType, customPrompt} = req.body;

    if(req.file) {
      console.log("File received:", req.file.originalname);
       try {
    const pdfData = await pdfParse(req.file.buffer);
    console.log("Extracted text length:", pdfData.text.length); // 👈 ADD
    resumeText = pdfData.text;
  } catch (err) {
    console.error("PDF Parse Error:", err); // 👈 ADD
    return res.status(400).json({
      error: "Failed to read PDF file",
    });
  }
    }

    if (!resumeText) {
      return res.status(400).json({
        error: "Resume Text is required",
      });
    }

    let prompt = "";

    if (promptType === "improve") {
      prompt = `
You are a professional resume writer.

Improve the following resume:
- Use strong action verbs
- Make it concise
- Highlight achievements

Resume:
${resumeText} 
${customPrompt}
`;
    } else if (promptType === "ats") {
      prompt = `Analyze this resume for ATS compatibility.

Return:
- ATS score out of 100
- Missing keywords
- Formatting issues
- Suggestions

Return response in JSON format:

{
  "atsScore": number,
  "strengths": [],
  "weaknesses": [],
  "suggestions": []
}

Resume:
${resumeText} 
${customPrompt}
`;

    } else if (promptType === "analyze") {
      prompt = `
Act as a hiring manager.

Analyze this resume and provide:
- Strengths
- Weaknesses
- Missing skills
- Suggestions to improve

Resume:
${resumeText} 
${customPrompt}
`;
    } else {
      prompt = `${resumeText} 
${customPrompt}
` ;
    }
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    res.json({
      result: completion.choices[0].message.content,
    });
  } catch (err) {
    console.error("Error: ", err);

    res.status(500).json({
      error: "Something went wrong",
    });
  }
});

app.get("/", (req, res) => {
  res.send("API is running");
});

app.listen(PORT, () => {
  console.log(`Server is running in port ${PORT}`);
  console.log("API KEY:", process.env.GROQ_API_KEY);
});

app.use((err, req, res, next) => {
  console.error("MULTER ERROR:", err);

  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      error: err.message,
    });
  }

  res.status(500).json({
    error: err.message || "Something went wrong",
  });
});
