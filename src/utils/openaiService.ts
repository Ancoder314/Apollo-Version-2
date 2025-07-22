import OpenAI from 'openai';

let openai: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openai) {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey || apiKey === 'your_openai_api_key_here') {
      throw new Error('OpenAI API key is not configured. Please set VITE_OPENAI_API_KEY in your .env file.');
    }
    openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true
    });
  }
  return openai;
}

export interface OpenAIStudyPlanRequest {
  userProfile: {
    name: string;
    level: number;
    weakAreas: string[];
    strongAreas: string[];
    learningStyle: string;
    studyGoals: string[];
    timeAvailable: number;
    additionalInfo?: string;
  };
  goals: string[];
  uploadedContent?: string;
}

export interface OpenAIStudyPlanResponse {
  title: string;
  description: string;
  duration: number;
  difficulty: string;
  subjects: Array<{
    name: string;
    priority: 'high' | 'medium' | 'low';
    timeAllocation: number;
    topics: Array<{
      name: string;
      difficulty: string;
      estimatedTime: number;
      learningObjectives: string[];
    }>;
    reasoning: string;
  }>;
  milestones: Array<{
    week: number;
    title: string;
    description: string;
    successCriteria: string[];
  }>;
  personalizedRecommendations: string[];
  estimatedOutcome: string;
  confidence: number;
}

export class OpenAIService {
  async generateStudyPlan(request: OpenAIStudyPlanRequest): Promise<OpenAIStudyPlanResponse> {
    try {
      const client = getOpenAIClient();
      const prompt = this.createAPStudyPlanPrompt(request);
      
      const completion = await client.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert AP educational AI that creates personalized AP study plans. You analyze student profiles and generate comprehensive, actionable AP study plans with specific AP courses, topics, timelines, and learning strategies focused on AP exam success. Always respond with valid JSON that matches the expected structure."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No response from OpenAI');
      }

      // Parse the JSON response
      const studyPlan = JSON.parse(response);
      
      // Validate the response structure
      this.validateStudyPlanResponse(studyPlan);
      
      return studyPlan;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error(`Failed to generate AP study plan: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async generateStudyContent(subject: string, topic: string, difficulty: string, learningStyle: string): Promise<any> {
    try {
      const prompt = `Generate interactive AP study content for:
AP Subject: ${subject}
Topic: ${topic}
Difficulty: ${difficulty}
Learning Style: ${learningStyle}

Create engaging AP-focused content including:
1. Key AP concepts explanation
2. AP practice questions with multiple choice options
3. Real-world applications relevant to AP exams
4. AP learning objectives
5. AP assessment criteria

Format as JSON with structured content for an interactive AP learning session.`;

      const completion = await client.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert AP educational content creator. Generate interactive, engaging AP study materials tailored to specific learning styles and difficulty levels for AP exam preparation."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 3000
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No response from OpenAI');
      }

      return JSON.parse(response);
    } catch (error) {
      console.error('OpenAI Content Generation Error:', error);
      throw new Error(`Failed to generate AP study content: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private createAPStudyPlanPrompt(request: OpenAIStudyPlanRequest): string {
    return `Create a comprehensive, personalized AP study plan for the following student:

STUDENT PROFILE:
- Name: ${request.userProfile.name}
- Current Level: ${request.userProfile.level}
- Weak AP Areas: ${request.userProfile.weakAreas.join(', ')}
- Strong AP Areas: ${request.userProfile.strongAreas.join(', ')}
- Learning Style: ${request.userProfile.learningStyle}
- Daily Time Available: ${request.userProfile.timeAvailable} minutes
- Additional Context: ${request.userProfile.additionalInfo || 'None provided'}

AP LEARNING GOALS:
${request.goals.map((goal, index) => `${index + 1}. ${goal}`).join('\n')}

${request.uploadedContent ? `
UPLOADED AP CONTENT/NOTES:
${request.uploadedContent}
` : ''}

REQUIREMENTS:
1. Create an AP study plan that addresses the weak areas while maintaining strong areas
2. Focus EXCLUSIVELY on AP courses and AP exam preparation
3. Adapt content delivery to the specified learning style
4. Provide realistic timelines based on available study time
5. Include 2-4 AP subjects with specific topics and learning objectives
6. Create weekly milestones with clear AP success criteria
7. Provide personalized recommendations for AP study strategies
8. Estimate confidence level (0-100) for AP exam success
9. If uploaded content is provided, incorporate it into the AP study plan

RESPONSE FORMAT (JSON):
{
  "title": "Descriptive AP plan title",
  "description": "Brief overview of the AP plan",
  "duration": 30-120, // days
  "difficulty": "AP Supportive/AP Balanced/AP Challenging",
  "subjects": [
    {
      "name": "AP [Subject name]",
      "priority": "high/medium/low",
      "timeAllocation": 25-40, // percentage
      "topics": [
        {
          "name": "AP Topic name",
          "difficulty": "Beginner/Intermediate/Advanced/Expert",
          "estimatedTime": 30-90, // minutes
          "learningObjectives": ["AP objective1", "AP objective2"]
        }
      ],
      "reasoning": "Why this AP subject is included and prioritized"
    }
  ],
  "milestones": [
    {
      "week": 1,
      "title": "AP Milestone title",
      "description": "What to achieve this week for AP success",
      "successCriteria": ["AP criteria1", "AP criteria2"]
    }
  ],
  "personalizedRecommendations": ["AP recommendation1", "AP recommendation2"],
  "estimatedOutcome": "Expected AP exam results after completing the plan",
  "confidence": 75-95 // percentage for AP exam success
}

Generate a detailed, actionable AP study plan that will help this student achieve their AP exam goals effectively.`;
  }

  private validateStudyPlanResponse(response: any): void {
    const requiredFields = ['title', 'description', 'duration', 'difficulty', 'subjects', 'milestones', 'personalizedRecommendations', 'estimatedOutcome', 'confidence'];
    
    for (const field of requiredFields) {
      if (!(field in response)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    if (!Array.isArray(response.subjects) || response.subjects.length === 0) {
      throw new Error('Subjects must be a non-empty array');
    }

    if (!Array.isArray(response.milestones) || response.milestones.length === 0) {
      throw new Error('Milestones must be a non-empty array');
    }

    if (typeof response.confidence !== 'number' || response.confidence < 0 || response.confidence > 100) {
      throw new Error('Confidence must be a number between 0 and 100');
    }
  }
}

export const openaiService = new OpenAIService();