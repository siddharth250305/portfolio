import DATA from '../../data/personalData';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-social">
        {DATA.github && (
          <a href={DATA.github} target="_blank" rel="noopener noreferrer" className="footer-social-link">
            github
          </a>
        )}
        {DATA.linkedin && (
          <a href={DATA.linkedin} target="_blank" rel="noopener noreferrer" className="footer-social-link">
            linkedin
          </a>
        )}
        {DATA.x && (
          <a href={DATA.x} target="_blank" rel="noopener noreferrer" className="footer-social-link">
            x
          </a>
        )}
        <a href={`mailto:${DATA.email}`} className="footer-social-link">
          email
        </a>
      </div>
      <p>© {new Date().getFullYear()} Rathod Adesh Siddhartha — All Rights Reserved</p>
    </footer>
  );
}
