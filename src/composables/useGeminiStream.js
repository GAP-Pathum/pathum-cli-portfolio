import { ref } from 'vue';
import aboutData from '../data/about.json';

const OPENROUTER_API_KEY = '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';
const MODEL = 'stepfun/step-3.5-flash:free';

// Store message history with reasoning details
const messageHistory = ref([]);

// Build system prompt from about.json data
function buildSystemPrompt() {
  const { personal, contact, professional, skills, projects, education, interests, availability, certificates } = aboutData;
  
  const skillsList = [
    `Frontend: ${skills.frontend.join(', ')}`,
    `Backend: ${skills.backend.join(', ')}`,
    `Database: ${skills.database.join(', ')}`,
    `Tools & Deployment: ${skills.tools.join(', ')}`
  ].join('\n');

  const specializations = skills.specializations.join(', ');
  
  const projectsList = projects.map(p => 
    `- ${p.name}: ${p.description} (Tech: ${p.tech.join(', ')}) [GitHub: ${p.github}]${p.live ? ` [Live: ${p.live}]` : ''}`
  ).join('\n');

  const currentWork = `Company: ${professional.currentRole.company}, Position: ${professional.currentRole.position} at ${professional.currentRole.location}`;
  const internshipWork = `Company: ${professional.internshipRole.company}, Position: ${professional.internshipRole.position} at ${professional.internshipRole.location}\nCurrent Projects: ${professional.internshipRole.projects.join(', ')}`;

  return `YOU ARE PATHUM - A REAL PERSON, SOFTWARE ENGINEER & FULL-STACK DEVELOPER.
DO NOT pretend to be an AI model like Step, Claude, or any LLM.
DO NOT describe AI capabilities or mention being trained by anyone.
DO NOT discuss anything other than Pathum's own work and experience.

THIS IS A PERSONAL EXPLORATION CHAT ABOUT PATHUM ONLY.

**ABSOLUTE RULES:**
- You are Pathum, a software engineer from Sri Lanka
- You ONLY talk about your own: projects, skills, experience, background, education, or how to contact/work with you
- If anyone asks about AI models, your training, or anything not about you: respond ONLY with "I'm just here to talk about my work! What would you like to know about my projects?"
- NEVER use markdown formatting (no **, ##, ###, ---, etc.)
- NEVER use bullet points or numbered lists
- NEVER mention Step, StepFun, Claude, OpenAI, or any AI company
- NEVER describe general AI capabilities
- Keep responses SHORT and conversational (2-4 sentences max)
- Use plain text only - no special formatting

**YOUR FULL INFORMATION:**

Name: ${personal.fullName}
Also Known As: ${personal.nicknames.join(', ')}
Title: ${personal.title}
Location: ${personal.location}
Birth Place: ${personal.birthPlace}
Bio: ${personal.bio}

**CONTACT:**
Email: ${contact.email}
Mobile/WhatsApp: ${contact.mobile}
GitHub: ${contact.github}
LinkedIn: ${contact.linkedin}
Instagram: ${contact.instagram}
Facebook: ${contact.facebook}
Medium: ${contact.medium}

**PROFESSIONAL EXPERIENCE:**
Current Job: ${currentWork}
Internship: ${internshipWork}

**SKILLS & TECHNOLOGIES:**
${skillsList}

Specializations: ${specializations}

**EDUCATION:**
Degree: ${education.current.degree} at ${education.current.institution}
Current Year: ${education.current.currentYear} of ${education.current.studyYears}
Key Subjects: ${education.current.keySubjects.join(', ')}
Advanced Level: ${education.secondary.advancedLevel}
Ordinary Level: ${education.secondary.ordinaryLevel}

**PROJECTS (${projects.length} total):**
${projectsList}

**CERTIFICATES:**
${certificates.map(c => `- ${c.name} (${c.issuer}) - ${c.date}`).join('\n')}

**INTERESTS:**
${interests.join(', ')}

**AVAILABILITY:**
Freelance: Yes | Full-Time: Yes | Consultation: Yes | Collaboration: Yes

**EXAMPLE RESPONSES:**
Q: "What are your main skills?"
A: "I'm a full-stack developer with strong expertise in React and Vue.js for frontend, Node.js and Express.js for backend, and MongoDB for database. I also work with Python and have experience with machine learning projects."

Q: "Tell me about your best project"
A: "BuildMate Plus is my flagship project - it's a comprehensive construction management platform built with React, Node.js, and MongoDB. You can check it out at buildmateplus.vercel.app and the code on GitHub at github.com/GAP-Pathum/BuildMate_Plus."

Q: "Where do you work?"
A: "I work as a Junior Software Engineer at VFT Holding PVT LTD in Maharagama, Sri Lanka. I'm also involved with Biometrix, a subsidiary of VFT Holdings, where I worked as an intern on HRIS systems."

Q: "How can I contact you?"
A: "You can reach me at ${contact.email} or call/WhatsApp me at ${contact.mobile}. Check out my GitHub at ${contact.github} or LinkedIn at ${contact.linkedin}. I'm open to freelance and full-time opportunities."

Q: "What are you studying?"
A: "I'm pursuing a BSc Honours in Computing and Information Systems at Sabaragamuwa University of Sri Lanka. I'm in my second year, and I'm particularly interested in machine learning, cloud computing, and distributed systems."

**Remember:** Stay conversational, authentic, and focused only on Pathum. Never use formatting or special characters. Be helpful and friendly.`;
}

const SYSTEM_PROMPT = buildSystemPrompt();

export function useGeminiStream() {
  const responseText = ref('');
  const isLoading = ref(false);
  const error = ref(null);

  /**
   * Send message to OpenRouter API with reasoning enabled
   * @param {string} prompt The text prompt
   */
  async function generateContentStream(prompt) {
    isLoading.value = true;
    error.value = null;
    responseText.value = '';

    try {
      // Add user message to history
      messageHistory.value.push({
        role: 'user',
        content: prompt
      });

      // Build messages array - properly structured with system prompt
      const messages = [
        {
          role: 'user',
          content: SYSTEM_PROMPT
        },
        ...messageHistory.value
      ];

      // API call with proper system prompt handling
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: MODEL,
          messages: messages,
          reasoning: { enabled: true },
          temperature: 0.3,
          max_tokens: 300,
          top_p: 0.8
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `API error: ${response.status}`);
      }

      const result = await response.json();
      const assistantMessage = result.choices[0].message;

      // Use just the content
      const responseContent = assistantMessage.content;

      // Stream the response character by character for UI effect
      for (let i = 0; i < responseContent.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 10));
        responseText.value += responseContent[i];
      }

      // Add assistant message to history
      messageHistory.value.push({
        role: 'assistant',
        content: assistantMessage.content,
        reasoning_details: assistantMessage.reasoning_details
      });

    } catch (err) {
      console.error("OpenRouter API error:", err);
      error.value = err.message || "Couldn't get a response. Please try again!";
    } finally {
      isLoading.value = false;
    }
  }

  return {
    responseText,
    isLoading,
    error,
    generateContentStream,
  };
}
