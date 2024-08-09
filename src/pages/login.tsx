import { useState } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { setEmployees, setCurrentUser, setProjects } from '../../store/projectSlice';

interface Employee {
  name: string;
  email: string;
  currentProject: string;
  designation: string;
  isAdmin: boolean;
  isAllowedToReview: boolean;
}

interface LoginProps {
  employees: Employee[];
  projects: any[];
}

const Login: React.FC<LoginProps> = ({ employees , projects }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();

  const handleLogin = () => {
    const user = employees.find((user) => user.email === email);
    if (user) {
      dispatch(setCurrentUser(user));
      dispatch(setEmployees(employees));
      dispatch(setProjects(projects));
      router.push('/');
      console.warn('user:', user);

      console.warn('employees:', employees);

      console.warn('projects:', projects);
    } else {
      setError('Email not found');
    }
  };

  return (
    <div className="container mx-auto p-4 w-3/5 flex flex-col h-screen justify-center">
      <h2 className="mb-5 text-lg">Founder and Lightning</h2>
      <div className="sticky top-0 z-10 h-16 flex justify-center items-center rounded-md" style={{ background: '#ED663F' }}>
        <h1 className="flex justify-center items-center text-xl font-bold">code review rotation app</h1>
      </div>
      <div className="mt-4 bg-slate-500 flex p-10 flex-col items-center rounded-lg">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full text-gray-900"
        />
        <button onClick={handleLogin} className="mt-4 px-4 py-2 w-1/2 bg-blue-500 text-white rounded hover:bg-blue-700">
          Login
        </button>
        {error && <p className="mt-4 text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employees`);
  const { employees, projects } = await res.json();
  
  return {
    props: {
      employees,
      projects,
    },
  };
};

export default Login;
