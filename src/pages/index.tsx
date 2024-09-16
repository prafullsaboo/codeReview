"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { setEmployees, setCurrentUser, setProjects } from '../store/projectSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Employee {
  name: string;
  email: string;
  currentProject: string;
  designation: string;
  isAdmin: boolean;
  isAllowedToReview: boolean;
}

const Login: React.FC = () => {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [employees, setEmployeesState] = useState<Employee[]>([]);
  const [projects, setProjectsState] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('https://code-review-roataion-default-rtdb.firebaseio.com/.json');

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const fetchedEmployees = data.employees || [];
        const fetchedProjects = data.projects || [];
        setIsLoading(false);
        setEmployeesState(fetchedEmployees);
        setProjectsState(fetchedProjects);

      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogin = () => {
    const user = employees.find((user) => user.email === email);

    if (user) {
      dispatch(setCurrentUser(user));
      localStorage.setItem('currentUser', JSON.stringify(user));
      dispatch(setEmployees(employees));
      dispatch(setProjects(projects));
      setIsAdmin(user.isAdmin);

      if (user.isAdmin) {
        if (password === 'India@2024') {
          setError('');
          router.push('/home');
        } else {
          if (password.length > 0)
            setError('Incorrect password for admin');
        }
      } else {
        setError('');
        router.push('/home');
      }
    } else {
      setError('Email not found');
    }
  };

  return (
    <div className="container mx-auto p-4 w-3/5 flex flex-col h-screen justify-center">
      <h2 className="mb-5 text-lg text-white">Founder and Lightning</h2>
      <div className="sticky top-0 z-10 h-16 flex justify-center items-center rounded-md" style={{ background: '#ED663F' }}>
        <h1 className="flex justify-center items-center text-xl font-bold">code review rotation app</h1>
      </div>
      <div className="mt-4 bg-slate-500 flex p-10 flex-col items-center rounded-lg">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 bg-white p-2 w-full text-gray-900"
        />
        {isAdmin && (
          <Input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 bg-white p-2 w-full text-gray-900 mt-4"
          />
        )}
        <Button onClick={handleLogin} className="mt-4 px-4 py-2 w-1/2 bg-blue-500 text-white rounded hover:bg-blue-700">
          Login
        </Button>
        {error && <p className="mt-4 text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default Login;
