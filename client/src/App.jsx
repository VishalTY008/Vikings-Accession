import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SocketProvider } from './context/SocketContext';
import { NotificationProvider } from './context/NotificationContext';
import { CursorProvider } from './context/CursorContext';
import { SmoothScrollProvider } from './context/SmoothScrollContext';
import NoiseOverlay from './components/UI/NoiseOverlay';
import CustomCursor from './components/UI/CustomCursor';
import AppRouter from './routes/AppRouter';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider>
          <NotificationProvider>
            <CursorProvider>
              <SmoothScrollProvider>
                <NoiseOverlay />
                <CustomCursor />
                <AppRouter />
              </SmoothScrollProvider>
            </CursorProvider>
          </NotificationProvider>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
