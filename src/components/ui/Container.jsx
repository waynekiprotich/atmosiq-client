export const Container = ({ children, className = '' }) => (
  <div className={`max-w-[1800px] mx-auto px-6 lg:px-10 ${className}`}>
    {children}
  </div>
);