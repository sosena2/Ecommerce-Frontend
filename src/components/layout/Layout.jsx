import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) =>{
    const location = useLocation();
    const hideChrome = location.pathname === '/login' || location.pathname === '/register';

    return (
      <div className="min-h-screen flex flex-col">
      {!hideChrome && <Header />}
      <main className="flex-1">{children}</main>
      {!hideChrome && <Footer />}
    </div>
    );
};
export default Layout;