import OpenAI from "openai";
import { type CareerResponse } from "@shared/schema";

// Using GPT-3.5-turbo for cost-effective and reliable career advice generation
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

// Fallback career advice for common career paths
const fallbackAdvice: Record<string, CareerResponse> = {
  "software engineer": {
    career_overview: "Design, develop, and maintain software applications that solve real-world problems and drive technological innovation.",
    recommended_degree: [
      "Bachelor's in Computer Science (4 years) - covers algorithms, data structures, software engineering",
      "Coding Bootcamp (3-6 months) - intensive, practical training with job placement assistance",
      "Bachelor's in Software Engineering (4 years) - specialized focus on software development lifecycle",
      "Self-taught path with portfolio - requires 1-2 years of dedicated learning and project building"
    ],
    skills_needed: [
      "Programming languages (Python, JavaScript, Java) - essential for building applications",
      "Problem-solving and logical thinking - core to debugging and algorithm design",
      "Version control (Git) - critical for collaborative development",
      "Database management (SQL) - needed for data storage and retrieval",
      "Testing and debugging - ensures code quality and reliability"
    ],
    learning_path: [
      "Master programming fundamentals (6-12 months) - choose Python or JavaScript as starting language",
      "Build 3-5 portfolio projects (3-6 months) - include web apps, APIs, and databases",
      "Learn Git/GitHub and collaboration tools (1-2 months) - essential for team work",
      "Practice coding interviews and algorithms (2-3 months) - prepare for technical interviews",
      "Apply for entry-level positions or internships - target junior developer roles"
    ]
  },
  "data scientist": {
    career_overview: "Extract actionable insights from complex datasets to drive strategic business decisions and solve real-world problems.",
    recommended_degree: [
      "Bachelor's in Statistics/Mathematics/Computer Science (4 years) - strong quantitative foundation required",
      "Data Science Bootcamp (3-9 months) - practical, hands-on training with real datasets",
      "Google Data Analytics Certificate (3-6 months) - entry-level credential for analytics roles",
      "Master's in Data Science (1-2 years) - advanced degree for senior positions and research roles"
    ],
    skills_needed: [
      "Python/R programming - essential for data manipulation and statistical analysis",
      "Statistics and mathematics - foundation for understanding data patterns and model validity",
      "SQL and database management - critical for data extraction and warehousing",
      "Data visualization (Tableau, Power BI) - communicating insights to stakeholders",
      "Machine learning fundamentals - building predictive models and algorithms"
    ],
    learning_path: [
      "Master Python basics and pandas library (2-3 months) - focus on data manipulation",
      "Study statistics and probability theory (3-4 months) - understand hypothesis testing and distributions",
      "Learn SQL and database concepts (1-2 months) - practice with real datasets",
      "Develop data visualization skills (1-2 months) - create compelling charts and dashboards",
      "Build 2-3 end-to-end data science projects (3-6 months) - showcase complete analysis workflow"
    ]
  },
  "teacher": {
    career_overview: "Shape future generations by delivering engaging education and fostering critical thinking skills across diverse learning environments.",
    recommended_degree: [
      "Bachelor's in Education (4 years) - includes pedagogy, child development, and student teaching",
      "Alternative Certification Program (1-2 years) - for career changers with bachelor's degree",
      "Master's in Education (1-2 years) - advanced teaching methods and leadership preparation",
      "Subject-specific Bachelor's + Teaching Credential (4-5 years) - deep content knowledge plus teaching skills"
    ],
    skills_needed: [
      "Communication and presentation - essential for delivering clear, engaging lessons",
      "Classroom management - maintaining productive learning environment and student behavior",
      "Patience and empathy - understanding diverse learning needs and emotional support",
      "Curriculum planning and assessment - designing effective lessons and measuring student progress",
      "Technology integration - using digital tools to enhance learning and engagement"
    ],
    learning_path: [
      "Complete education coursework and pedagogy training (2-4 years) - learn teaching methods and theory",
      "Gain student teaching experience (1 semester) - practice in real classroom under mentor guidance",
      "Obtain state teaching certification and pass required exams (3-6 months) - meet licensing requirements",
      "Develop subject matter expertise through continued education (ongoing) - stay current with content",
      "Apply for teaching positions and build professional network (3-6 months) - target specific grade levels or subjects"
    ]
  }
};

