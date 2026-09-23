import { useState, type FormEvent } from 'react';
import { authenticate, demoCredentials } from '@/lib/backoffice/auth';
import type { SessionUser } from '@/lib/backoffice/types';
import { Button } from '@/components/Button';

type LoginPageProps = {
  onSignedIn: (user: SessionUser) => void;
};

export function LoginPage({ onSignedIn }: LoginPageProps) {
  const [email, setEmail] = useState(demoCredentials.admin.email);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const user = authenticate(email, password);
    if (!user) {
      setError('E-mail ou senha inválidos.');
      return;
    }
    onSignedIn(user);
  };

  return (
    <div className="admin-login">
      <form className="admin-login-card" onSubmit={onSubmit}>
        <img className="admin-login-logo" src="/images/elementos/logo-enlace.svg" alt="Enlace" />
        <p>Entre para cuidar do casamento, dos convidados e das confirmações.</p>
        <div className="admin-form" style={{ marginTop: '1.4rem' }}>
          <div className="admin-field">
            <label htmlFor="admin-email">E-mail</label>
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="admin-field">
            <label htmlFor="admin-password">Senha</label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          {error ? (
            <p className="field-error" role="alert">
              {error}
            </p>
          ) : null}
          <Button type="submit" fullWidth>
            Entrar
          </Button>
        </div>
        <div className="admin-demo">
          <strong>Acesso de demonstração</strong>
          Administrador: {demoCredentials.admin.email} / {demoCredentials.admin.password}
          <br />
          Cerimonialista: {demoCredentials.ceremonialist.email} / {demoCredentials.ceremonialist.password}
        </div>
      </form>
    </div>
  );
}
