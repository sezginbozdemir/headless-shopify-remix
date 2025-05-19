export default function Footer() {
  return (
    <footer className="bg-indigo-600 text-white py-8 mt-12">
      <div className="container mx-auto px-6 text-center">
        <p className="mb-4">
          &copy; {new Date().getFullYear()} MyStore. All rights reserved.
        </p>
        <div className="flex justify-center space-x-6">
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-300"
            aria-label="Twitter"
          >
            Twitter
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-300"
            aria-label="Facebook"
          >
            Facebook
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-300"
            aria-label="Instagram"
          >
            Instagram
          </a>
        </div>
      </div>
    </footer>
  );
}
