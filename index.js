require("dotenv").config();
const PORT = process.env.PORT || 8001;
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const tools = require("./tools");
app.use(bodyParser.json());

// Request logging middleware
app.use((req, res, next) => {
  const startTime = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    toolsCount: tools.length
  });
});

app.get("/cmnd-tools", (req, res) => {
  const getTools = () => {
    const toolsMapped = tools.map((t) => {
      return {
        name: t.name,
        description: t.description,
        jsonSchema: t.parameters,
        isDangerous: t.dangerous,
        functionType: t.functionType,
        isLongRunningTool: t.isLongRunningTool,
        rerun: t.rerun,
        prerequisites: t.prerequisites,
        postCallPrompt: t.postCallPrompt,
      };
    });
    return { tools: toolsMapped };
  };

  const toolsResponse = getTools();
  res.json(toolsResponse);
});

app.post("/run-cmnd-tool", async (req, res) => {
  try {
    const args = req.body;
    
    if (!args?.toolName) {
      return res.status(400).json({ error: "toolName is required" });
    }

    const toolToRun = tools.find((t) => t.name === args.toolName);
    
    if (!toolToRun) {
      return res.status(404).json({ error: `Tool '${args.toolName}' not found` });
    }

    const startTime = Date.now();
    const results = await toolToRun.runCmd(args.props, args.memory);
    const executionTime = Date.now() - startTime;

    res.json({
      success: true,
      toolName: args.toolName,
      data: results,
      executionTime: executionTime,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Tool execution error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

app.listen(PORT, () =>
  console.log(`server running on PORT http://localhost:${PORT}`)
);
