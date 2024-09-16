import Spinner from './spinner';

type LoaderProps = {
  width?: string;
  height?: string;
  position?: 'fixed' | 'absolute' | 'relative' | 'sticky' | 'static';
};

const Loader = ({
  width = 'w-screen',
  height = 'h-screen',
  position = 'fixed',
}: LoaderProps) => {
  return (
    <div
      className={`${width} ${height} ${position} flex items-center justify-center bg-gray-100 dark:bg-gray-800 z-50`}
      data-cy="loader"
    >
      <Spinner />
    </div>
  );
};

export default Loader;
