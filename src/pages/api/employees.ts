import type { NextApiRequest, NextApiResponse } from 'next';

export const employees = [
  {
    name: "Praful",
    email: "praful@example.com",
    currentProject: null,
    designation: "Senior Developer",
    isAdmin: true,
    isAllowedToReview: true,
  },
  {
    name: "Neem",
    email: "neem@example.com",
    currentProject: "Curation",
    designation: "Senior Developer",
    isAdmin: false,
    isAllowedToReview: true,
  },
  {
    name: "Priyajit",
    email: "Priyajit@example.com",
    currentProject: "Tradeaze",
    designation: "Senior Developer",
    isAdmin: false,
    isAllowedToReview: true,
  },
  {
    name: "Jay",
    email: "Jay@example.com",
    currentProject: "Draft",
    designation: "Senior Developer",
    isAdmin: false,
    isAllowedToReview: true,

  },
  {
    name: "Pallavi",
    email: "pallavi@example.com",
    currentProject: "Draft",
    designation: "Developer",
    isAdmin: false,
    isAllowedToReview: true,
  },
  {
    name: "Saurabh",
    email: "saurabh@example.com",
    currentProject: "Curation",
    designation: "Senior Developer",
    isAdmin: true,
    isAllowedToReview: false,
  },
  {
    name: "Sarab",
    email: "sarab@example.com",
    currentProject: "Cybaverse",
    designation: "Senior Developer",
    isAdmin: false,
    isAllowedToReview: true,
  },
  {
    name: "Nigel",
    email: "nigel@example.com",
    currentProject: "Lone Design Club",
    designation: "Senior Developer",
    isAdmin: false,
    isAllowedToReview: true,

  },
  {
    name: "Vishal",
    email: "vishal@example.com",
    currentProject: "Lone Design Club",
    designation: "Senior Developer",
    isAdmin: false,
    isAllowedToReview: true,
  },
  {
    name: "Uttam",
    email: "uttam@example.com",
    currentProject: 'Adgreen',
    designation: "Senior Developer",
    isAdmin: false,
    isAllowedToReview: true,
  },
  {
    name: "Heno",
    email: "heno@example.com",
    currentProject: null,
    designation: "Senior Developer",
    isAdmin: false,
    isAllowedToReview: true,
  },
  
  {
    name: "Charlis",
    email: "charlis@example.com",
    currentProject: "Ujji",
    designation: "Senior Developer",
    isAdmin: false,
    isAllowedToReview: true,
  },
  {
    name: "Shivam",
    email: "shivam@example.com",
    currentProject: "Editorielle",
    designation: "Senior Developer",
    isAdmin: false,
    isAllowedToReview: true,
  },
  {
    name: "Amit",
    email: "amit@example.com",
    currentProject: null,
    designation: "Developer",
    isAdmin: false,
    isAllowedToReview: true,
  },
  {
    name: "Sadhna",
    email: "sadhna@example.com",
    currentProject: "FNL Care",
    designation: "Senior Developer",
    isAdmin: false,
    isAllowedToReview: true,
  },
  {
    name: "Mehak",
    email: "mehak@example.com",
    currentProject: "Curation",
    designation: "Senior Developer",
    isAdmin: false,
    isAllowedToReview: true,
  },
  {
    name: "Tomek",
    email: "tomek@example.com",
    currentProject: 'Platform',
    designation: "Senior Developer",
    isAdmin: false,
    isAllowedToReview: true,
  },
  {
    name: "Mohammed",
    email: "mohammed@example.com",
    currentProject: null,
    designation: "Senior Developer",
    isAdmin: false,
    isAllowedToReview: true,
  },
  {
    name: "Adeel",
    email: "adeel@example.com",
    currentProject: 'Clientshare Premium',
    designation: "Senior Developer",
    isAdmin: false,
    isAllowedToReview: true,
  },
  {
    name: "Vighneshwaran",
    email: "vighneshwaran@example.com",
    currentProject: 'T&T',
    designation: "Senior Developer",
    isAdmin: false,
    isAllowedToReview: true,
  },
  {
    name: "Rohan",
    email: "rohan@example.com",
    currentProject: 'Draft',
    designation: "Senior Developer",
    isAdmin: false,
    isAllowedToReview: true,
  },
  {
    name: "Ayan",
    email: "ayan@example.com",
    currentProject: 'Ujji',
    designation: "Senior Developer",
    isAdmin: false,
    isAllowedToReview: true,
  },
  {
    name: "Arindam",
    email: "arindam@example.com",
    currentProject: 'Lone Design Club',
    designation: "Senior Developer",
    isAdmin: false,
    isAllowedToReview: true,
  },
];
export const projects = [
  { 
    name: 'Draft', 
    isBigProject: true, 
    noOfReviwersRequirred: 4, 
    reviewers: ["Priyajit", "Neem", "Ayan", "Sarab"], 
  },
  { 
    name: 'Tradeaze', 
    isBigProject: false, 
    noOfReviwersRequirred: 1, 
    reviewers: ["Nigel"],  
  },
  { 
    name: 'Clientshare Premium', 
    isBigProject: false, 
    noOfReviwersRequirred: 1, 
    reviewers: ["Vishal"], 
    fixedReviewer: "Vishal", 
  },
  { 
    name: 'Clientshare Pulse', 
    isBigProject: false, 
    noOfReviwersRequirred: 3, 
    reviewers: ["Jay", "Amit"],  
  },
  { 
    name: 'Governance', 
    isBigProject: true, 
    noOfReviwersRequirred: 2, 
    reviewers: ["Tomek", "Praful"], 
    fixedReviewer: "Tomek", 
  },
  { 
    name: 'Lone Design Club', 
    isBigProject: true, 
    noOfReviwersRequirred: 3, 
    reviewers: ["Charlis", "Sadhna", "Heno"],  
  },
  { 
    name: 'Ujji',  
    isBigProject: false, 
    noOfReviwersRequirred: 1, 
    reviewers: ["Shivam"],  
  },
  { 
    name: 'Platform',  
    isBigProject: true, 
    noOfReviwersRequirred: 2, 
    reviewers: ["Praful"],  
  },
  { 
    name: 'Cybaverse',  
    isBigProject: false, 
    noOfReviwersRequirred: 1, 
    reviewers: ["Pallavi"],  
  },
  { 
    name: 'FNL Helpdesk',  
    isBigProject: false, 
    noOfReviwersRequirred: 1, 
    reviewers: ["Jay"],  
  },
  { 
    name: 'Adgreen',  
    isBigProject: false, 
    noOfReviwersRequirred: 1, 
    reviewers: ["Rohan"],  
  },
  { 
    name: 'Curation',  
    isBigProject: false, 
    noOfReviwersRequirred: 1, 
    reviewers: ["Shivam"],  
  },
  { 
    name: 'Editorielle',  
    isBigProject: false, 
    noOfReviwersRequirred: 1, 
    reviewers: ["Neem"],  
  },
];


  export default function handler(req: NextApiRequest, res: NextApiResponse) {
    res.status(200).json({ employees, projects });
  }