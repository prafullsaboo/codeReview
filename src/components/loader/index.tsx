import Spinner from './spinner';
type LoaderProps = {
  width?: string;
  height?: string;
  position?: 'fixed' | 'absolute' | 'relative' | 'sticky' | 'static';
};

const staticLoaderClasses = `rounded-md top-0 left-0 z-[999] flex items-center justify-center 
bg-loader-background dark:bg-loader-background-dark opacity-0 animate-showLoader`;

export const Loader = ({
  width = 'w-screen', height = 'h-screen', position = 'fixed',
}: LoaderProps) => {
  return (
    <div
      className={`${width} ${height} ${position} ${staticLoaderClasses}`}
      data-cy="loader"
    >
      <Spinner />
    </div>
  );
};

export default Loader;
