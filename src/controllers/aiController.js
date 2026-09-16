const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateTasks = async (req, res, next) => {
  try {
    const { projectDescription } = req.body;

    if (!projectDescription) {
      return res.status(400).json({
        success: false,
        message: "Project description is required",
      });
    }

    const response = await client.responses.create({
      model: "gpt-5.6-luna",
      input: `
You are an AI project management assistant.

Generate 5-8 practical development tasks based on this project:

${projectDescription}

Return ONLY valid JSON in this format:

{
  "tasks": [
    {
      "title": "Task title",
      "description": "Short task description",
      "priority": "low"
    }
  ]
}

Priority must be one of:
low, medium, high.
`,
    });

    const output = response.output_text;

    let result;

    try {
      result = JSON.parse(output);
    } catch (parseError) {
      return res.status(500).json({
        success: false,
        message: "AI returned an invalid response",
        raw: output,
      });
    }

    res.status(200).json({
      success: true,
      data: result.tasks || [],
    });
  } catch (error) {
    console.error("AI Error:", error);

    next(error);
  }
};

module.exports = {
  generateTasks,
};