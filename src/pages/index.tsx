import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { RootState, AppDispatch } from '../../store';
import { selectCurrentUser, selectEmployees, selectEmployeesWithoutProjects, selectEmployeesExemptedFromReview, selectProjectDetails, selectProjects, setProjects, shuffleReviewers, selectEmployeeProjectReviewDetails } from '../../store/projectSlice';
import { useSpring, useTransition, animated } from 'react-spring';
import Confetti from 'react-dom-confetti';

interface Project {
  name: string;
  currentDevelopers: string[];
  isBigProject: boolean;
  codeReviewers?: string[];
}

const Home: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const [animateShuffle, setAnimateShuffle] = useState(false);
  const [animateRows, setAnimateRows] = useState(false);
  const projects = useSelector(selectProjects);
  const employees = useSelector(selectEmployees);
  const currentUser = useSelector(selectCurrentUser);
  const projectDetails = useSelector((state: RootState) => selectProjectDetails(state));
  const employeesWithoutProjects = useSelector((state: RootState) => selectEmployeesWithoutProjects(state));
  const employeesExemptedFromReview = useSelector((state: RootState) => selectEmployeesExemptedFromReview(state));
  const employeeProjectReviewDetails = useSelector((state: RootState) => selectEmployeeProjectReviewDetails(state));

  useEffect(() => {
    if (employees.length > 0) {
      const initialProjects = projects.map(proj => {
        const currentDevelopers = employees
          .filter(emp => emp.currentProject === proj.name)
          .map(emp => emp.name);
        return {
          ...proj,
          currentDevelopers: currentDevelopers.length > 0 ? currentDevelopers : [],
          codeReviewers: proj.codeReviewers,
        };
      });
      dispatch(setProjects(initialProjects));
    }
  }, [employees, dispatch]);
  

  const transitions = useTransition(projects, {
    key: (project: any) => project.name,
    from: { opacity: 0, transform: 'translate3d(0,-20px,0)' },
    enter: { opacity: 1, transform: 'translate3d(0,0px,0)' },
    leave: { opacity: 0, transform: 'translate3d(0,-20px,0)' },
    onRest: () => setAnimateRows(false),
  });

  const handleShuffle = () => {
    if (currentUser?.isAdmin) {
      dispatch(shuffleReviewers());
      setAnimateShuffle(true);
      setTimeout(() => {
        setAnimateShuffle(false);
      }, 2000);
    }
  };
  const handleLogout = () => {
      router.push('/login');
  };

  return (
    <div className="container mx-auto p-4 text-gray-900 bg-white min-h-screen">
      <div className='flex flex-row items-center mb-4 justify-around'>
        <h1 className="flex justify-center items-center text-2xl font-bold">Frontend Code Review Sheet</h1>
        <button onClick={handleLogout} className="w-1/4 bg-blue-500 text-white rounded hover:bg-blue-700">
          Log out
        </button>
      </div>
      <table className="min-w-full bg-white border border-gray-300">
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
              <td className="py-2 px-4 border border-gray-500">{project.projectName}</td>
              <td className="py-2 px-4 border border-gray-500">{project.currentDevelopers?.join(', ')}</td>
              <td className="py-2 px-4 border border-gray-500">
                {project.reviewers?.join(', ')}
              </td>
            </tr>
          ))}
        </tbody>
        {/* <thead>
          <tr>
            <th className="border border-gray-500 px-4 py-2">Employee Name</th>
            <th className="border border-gray-500 px-4 py-2">Current Project</th>
            <th className="border border-gray-500 px-4 py-2">Reviewing Projects</th>
          </tr>
        </thead>
        <tbody>
          {employeeProjectReviewDetails.map(emp => (
            <tr key={emp.name}>
              <td className="border border-gray-500 px-4 py-2">{emp.name}</td>
              <td className="border border-gray-500 px-4 py-2">{emp.currentProject}</td>
              <td className="border border-gray-500 px-4 py-2">{emp.reviewingProjects}</td>
            </tr>
          ))}
        </tbody> */}
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
