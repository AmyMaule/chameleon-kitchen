const Footer = () => {
  const currentYear = new Date();

  return (
    <footer className="footer-container">
      <div className="footer-copyright">© {currentYear.getFullYear()} Amy Maule</div>
    </footer>
  );
};

export default Footer;
