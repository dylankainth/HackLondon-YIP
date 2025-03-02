# HackLondon

# 🔒 LockedIn - Virtual Accountability Work/Study App

## 🎉 **Get Started**
- https://ix-applied-joined-worst.trycloudflare.com/
- Above is the link the app is hosted on
- We're too broke to get a better domain 😢


## Project Overview
LockedIn is a virtual co-working/study app designed to help users stay **focused, accountable, and productive**. By pairing users in an *Omegle-style* video call, the app promotes real-time accountability. Throughout the session, users are prompted to log their progress, and an AI evaluates their work at the end—determining who was more productive. This a step up from the discord study groups or in-person silent sessions of yesteryear.

## Objectives
- **Boost Productivity:** Encourage users to stay on task through regular check-ins.
- **Enhance Accountability:** Provide objective, AI-driven summaries of user activity to foster healthy competition and motivation.
- **Promote Collaboration:** Facilitate pairing with accountability partners who share similar work/study goals.

## Key Features
- **Real-Time Pairing:** Match users for video calls in a manner similar depending on subject interest or by random.
- **Periodic Check-Ins:** Prompts are made to the user at set intervals (e.g. every 30 minutes) asking, "What have you been doing?". These responses are logged.
- **Progress Timeline** Track your own and your partner's check-in progress side by side
- **AI Correction Text Correction** AI is used to convey and correct progress logs in a concise manner.
- **Gamified AI Productivity Analysis** At the end of a session, AI evaluates: Quantity, Quality, Creativity of progress logs to declare the most productive person.
- **Google Authentication** Sign in and use LockedIn quickily with Google OAuth to create a profile and jump on a call.

## How it Works
1. **Sign in** - Sign in with a Google account.
2. **Get a Partner** - Match with partners based on subject interest or by random.
3. **Start Working** - Stay accountable when working on call with a partner, enter your progress periodically to show your partner your progress.
4. **AI Determined Winner** - At the end, AI determines **who stayed more LockedIn**.

## 📊 **Example Session & AI Evaluation**

### **User 1 Timeline**
| Time  | Activity |
|-------|---------|
| 1:00 PM | Completed Chapter 1 of Biology |
| 1:30 PM | Took notes for Chapter 2 |
| 2:00 PM | Short coffee break |
| 2:30 PM | Watching lecture recordings |
| 3:00 PM | Solving quizzes on an e-learning portal |

### **User 2 Timeline**
| Time  | Activity |
|-------|---------|
| 1:00 PM | Researched modern architectural styles |
| 1:30 PM | Sketched initial design concepts |
| 2:00 PM | Short coffee break |
| 2:30 PM | Watching a lecture on sustainable architecture |
| 3:00 PM | Working on a 3D model for a project |

### **AI Decision**
🏆 **Winner: User 1**
- More structured study session.
- Completed quizzes (active recall).
- Less passive learning.

## Target Audience
- Remote workers, students, freelancers, and professionals seeking to improve productivity through structured accountability.
- Users interested in performance tracking and comparative feedback in a virtual work/study environment.

## 🛠 **Tech Stack**
- **Frontend:** React, Tailwind CSS
- **Backend:** Node.js, WebRTC, FastAPI, Python, TypeScript
- **Authentication:** Google OAuth
- **AI Evaluation:** Gemini Flash 1.5

## **Challenges**
- Implementing the queuing system and avoiding race conditions was slightly tricky.
- Wrangling WebRTC to produce a stable video stream was a challenge but we overcame it 💪
- We struggled with react as a relatively new web developers
- We pulled all nighters, pls show support... 🫠 🙏
