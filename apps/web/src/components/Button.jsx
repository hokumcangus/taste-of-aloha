function Button({ children, onClick, className, variant = 'primary' }) {
    const baseClasses = 'px-6 py-3 rounded-lg font-semibold transition-colors';
    const variants = {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white',
        secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
        outline: 'border-2 border-gray-800 hover:bg-gray-100 text-gray-800',
    };
    const combinedClasses = `${baseClasses} ${variants[variant]} ${className || ''}`;
    return (
        <button onClick={onClick} className={combinedClasses}>
            {children}
        </button>
    );
}

export default Button;