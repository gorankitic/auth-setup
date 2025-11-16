const Footer = () => {
    return (
        <footer className='px-4 pt-3 pb-5 text-center text-xs text-gray-500'>
            <p>
                &copy; {new Date().getFullYear()} Goran Kitic
            </p>
            <p>
                Built with <span role="img" aria-label="heart">❤️ </span>
                using Node.js, Express, MongoDB, Mongoose, React, TypeScript, React Router, Tanstack Query, TailwindCSS.
                <span role="img" aria-label="rocket"> 🚀</span>
            </p>
        </footer>
    )
}

export default Footer;