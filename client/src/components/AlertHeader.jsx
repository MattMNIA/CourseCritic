import { useUniversity } from '../contexts/UniversityContext';

const AlertHeader = () => {
  const { currentUniversity } = useUniversity();
  
  console.log('Current university in AlertHeader:', currentUniversity); // Add this log
  
  return (
    <div className="alert alert-info">
      <div className="container">
        <h4 className="alert-heading">
          {currentUniversity ? `${currentUniversity.name}` : 'Select a University'}
        </h4>
      </div>
    </div>
  );
};

export default AlertHeader;
