import { useState, useEffect } from 'react';
import { employees as initialEmployees, projects as initialProjects } from '../../src/pages/api/employees';

const MyComponent = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [exceptions, setExceptions] = useState<string[]>([]);

  useEffect(() => {
    setEmployees(initialEmployees);
    setProjects(initialProjects);
  }, []);

  // Handle updates for the number of reviewers required for each project
  const handleReviewerCountChange = (index: number, value: number) => {
    const newProjects = [...projects];
    newProjects[index].noOfReviwersRequirred = value;
    setProjects(newProjects);
  };

  // Handle updates for assigning fixed reviewers
  const handleFixedReviewerChange = (projectIndex: number, reviewerName: string) => {
    const newProjects = [...projects];
    if (!newProjects[projectIndex].fixedReviewers) {
      newProjects[projectIndex].fixedReviewers = [];
    }
    newProjects[projectIndex].fixedReviewers = [reviewerName];
    setProjects(newProjects);
  };

  // Handle changes for whether senior devs are required
  const handleSeniorDevChange = (index: number, checked: boolean) => {
    const newProjects = [...projects];
    newProjects[index].isBigProject = checked;
    setProjects(newProjects);
  };

  // Handle changes for exceptions (employees not allowed to review)
  const handleExceptionChange = (employeeName: string, checked: boolean) => {
    const updatedExceptions = checked
      ? [...exceptions, employeeName]
      : exceptions.filter(name => name !== employeeName);
    setExceptions(updatedExceptions);
  };

  // Handle updates for 'Is Admin' field for employees
  const handleAdminChange = (index: number, checked: boolean) => {
    const updatedEmployees = [...employees];
    updatedEmployees[index].isAdmin = checked;
    setEmployees(updatedEmployees);
  };

  // Handle updates for 'Is Allowed to Review' field for employees
  const handleAllowedToReviewChange = (index: number, checked: boolean) => {
    const updatedEmployees = [...employees];
    updatedEmployees[index].isAllowedToReview = checked;
    setEmployees(updatedEmployees);
  };

//   // Save changes (you can later connect this to an API if needed)
//   const handleSave = () => {
//     console.log('Updated Projects:', projects);
//     console.log('Updated Employees:', employees);
//     console.log('Updated Exceptions:', exceptions);
//     // In a real-world scenario, you'd send this data to an API or update the local JSON.
//   };
const handleSave = async () => {
    const updatedData = {
      employees,
      projects,
      exceptions,
    };
  
    try {
      const response = await fetch('/api/updateData', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update data');
      }
  
      const result = await response.json();
      console.log('Data updated successfully:', result);
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  return (
    <div className="container">
      <h1>Project and Employee Management</h1>

      {/* Projects Table */}
      <h2>Projects</h2>
      <table className="styled-table">
        <thead>
          <tr>
            <th>Project Name</th>
            <th>No of Reviewers Required</th>
            <th>Fixed Reviewer</th>
            <th>Senior Dev Required</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project, index) => (
            <tr key={index}>
              <td>{project.name}</td>
              <td>
                <input
                  type="number"
                  value={project.noOfReviwersRequirred}
                  min="1"
                  onChange={(e) => handleReviewerCountChange(index, parseInt(e.target.value))}
                />
              </td>
              <td>
                <select
                  onChange={(e) => handleFixedReviewerChange(index, e.target.value)}
                  value={project.fixedReviewers?.[0] || ''}
                >
                  <option value="">Select Reviewer</option>
                  {employees.map((employee) => (
                    <option key={employee.name} value={employee.name}>
                      {employee.name}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={project.isBigProject}
                  onChange={(e) => handleSeniorDevChange(index, e.target.checked)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Employees Table */}
      <h2>Employees</h2>
      <table className="styled-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Current Project</th>
            <th>Designation</th>
            <th>Is Admin</th>
            <th>Is Allowed to Review</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee, index) => (
            <tr key={index}>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>{employee.currentProject || 'None'}</td>
              <td>{employee.designation}</td>
              <td>
                <input
                  type="checkbox"
                  checked={employee.isAdmin}
                  onChange={(e) => handleAdminChange(index, e.target.checked)}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={employee.isAllowedToReview}
                  onChange={(e) => handleAllowedToReviewChange(index, e.target.checked)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Employees Exception Section
      <h2>Reviewing Exceptions</h2>
<table className="styled-table">
  <thead>
    <tr>
      <th>Name</th>
      <th>Mark as Exception</th>
    </tr>
  </thead>
  <tbody>
    {employees.map((employee, index) => (
      <tr key={index}>
        <td>{employee.name}</td>
        <td>
          <input
            type="checkbox"
            checked={exceptions.includes(employee.name)}
            onChange={(e) => handleExceptionChange(employee.name, e.target.checked)}
          />
        </td>
      </tr>
    ))}
  </tbody>
</table> */}

      {/* Save Button */}
      <button className="save-button" onClick={handleSave}>
        Save Changes
      </button>
    </div>
  );
};

export default MyComponent;