function getFallbackAdvice(userMessage: string): CareerResponse {
  const message = userMessage.toLowerCase();
  
  // Check for common career terms
  if (message.includes("software") || message.includes("programmer") || message.includes("developer") || message.includes("engineer")) {
    return fallbackAdvice["software engineer"];
  }
  if (message.includes("data scientist") || message.includes("data analytics") || message.includes("machine learning")) {
    return fallbackAdvice["data scientist"];
  }
  if (message.includes("teacher") || message.includes("educator") || message.includes("teaching")) {
    return fallbackAdvice["teacher"];
  }
  
  // Generic fallback for any career
  return {
    career_overview: "This career field offers diverse opportunities for professional growth and meaningful contribution to society.",
    recommended_degree: [
      "Research specific degree requirements for your target role - check job postings and industry standards",
      "Consider 4-year university programs (Bachelor's) - provides comprehensive foundation and networking",
      "Explore community college options (Associate's, 2 years) - cost-effective pathway with practical skills",
      "Investigate professional certifications and bootcamps - faster, specialized training for specific skills"
    ],
    skills_needed: [
      "Communication skills - essential for collaboration and presenting ideas effectively",
      "Problem-solving and critical thinking - core to analyzing challenges and developing solutions",
      "Adaptability and continuous learning - staying current with industry changes and new technologies",
      "Time management and organization - managing multiple projects and meeting deadlines",
      "Industry-specific technical skills - research the most in-demand skills for your chosen field"
    ],
    learning_path: [
      "Research the career field thoroughly (1-2 weeks) - understand roles, salary ranges, and growth prospects",
      "Identify specific education and skill requirements (1-2 weeks) - analyze job postings and talk to professionals",
      "Connect with industry professionals through networking (ongoing) - use LinkedIn, professional associations, informational interviews",
      "Gain relevant experience through internships, volunteering, or projects (3-12 months) - build practical skills and portfolio",
      "Apply strategically for positions that match your qualifications - tailor applications and prepare for interviews"
    ]
  };
}

export async function getCareerAdvice(userMessage: string): Promise<CareerResponse> {
  try {
    const prompt = `You are a professional career advisor for students. Provide CONCISE but DETAILED career advice in JSON format.

User's message: "${userMessage}"

Please respond with a JSON object containing exactly these four fields:
1. "career_overview": ONE clear sentence describing what this career does and its impact
2. "recommended_degree": An array of 3-4 SPECIFIC educational paths with details:
   - Include degree names, typical duration, and key focus areas
   - Mix traditional degrees with alternative certifications/bootcamps
   - Mention specific prerequisites or requirements where relevant
3. "skills_needed": An array of 4-5 ESSENTIAL skills with brief context on their importance
4. "learning_path": An array of 4-5 SPECIFIC, actionable steps with timeframes and resources

For education recommendations, be SPECIFIC about:
- Exact degree titles and specializations
- Duration and typical costs when relevant
- Prerequisites and admission requirements
- Alternative pathways (certifications, bootcamps, online programs)
- Specific institutions or programs when applicable

Keep responses SHORT but INFORMATIVE. Prioritize actionable, specific details over generic advice.`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert career advisor specializing in helping students plan their career paths. Provide detailed, accurate, and actionable career guidance."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 2048,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    // Validate the response structure
    return {
      career_overview: result.career_overview || "This is an exciting career field with opportunities for growth and impact.",
      recommended_degree: Array.isArray(result.recommended_degree) ? result.recommended_degree : [
        "Research specific degree requirements for your chosen field",
        "Consider both traditional university degrees and alternative paths"
      ],
      skills_needed: Array.isArray(result.skills_needed) ? result.skills_needed : [
        "Strong communication skills",
        "Problem-solving abilities",
        "Continuous learning mindset"
      ],
      learning_path: Array.isArray(result.learning_path) ? result.learning_path : [
        "Research the specific requirements for your chosen career",
        "Identify key skills and knowledge areas",
        "Create a structured learning plan"
      ]
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    
    // Return fallback advice instead of throwing error
    console.log("Using fallback career advice due to API unavailability");
    return getFallbackAdvice(userMessage);
  }
}
