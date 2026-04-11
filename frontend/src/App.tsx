import { AuthProvider } from './context/AuthContext';
import AppRouter from './routes/AppRouter';
import { Container } from 'react-bootstrap';

function App() {
  return (
    <AuthProvider>
      <Container>
        <AppRouter />
      </Container>
    </AuthProvider>
  );
}

export default App;