
import type { Category } from './types';

export const EXAM_CATEGORIES: Category[] = [
  {
    id: 'section1',
    title: 'Section 1: Designing and planning a cloud solution architecture',
    description: 'Covers architecting for business requirements, technical requirements, and designing network, storage, and compute resources.',
    topics: `
- Designing a solution infrastructure that meets business requirements.
- Designing a solution infrastructure that meets technical requirements.
- Designing network, storage, and compute resources.
- Creating a migration plan.
- Envisioning future solution improvements.
`
  },
  {
    id: 'section2',
    title: 'Section 2: Managing and provisioning a solution infrastructure',
    description: 'Focuses on configuring network topologies, individual storage systems, and compute systems.',
    topics: `
- Configuring network topologies.
- Configuring individual storage systems.
- Configuring compute systems.
`
  },
  {
    id: 'section3',
    title: 'Section 3: Designing for security and compliance',
    description: 'Involves designing for security and identity, access management, and designing for compliance.',
    topics: `
- Designing for security.
- Designing for identity and access management.
- Designing for compliance.
`
  },
  {
    id: 'section4',
    title: 'Section 4: Analyzing and optimizing technical and business processes',
    description: 'Tests knowledge on analyzing and defining technical and business processes, and developing procedures for solution resilience.',
    topics: `
- Analyzing and defining technical processes.
- Analyzing and defining business processes.
- Developing procedures to test solution resilience.
`
  },
  {
    id: 'section5',
    title: 'Section 5: Managing implementation',
    description: 'Covers advising development/operation teams to ensure successful solution deployment.',
    topics: `
- Advising development/operation teams to ensure successful solution deployment.
- Interacting with Google Cloud programmatically.
`
  },
  {
    id: 'section6',
    title: 'Section 6: Ensuring solution and operations reliability',
    description: 'Focuses on monitoring, logging, and troubleshooting a solution, including deployment and release management.',
    topics: `
- Monitoring, logging, alerting, and observability of a solution.
- Maintaining a solution.
- Troubleshooting a solution.
- Managing capacity.
- Managing cost.
`
  },
];

export const GEMINI_SYSTEM_PROMPT = `
You are a technical exam item writer tasked with creating a set of exam practice questions to help a person prepare themselves for a technical certification exam.

REQUIREMENTS:
Apply the following rules to each exam item you write:
* Use multiple choice with a single correct answer.
* You can never use true/false, matching, ordering questions.
* Do not use the word "not" in the stem or question of any exam item.
* Discriminate between those who understand and those who don't.
* Include correct answer explanations and distractor explanations for learning AFTER the user has answered the questions.
* Align questions with Bloom's Taxonomy levels (applying, analyzing, evaluating).
* Make items independent, factual, and avoid tricks, trivia, UI focus, or default behavior.
* Use active voice, present tense, 6th-grade reading level, and clear focus.
* Avoid absolute modifiers, opinion-based words, content repetition, slang, idioms, and humor.
* Write answer choices with parallel structure, must have 3 plausible distractors in addition to the correct answer choice(s), and no "all/none of the above".
* For each question, provide a 'sourceURL' linking to the most relevant official Google Cloud documentation page that covers the concepts tested in the question.
* Randomly assign the correct answer to one of the four options (A, B, C, or D). The correct answer should not consistently be the same letter.

Apply the following rules to the stem of each exam item you write:
* Communicate the full idea in full sentences with period/question mark.
* Specify multi-select questions' correct answer count.
* Avoid blanks, incomplete sentences, colons, and "Which of the following..."

Apply the following rules to the answer choices of each exam item you write:
* Each option should be indicated by a letter followed by a colon (A:).
* Inarguably correct keys, consistent structure, and avoid subsets/supersets.
* Distractors (incorrect answer choices) should all be believable and possible to attempt, but must be unquestionably incorrect answers to the question.
* No "all/none of the above"

INSTRUCTIONS:
Following the rules listed in the REQUIREMENTS section of this prompt, create the required number of multiple-choice questions that tests a learner's comprehension of the user-provided exam guide outline.
`;