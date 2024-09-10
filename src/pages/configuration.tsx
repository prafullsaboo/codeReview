import { useState, useEffect } from 'react';
import { employees as initialEmployees, projects as initialProjects } from '../../src/pages/api/employees';
import { AppDispatch } from '../store';
import { useDispatch } from 'react-redux';
import { setEmployees, setProjects } from '../store/projectSlice';
import { useRouter } from 'next/router';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const Configuration = () => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const [employees, setConfiguredEmployee] = useState<any[]>([]);
  const [projects, setConfiguredProjects] = useState<any[]>([]);
  const [exceptions, setExceptions] = useState<string[]>([]);
  const [totalSelectedReviewers, setTotalSelectedReviewers] = useState(0);
  const [error, setError] = useState<string[]>([]);

  const availableReviewers = employees.filter(emp => emp.isAllowedToReview).length;


  useEffect(() => {
    setConfiguredEmployee(initialEmployees);
    setConfiguredProjects(initialProjects);
  }, []);

  const handleReviewerCountChange = (index: number, value: number) => {
    // const newProjects = [...projects];
    // const updatedProject = { ...newProjects[index] };
    // updatedProject.noOfReviwersRequirred = value;     
    // newProjects[index] = updatedProject;
    // setConfiguredProjects(newProjects);
    const newProjects = [...projects];

    // Calculate the total reviewers selected across other projects (excluding the current one)
    const currentTotal = newProjects.reduce((sum, proj, idx) => {
      return idx === index ? sum : sum + (proj.noOfReviwersRequirred || 0);
    }, 0);

    // Check if the total exceeds the available reviewers
    if (currentTotal + value > availableReviewers) {
      const newErrors = [...error];
      newErrors[index] = 'Reviewers exceeding available limit';
      setError(newErrors);
      return;
    }

    // Clear the error if within the available limit
    const newErrors = [...error];
    newErrors[index] = '';  // Clear the error for the current project
    setError(newErrors);

    newProjects[index] = {
      ...newProjects[index],
      noOfReviwersRequirred: value,
    };

    setConfiguredProjects(newProjects);


  };


  const handleFixedReviewerChange = (projectIndex: number, reviewerName: string) => {
    const newProjects = [...projects];
    newProjects[projectIndex].fixedReviewer = reviewerName;
    setConfiguredProjects(newProjects);
  };

  const handleCurrentProjectChange = (index: number, value: string) => {
    const updatedEmployees = [...employees];
    updatedEmployees[index] = {
      ...updatedEmployees[index],
      currentProject: value
    };
    setConfiguredEmployee(updatedEmployees);
  };

  const handleSeniorDevChange = (index: number, checked: boolean) => {
    const newProjects = [...projects];
    newProjects[index] = {
      ...newProjects[index],
      isBigProject: checked
    };
    setConfiguredProjects(newProjects);
  };

  const handleExceptionChange = (employeeName: string, checked: boolean) => {
    const updatedExceptions = checked
      ? [...exceptions, employeeName]
      : exceptions.filter(name => name !== employeeName);
    setExceptions(updatedExceptions);
  };

  const handleAdminChange = (index: number, checked: boolean) => {
    const updatedEmployees = [...employees];
    updatedEmployees[index] = {
      ...updatedEmployees[index],
      isAdmin: checked
    };
    setConfiguredEmployee(updatedEmployees);
  };

  const handleAllowedToReviewChange = (index: number, checked: boolean) => {
    const updatedEmployees = [...employees];
    const updatedEmployee = { ...updatedEmployees[index] };
    updatedEmployee.isAllowedToReview = checked;
    updatedEmployees[index] = updatedEmployee;
    setConfiguredEmployee(updatedEmployees);
  };

  const handleSave = () => {
    console.log('Updated Projects:', projects);
    console.log('Updated Employees:', employees);
    console.log('Updated Exceptions:', exceptions);
    dispatch(setProjects(projects));
    dispatch(setEmployees(employees));
  };

  const handleBack = () => {
    router.push('/home');
  };

  const uniqueProjects = Array.from(new Set(projects.map(p => p.name)));
  const getAllowedReviewersCount = () => {
    return employees.filter(emp => emp.isAllowedToReview).length;
  };


  return (
    <div className="ccontainer container-configuration">
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
                {/* <select
                 value={project.noOfReviwersRequirred}
                  onChange={(e) => handleReviewerCountChange(index, parseInt(e.target.value))}
>
                  {Array.from({ length: 4 }, (_, i) => i + 1).map((option) => (
                  <option key={option} value={option}>
                    {option}
                    </option>
                ))}
              </select> */}
                {/* <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a fruit" defaultValue={project.noOfReviwersRequirred}/>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="blueberry">Blueberry</SelectItem>
          <SelectItem value="grapes">Grapes</SelectItem>
          <SelectItem value="pineapple">Pineapple</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select> */}
                <Select value={String(project.noOfReviwersRequirred)} onValueChange={(value) => handleReviewerCountChange(index, parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select number of reviewers" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 4 }, (_, i) => i + 1).map((option) => (
                      <SelectItem key={option} value={String(option)}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {error[index] && <p className="text-red-500">{error[index]}</p>}
              </td>
              <td>
                <Select
                  value={project.fixedReviewer || "none"}
                  onValueChange={(value) =>
                    handleFixedReviewerChange(index, value === "none" ? "" : value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Reviewer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Select Reviewer</SelectItem>
                    {employees.map((employee) => (
                      <SelectItem key={employee.name} value={employee.name}>
                        {employee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </td>
              <td>
                <Checkbox
                  checked={project.isBigProject}
                  onCheckedChange={(checked) => handleSeniorDevChange(index, !!checked)}
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
              <td>
                <Select
                  value={employee.currentProject || "none"}
                  onValueChange={(value) =>
                    handleCurrentProjectChange(index, value === "none" ? "" : value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {uniqueProjects.map((projectName) => (
                      <SelectItem key={projectName} value={projectName}>
                        {projectName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </td>
              <td>{employee.designation}</td>
              <td>
                <Checkbox
                  checked={employee.isAdmin}
                  onCheckedChange={(checked) => handleAdminChange(index, !!checked)}
                />
              </td>
              <td>
                <Checkbox
                  checked={employee.isAllowedToReview}
                  onCheckedChange={(checked) => handleAllowedToReviewChange(index, !!checked)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='flex items-center justify-center mb-5 gap-8'>
        <Button onClick={handleSave} className="save-button">
          Save Changes
        </Button>
        <Button onClick={handleBack} variant="outline" className="save-button">
          Back
        </Button>

      </div>
    </div>
  );
};

export default Configuration;
