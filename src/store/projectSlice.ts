import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './index';

interface Employee {
  name: string;
  email: string;
  currentProject: string;
  designation: string;
  isAdmin: boolean;
  isAllowedToReview: boolean;
}

interface Project {
  name: string;
  currentDevelopers: string[]; 
  isBigProject: boolean;
  noOfReviwersRequirred: number; 
  codeReviewers?: string[];
  fixedReviewer?: string;
  reviewers?: string[];
  previousReviewers?: string[];
}


interface ProjectsState {
  projects: Project[];
  employees: Employee[];
  currentUser: Employee | null;
}

const initialState: ProjectsState = {
  projects: [],
  employees: [],
  currentUser: null,
};

const projectReviewSlice = createSlice({
  name: 'projectReview',
  initialState,
  reducers: {
    setEmployees(state, action: PayloadAction<Employee[]>) {
      state.employees = action.payload;
    },
    setProjects(state, action: PayloadAction<Project[]>) {
      state.projects = action.payload;
    },
    setCurrentUser(state, action: PayloadAction<Employee | null>) {
      state.currentUser = action.payload;
    },
    shuffleReviewers(state) {
      const projects = state.projects;
      let reviewers = state.employees.filter(emp => emp.isAllowedToReview);
    
      // Shuffle reviewers
      for (let i = reviewers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [reviewers[i], reviewers[j]] = [reviewers[j], reviewers[i]];
      }
    
      // Fixed reviewer assignments
      const assignedReviewers = new Set<string>();
    
      // Assign fixed reviewers from project properties
      projects.forEach(project => {
        project.codeReviewers = [];
        
        if (project.fixedReviewer) {
          // Assign the fixed reviewer
          project.codeReviewers.push(project.fixedReviewer);
          reviewers = reviewers.filter(reviewer => reviewer.name !== project.fixedReviewer);
          assignedReviewers.add(project.fixedReviewer);
        }
      });
    
      reviewers = reviewers.filter(reviewer => !assignedReviewers.has(reviewer.name));
    
      projects.forEach(project => {
        if (project.name) {
          const reviewersNeeded = project.noOfReviwersRequirred;
    
          for (let i = 0; i < reviewers.length; i++) {
            const assignedReviewer = reviewers[i];
    
            if (
              assignedReviewer &&
              !project.currentDevelopers.includes(assignedReviewer.name) &&
              !project?.codeReviewers?.includes(assignedReviewer.name) &&
              (!project.isBigProject || assignedReviewer.designation === "Senior Developer") &&
              !project.previousReviewers?.includes(assignedReviewer.name)
                ) {
              project?.codeReviewers?.push(assignedReviewer.name);
              reviewers.splice(i, 1);
              assignedReviewers.add(assignedReviewer.name);
              i--;
            }
    
            if (project.codeReviewers && project.codeReviewers.length >= reviewersNeeded) break;
          }
        }
      });
    
      // Ensure each reviewer is assigned to at least one project
      const reviewersAssignedToProjects = new Set<string>();
      projects.forEach(project => {
        if (project.codeReviewers) {
          project.codeReviewers.forEach(reviewer => {
            reviewersAssignedToProjects.add(reviewer);
          });
        }
      });
    
      const unassignedReviewers = reviewers.filter(reviewer => !reviewersAssignedToProjects.has(reviewer.name));
    
      // Assign remaining unassigned reviewers to projects that need more reviewers
      unassignedReviewers.forEach(reviewer => {
        const availableProjects = projects.filter(project => {
          return project.name &&
                 project.codeReviewers &&
                 project.codeReviewers.length < project.noOfReviwersRequirred && 
                 !project.codeReviewers.includes(reviewer.name) &&
                 !project.currentDevelopers.includes(reviewer.name) &&
                 (!project.isBigProject || reviewer.designation === "Senior Developer") &&
                 !project.previousReviewers?.includes(reviewer.name); // Ensure the reviewer hasn't reviewed before
        });
    
        if (availableProjects.length > 0) {
          const projectIndex = Math.floor(Math.random() * availableProjects.length);
          const selectedProject = availableProjects[projectIndex];
          if (selectedProject.codeReviewers) {
            selectedProject.codeReviewers.push(reviewer.name);
          } else {
            selectedProject.codeReviewers = [reviewer.name];
          }
          reviewersAssignedToProjects.add(reviewer.name);
        }
      });
    
      projects.forEach(project => {
        if (project.codeReviewers && project.codeReviewers.length < project.noOfReviwersRequirred) {
          const reviewersNeeded = project.noOfReviwersRequirred - project.codeReviewers.length;
    
          for (let i = 0; i < reviewersNeeded; i++) {
            const availableReviewers = state.employees.filter(emp =>
              emp.isAllowedToReview &&
              !project.codeReviewers?.includes(emp.name) &&
              (!project.isBigProject || emp.designation === "Senior Developer") &&
              !project.previousReviewers?.includes(emp.name) // Ensure the reviewer hasn't reviewed before
            );
    
            if (availableReviewers.length > 0) {
              const selectedReviewer = availableReviewers[Math.floor(Math.random() * availableReviewers.length)];
              project.codeReviewers.push(selectedReviewer.name);
            }
          }
        }
      });
    }
    
    
  },
});

export const { setEmployees, setProjects, setCurrentUser, shuffleReviewers } = projectReviewSlice.actions;

export const selectProjects = (state: RootState) => state.projectReview.projects;
export const selectEmployees = (state: RootState) => state.projectReview.employees;
export const selectCurrentUser = (state: RootState) => state.projectReview.currentUser;

export const selectProjectDetails = (state: RootState) => {
  const projectDetails = state.projectReview.projects.reduce((acc, project) => {
    if (project.name) {
      const existingProject = acc.find(p => p.name === project.name);
      if (existingProject) {
        existingProject.reviewers.push(...(project.codeReviewers || []));
      } else {
        acc.push({
          name: project.name,
          currentDevelopers: project.currentDevelopers,
          reviewers: project.codeReviewers || [],
          noOfReviwersRequirred: project.noOfReviwersRequirred,
          isBigProject : project.isBigProject,
          fixedReviewer: project.fixedReviewer || '',
        });
      }
    }
    return acc;
  }, [] as { name: string, currentDevelopers: string[], reviewers: string[], noOfReviwersRequirred: number,isBigProject : boolean, fixedReviewer : string  }[]);
  
  return projectDetails;
}; 

export const selectEmployeeProjectReviewDetails = (state: RootState) => {
  const employees = state.projectReview.employees;
  const projects = state.projectReview.projects;

  return employees.map(emp => {
    const currentProject = emp.currentProject || 'No current project';
    const reviewingProjects = projects
      .filter(proj => proj.codeReviewers?.includes(emp.name))
      .map(proj => proj.name)
      .join(', ') || 'Not reviewing any project';

    return {
      name: emp.name,
      currentProject,
      reviewingProjects
    };
  });
};



export const selectEmployeesWithoutProjects = (state: RootState) => {
  return state.projectReview.employees.filter(emp => !emp.currentProject);
};

export const selectEmployeesExemptedFromReview = (state: RootState) => {
  return state.projectReview.employees.filter(emp => !emp.isAllowedToReview);
};

export default projectReviewSlice.reducer;
