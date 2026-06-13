export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <p>© {new Date().getFullYear()} Mikami Sushi</p>
        <a
          href="https://www.instagram.com/mikamisushi/"
          target="_blank"
          rel="noopener noreferrer"
          className="instagram-link"
          aria-label="Instagram Mikami Sushi"
        >
          <i className="fa-brands fa-instagram"></i>
        </a>
      </div>
    </footer>
  );
}
