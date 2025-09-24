
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChevronRight, Star, CheckCircle, Clock, Info, Award } from 'lucide-react';
import { generateQuestions } from '@/utils/questionGenerator';
import { useToast } from '@/hooks/use-toast';

const RoadmapPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Check if coming from form or category selection
  const fromForm = location.state?.fromForm;
  const categoryId = location.state?.category || '';
  const categoryTitle = location.state?.categoryTitle || '';
  
  const [levels, setLevels] = useState<any[]>([]);
  const [roadmapTitle, setRoadmapTitle] = useState<string>('Interview Preparation');
  
  useEffect(() => {
    // First check if we have a roadmap in localStorage (from form)
    const storedRoadmap = localStorage.getItem('interviewRoadmap');
    
    if (fromForm && storedRoadmap) {
      try {
        const roadmapData = JSON.parse(storedRoadmap);
        setLevels(roadmapData.levels);
        setRoadmapTitle(`${roadmapData.job} Interview Preparation`);
      } catch (error) {
        console.error("Error parsing roadmap data:", error);
        toast({
          variant: "destructive",
          title: "Error loading roadmap",
          description: "Unable to load your personalized roadmap."
        });
        navigate('/dashboard');
      }
    } 
    // If no form data but has category, generate from category
    else if (categoryId) {
      // Generate levels based on the selected category
      const categoryLevels = [
        {
          title: "Foundation Concepts",
          description: "Basic concepts and fundamentals",
          difficulty: "Easy",
          estimatedTime: 15,
          questionCount: 5,
          questions: generateMockQuestions(categoryId, 5, 'basic')
        },
        {
          title: "Intermediate Applications",
          description: "Applied knowledge and practical examples",
          difficulty: "Medium",
          estimatedTime: 25,
          questionCount: 8,
          questions: generateMockQuestions(categoryId, 8, 'intermediate')
        },
        {
          title: "Advanced Concepts",
          description: "Complex problems and in-depth knowledge",
          difficulty: "Hard",
          estimatedTime: 35,
          questionCount: 10,
          questions: generateMockQuestions(categoryId, 10, 'advanced')
        }
      ];
      
      setLevels(categoryLevels);
      setRoadmapTitle(`${getCategoryName(categoryId)} Interview Preparation`);
    }
    // If neither form data nor category, redirect to dashboard
    else {
      toast({
        variant: "destructive",
        title: "No roadmap data",
        description: "Please select a category or create a custom roadmap."
      });
      navigate('/dashboard');
    }
  }, [categoryId, fromForm, navigate, toast]);

  // Function to generate mock questions based on category and level
  const generateMockQuestions = (category: string, count: number, level: string) => {
    const questions = [];
    const categoryName = getCategoryName(category);
    
    for (let i = 1; i <= count; i++) {
      questions.push({
        id: i,
        question: `${level.charAt(0).toUpperCase() + level.slice(1)} ${categoryName} question #${i}: ${getQuestionPrompt(category, level, i)}`,
        type: i % 3 === 0 ? 'behavioral' : 'technical',
        timeLimit: 60 // 60 seconds per question
      });
    }
    
    return questions;
  };
  
  // Helper function to get a category name
  const getCategoryName = (categoryId: string) => {
    switch(categoryId) {
      case 'dsa': return 'Data Structures & Algorithms';
      case 'dbms': return 'Database Management Systems';
      case 'cn': return 'Computer Networks';
      case 'os': return 'Operating Systems';
      case 'aptitude': return 'Aptitude';
      case 'personality': return 'Personality Development';
      default: return categoryId.toUpperCase();
    }
  };
  
  // Helper function to generate relevant question prompts
  const getQuestionPrompt = (category: string, level: string, index: number) => {
    const prompts: Record<string, string[]> = {
      dsa: [
        'What is a Linear Data Structure? Name a few examples',
        'What is a linked list Data Structure?',
        'What is a doubly-linked list? Give some examples.',
        'Why do we need to do an algorithm analysis?',
        'Which sorting algorithm is considered the fastest? Why?',
        'What is the merge sort? How does it work?',
        'What is an example of divide and conquer algorithms?',
        'Define the graph Data Structure?',
        'Do dynamic memory allocations help in managing data? How?',
        'Explain the jagged array.'
      ],
      dbms: [
        'Difference between DBMS and RDBMS?',
        'What is a primary key?',
        'What is the use of DCL Language?',
        'What is Normalization?',
        'What is an Attribute?',
        'What is a tuple in DBMS?',
        'What is checkpoint in DBMS?',
        'What are ACID properties of DBMS?',
        'What is a schema in SQL Server?',
        'What are stored procedure parameters?'
      ],
      cn: [
        'What is the use of NIC? Can a computer work without NIC in-network?',
        'Define Node and Routers.',
        'What is a ‘frame relay’,?',
        'How does a Frame Relay Work?',
        'What is a Local Area Network?',
        'What is data link layer and network layer',
        'What is geo-targeting in CloudFront?',
        'What services can be used to create a centralized logging solution?',
        'What is a DDoS attack, and what services can minimize them?',
        'You are trying to provide a service in a particular region, but you do not see the service in that region. Why is this happening, and how do you fix it?'
      ],
      os: [
        'What is IPC? What are the different IPC mechanisms?',
        'What is RAID structure in OS?',
        'What is a Pipe and when it is used?',
        'What are the different kinds of operations that are possible on semaphore?',
        'What is a bootstrap program in OS?',
        'Basic functions of an OS:',
        'Phases of software development',
        'Difference between RAM and ROM',
        'What is starvation  in OS?',
        'What do you mean by FCFS?'
      ],
      aptitude: [
        'A sum was put at simple interest at a certain rate for 2 years. Had it been put at 3% higher rate, it would have fetched Rs 300 more. The sum is.',
        'The difference between the simple interest received from two different sources on Rs 3 lakhs for 2 years is rs 1,500. The difference between their rates of interest is',
        'A square tin sheet of side 12 cm is converted into a box with open top in the following steps: The sheet is placed horizontally. Then, equal-sized squares, each of side x cm, are cut from the four corners of the sheet. Finally, the four resulting sides are bent vertically upwards in the shape of a box. If x is an integer, then what value of x maximizes the volume of the box?',
        'A spherical ball of lead, 3 cm in diameter is melted and recast into three spherical balls. The diameter of two of these is 1.5 cm and 2 cm respectively. The diameter of the third ball is',
        'In a partnership, A invests 1/6 of the capital for 1/6 of the time, B invests 1/3 of the capital for 1/3 of the time and C, the rest of the capital for whole time. Find A"s share of the total profit of Rs 2,300',
        'a, b, c and d are four numbers in arithmetic progression. The mean of these four numbers is 24. The common difference between the numbers is 4. Find the product of first and last numbers.',
        'A shopkeeper has two items A & B. A was sold at a profit of 25% and B was sold at a loss of 5%. If the cost price of A is 20% more than that of B, what is the overall profit/ loss % to the shopkeeper?',
        'A set contains all numbers from 1 to 250. If a number is picked at random, what is the probability that it is a multiple of 3?',
        'From a point on a bridge across a river, the angles of depression of the banks on opposite sides of the river are 30° and 45°, respectively. If the bridge is at a height of 3 m from the banks, find the width of the river.',
        'The average of three consecutive odd numbers is 12 more than one third of the first of these numbers. What is the last of the three numbers?'
      ],
      personality: [
        'What are your core values?',
        'What is one thing you’re most proud of in your personal development?',
        'What personal trait do you think sets you apart from others?',
        'How do you stay calm in high-pressure situations?',
        'What’s a personal development goal you"re currently working on?',
        'How do you give and receive constructive criticism?',
        'Are you more of a listener or a speaker? Why?',
        'What’s your biggest fear and how are you overcoming it?',
        'How do you manage negative emotions or conflicts?',
        'What does success mean to you?',
        'Where do u see yourself in 69 years?'
        
      ]
    };
    
    // Get relevant prompts for this category or default to generic ones
    const relevantPrompts = prompts[category] || [
      'Explain a fundamental concept.',
      'Solve this basic problem.',
      'Compare these two approaches.',
      'Implement this simple algorithm.',
      'Analyze this scenario.',
      'Design a solution for this problem.',
      'Optimize this implementation.',
      'Troubleshoot this issue.',
      'Architect a system for this requirement.',
      'Evaluate these different strategies.'
    ];
    
    // Return a prompt based on the index
    return relevantPrompts[index % relevantPrompts.length];
  };

  if (levels.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-24 pb-16 px-6 bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p>Loading roadmap...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-16 px-6 bg-gray-50">
        <div className="container mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-interview-text">
              {roadmapTitle}
            </h1>
            <p className="text-gray-600 mt-2">
              Master your knowledge with progressive difficulty levels
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {categoryId && (
                <Badge variant="outline" className="bg-interview-primary/10 text-interview-primary">
                  {categoryTitle || getCategoryName(categoryId)}
                </Badge>
              )}
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Your Progress</h2>
                <span className="text-sm text-gray-500">0 of {levels.length} levels completed</span>
              </div>
              <Progress value={0} className="h-2" />
            </div>
            
            {levels.map((level, index) => (
              <Card key={index} className={index === 0 ? 'border-interview-primary border-2' : ''}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Level {index + 1}: {level.title}</CardTitle>
                      <CardDescription>{level.description}</CardDescription>
                    </div>
                    <Badge className={index === 0 ? 'bg-interview-primary' : 'bg-gray-200 text-gray-700'}>
                      {index === 0 ? 'Current' : 'Locked'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Star size={16} className="text-yellow-500" />
                      <span>{level.difficulty} Difficulty</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-blue-500" />
                      <span>Est. {level.estimatedTime} minutes (60 secs per question)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-green-500" />
                      <span>{level.questionCount} Questions</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className={index === 0 ? 'bg-interview-primary hover:bg-interview-primary/90 w-full' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 w-full cursor-not-allowed'}
                    disabled={index !== 0}
                    onClick={() => {
                      if (index === 0) {
                        navigate('/interview/session', { 
                          state: { 
                            level: index + 1,
                            category: categoryTitle || getCategoryName(categoryId),
                            questions: level.questions
                          } 
                        });
                      }
                    }}
                  >
                    {index === 0 ? 'Start This Level' : 'Complete Previous Levels First'}
                    <ChevronRight size={16} />
                  </Button>
                </CardFooter>
              </Card>
            ))}
            
            <div className="bg-interview-primary/5 border border-interview-primary/20 rounded-lg p-4 mt-8">
              <div className="flex items-start gap-3">
                <div className="bg-interview-primary/10 rounded-full p-2">
                  <Award size={20} className="text-interview-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-interview-text">Complete Your Journey</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Progress through all levels to gain a comprehensive preparation for your interview.
                    Each level builds upon the previous one, with a 60-second time limit for each question.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RoadmapPage;
