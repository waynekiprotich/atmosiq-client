import { Container } from '../ui/Container';

export const Footer = () => (
  <footer className="py-12 border-t border-border mt-12">
    <Container className="flex flex-col sm:flex-row justify-between items-center gap-4">
      <p className="text-sm text-textSecondary">AtmosIQ © {new Date().getFullYear()}. All rights reserved.</p>
      <p className="text-sm text-textSecondary">Data provided by OpenWeatherMap. UI by AtmosIQ.</p>
    </Container>
  </footer>
);