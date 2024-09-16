import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { RootState, AppDispatch } from '../store';
import { selectCurrentUser, selectEmployees, selectEmployeesWithoutProjects, selectEmployeesExemptedFromReview, selectProjectDetails, selectProjects, setProjects, shuffleReviewers, selectEmployeeProjectReviewDetails, setEmployees, setCurrentUser } from '../store/projectSlice';
import { useSpring, useTransition, animated } from 'react-spring';
import Confetti from 'react-dom-confetti';
import { Button } from '@/components/ui/button';

const Home: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const [animateShuffle, setAnimateShuffle] = useState(false);

  const projects = useSelector(selectProjects);
  const employees = useSelector(selectEmployees);
  const currentUser = useSelector(selectCurrentUser);
  const projectDetails = useSelector((state: RootState) => selectProjectDetails(state));
  const employeesWithoutProjects = useSelector((state: RootState) => selectEmployeesWithoutProjects(state));
  const employeesExemptedFromReview = useSelector((state: RootState) => selectEmployeesExemptedFromReview(state));
  const employeeProjectReviewDetails = useSelector((state: RootState) => selectEmployeeProjectReviewDetails(state));

  useEffect(() => {

    const initialProjects = projects.map(proj => {
      const currentDevelopers = employees
        .filter(emp => emp.currentProject === proj.name)
        .map(emp => emp.name);
      return {
        ...proj,
        currentDevelopers: currentDevelopers.length > 0 ? currentDevelopers : [],
        codeReviewers: proj.reviewers,
        fixedReviewer: proj.fixedReviewer,
        reviewers: proj.reviewers,
      };
    });
    dispatch(setProjects(initialProjects));

  }, [dispatch, employees]);

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      dispatch(setCurrentUser(JSON.parse(user)));
    }
  }, [dispatch]);

  useEffect(() => {

    const fetchData = async () => {
      try {
        const response = await fetch('https://code-review-roataion-default-rtdb.firebaseio.com/.json');

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const fetchedEmployees = data.employees || [];
        const fetchedProjects = data.projects || [];
        const user = employees.find((user) => user.email === fetchedEmployees[0].email);
        dispatch(setEmployees(fetchedEmployees));
        dispatch(setProjects(fetchedProjects));

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (projectDetails.length > 0) {
    }
  }, [projectDetails]);

  const handleShuffle = async () => {
    try {
      await dispatch(shuffleReviewers() as any);
      setAnimateShuffle(true);
    } catch (error) {
      console.error('Error during shuffle:', error);
    }
  };

  useEffect(() => {
    const postProjectDetails = async () => {
      try {

        const response = await fetch('https://code-review-roataion-default-rtdb.firebaseio.com/.json', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            employees: employees,
            projects: projectDetails,
          }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        console.log('Data posted successfully:', result);
      } catch (error) {
        console.error('Error posting data:', error);
      } finally {
        console.warn('Data posting attempt finished');
      }
    };
    postProjectDetails();
  }, [projectDetails, employees]);

  const handleLogout = () => {
    router.push('/');
  };

  const handleConfiguration = () => {
    router.push('/configuration');
  };

  return (
    <div className="container mx-auto p-4 text-gray-900 bg-white min-h-screen">
      <div className='flex flex-row items-center mb-4 justify-around'>
        <h1 className="flex justify-center items-center text-2xl font-bold">Frontend Code Review Sheet</h1>
        <Button onClick={handleLogout} className="w-1/4 bg-blue-500 text-white rounded hover:bg-blue-700">
          Log out
        </Button>
        {currentUser?.isAdmin && (
          <Button onClick={handleConfiguration} className="w-1/4 bg-blue-500 text-white rounded hover:bg-blue-700">
            Change Configuration
          </Button>
        )}
      </div>
      <table className="styled-table">
        <thead>
          <tr>
            <th className="py-2 px-4 border border-gray-500">Project</th>
            <th className="py-2 px-4 border border-gray-500">Current Developers</th>
            <th className="py-2 px-4 border border-gray-500">Code Reviewer(s)</th>
          </tr>
        </thead>
        <tbody>
          {projectDetails.map((project, index) => (
            <tr key={index}>
              <td className="py-2 px-4 border border-gray-500">{project.name}</td>
              <td className="py-2 px-4 border border-gray-500">{project.currentDevelopers?.join(', ')}</td>
              <td className="py-2 px-4 border border-gray-500">
                {project.reviewers?.join(', ')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {currentUser?.isAdmin && (
        <div className="min-w-full flex justify-center items-center">
          <animated.button
            onClick={handleShuffle}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Shuffle Reviewers
          </animated.button>
        </div>
      )}
      <div className="h-screen fixed top-50 left-30 pointer-events-none z-50">
        <Confetti active={animateShuffle} config={{ spread: 360, elementCount: 400 }} />
      </div>
      <div className="mt-8 flex flex-row justify-between">
        <div className="w-1/2 pr-4">
          <h2 className="text-xl font-bold mb-2">Employees without Projects:</h2>
          <ul className="list-disc list-inside">
            {employeesWithoutProjects.map(emp => (
              <li key={emp.email}>{emp.name}</li>
            ))}
          </ul>
        </div>
        <div className="w-1/2 pl-4">
          <h2 className="text-xl font-bold mb-2">Employees exempted from review:</h2>
          <ul className="list-disc list-inside">
            {employeesExemptedFromReview.map(emp => (
              <li key={emp.email}>{emp.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
