
const agents = [
  {
    number: "01",
    name: "RUNNER",
    description:
      "Executes the suite autonomously across web, mobile, and API.",
  },
  {
    number: "02",
    name: "SPRINT PLANNER",
    description:
      "Plans test coverage and prioritizes scenarios for each sprint.",
  },
  {
    number: "03",
    name: "GENERATOR",
    description:
      "Generates test cases from application requirements and insights.",
  },
  {
    number: "04",
    name: "HEALER",
    description:
      "Detects broken tests and helps maintain reliable automation.",
  },
];

let currentAgent = 0;

function initAgentWorkflow() {
  const dashboard = document.getElementById("agent-dashboard");

  if (!dashboard || dashboard.dataset.agentInitialized === "true") {
    return;
  }

  dashboard.dataset.agentInitialized = "true";

  const number = document.getElementById("agent-number");
  const name = document.getElementById("agent-name");
  const description = document.getElementById("agent-description");

  if (!number || !name || !description) return;

  setInterval(() => {
    currentAgent = (currentAgent + 1) % agents.length;

    const agent = agents[currentAgent];

    number.textContent = agent.number;
    name.textContent = agent.name;
    description.textContent = agent.description;
  }, 3500);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAgentWorkflow);
} else {
  initAgentWorkflow();
}