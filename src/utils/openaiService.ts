import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

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
      const prompt = this.createStudyPlanPrompt(request);
      
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert educational AI that creates personalized study plans. You analyze student profiles and generate comprehensive, actionable study plans with specific subjects, topics, timelines, and learning strategies. Always respond with valid JSON that matches the expected structure."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 3000
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
      throw new Error(`Failed to generate study plan: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async generateStudyContent(subject: string, topic: string, difficulty: string, learningStyle: string): Promise<any> {
    try {
      const prompt = `Generate interactive study content for:
Subject: ${subject}
Topic: ${topic}
Difficulty: ${difficulty}
Learning Style: ${learningStyle}

Create engaging content including:
1. Key concepts explanation
2. Practice questions with multiple choice options
3. Real-world applications
4. Learning objectives
5. Assessment criteria

Format as JSON with structured content for an interactive learning session.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert educational content creator. Generate interactive, engaging study materials tailored to specific learning styles and difficulty levels."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 2000
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No response from OpenAI');
      }

      return JSON.parse(response);
    } catch (error) {
      console.error('OpenAI Content Generation Error:', error);
      throw new Error(`Failed to generate study content: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private createStudyPlanPrompt(request: OpenAIStudyPlanRequest): string {
    return `Create a comprehensive, personalized study plan for the following student:

STUDENT PROFILE:
- Name: ${request.userProfile.name}
- Current Level: ${request.userProfile.level}
- Weak Areas: ${request.userProfile.weakAreas.join(', ')}
- Strong Areas: ${request.userProfile.strongAreas.join(', ')}
- Learning Style: ${request.userProfile.learningStyle}
- Daily Time Available: ${request.userProfile.timeAvailable} minutes
- Additional Context: ${request.userProfile.additionalInfo || 'None provided'}

LEARNING GOALS:
${request.goals.map((goal, index) => `${index + 1}. ${goal}`).join('\n')}

REQUIREMENTS:
1. Create a study plan that addresses the weak areas while maintaining strong areas
2. Adapt content delivery to the specified learning style
3. Provide realistic timelines based on available study time
4. Include 3-5 subjects with specific topics and learning objectives
5. Create weekly milestones with clear success criteria
6. Provide personalized recommendations for study strategies
7. Estimate confidence level (0-100) for plan success

RESPONSE FORMAT (JSON):
{
  "title": "Descriptive plan title",
  "description": "Brief overview of the plan",
  "duration": 30-90, // days
  "difficulty": "Supportive/Balanced/Challenging",
  "subjects": [
    {
      "name": "Subject name",
      "priority": "high/medium/low",
      "timeAllocation": 25-40, // percentage
      "topics": [
        {
          "name": "Topic name",
          "difficulty": "Beginner/Intermediate/Advanced/Expert",
          "estimatedTime": 30-90, // minutes
          "learningObjectives": ["objective1", "objective2"]
        }
      ],
      "reasoning": "Why this subject is included and prioritized"
    }
  ],
  "milestones": [
    {
      "week": 1,
      "title": "Milestone title",
      "description": "What to achieve this week",
      "successCriteria": ["criteria1", "criteria2"]
    }
  ],
  "personalizedRecommendations": ["recommendation1", "recommendation2"],
  "estimatedOutcome": "Expected results after completing the plan",
  "confidence": 75-95 // percentage
}

Generate a detailed, actionable study plan that will help this student achieve their goals effectively.`;
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