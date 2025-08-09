import { useNavigate, useLocation } from 'react-router-dom';
import home from '../asset/home.svg'
import stats from '../asset/stats.svg'
import plus from '../asset/plus.svg'
import filler from '../asset/filler.svg'
import profile from '../asset/profile.svg'

const NavigationBar = ({ onPlusClick }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getCurrentPage = () => {
    const path = location.pathname;
    if (path === '/stats') return 'stats';
    if (path === '/profile') return 'profile';
    if (path === '/filler') return 'filler';
    return 'home';
  };

  const currentPage = getCurrentPage();

  return (
    <div className="fixed bottom-0 left-0 right-0 w-full z-50 bg-white">
      <div className="flex items-center justify-around py-4 px-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center justify-center p-2"
          style={{ opacity: currentPage === 'home' ? 1 : 0.4 }}
        >
          <img 
            src={home} 
            alt="home" 
            className="w-8 h-8"
          />
        </button>

        <button
          onClick={() => navigate('/stats')}
          className="flex items-center justify-center p-2"
          style={{ opacity: currentPage === 'stats' ? 1 : 0.4 }}
        >
          <img 
            src={stats} 
            alt="stats" 
            className="w-8 h-8"
          />
        </button>

        <button
          onClick={onPlusClick}
          className="flex items-center justify-center w-14 h-14 rounded-full shadow-lg"
          style={{ 
            background: 'linear-gradient(135deg, #a7f3d0, #fde68a, #f9a8d4)',
          }}
        >
          <img 
            src={plus} 
            alt="add" 
            className="w-6 h-6"
          />
        </button>

        <button
          onClick={() => navigate('/filler')}
          className="flex items-center justify-center p-2"
          style={{ opacity: currentPage === 'filler' ? 1 : 0.4 }}
        >
          <img 
            src={filler} 
            alt="filler" 
            className="w-8 h-8"
          />
        </button>

        <button
          onClick={() => navigate('/profile')}
          className="flex items-center justify-center p-2"
          style={{ opacity: currentPage === 'profile' ? 1 : 0.4 }}
        >
          <img 
            src={profile} 
            alt="profile" 
            className="w-8 h-8"
          />
        </button>
      </div>
      
      <div className="flex justify-center pb-2">
        <div className="w-32 h-1 bg-black rounded-full"></div>
      </div>
    </div>
  );
};

export default NavigationBar;