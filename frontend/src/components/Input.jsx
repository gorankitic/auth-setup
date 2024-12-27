const Input = ({ type, name, register, rightIcon: RightIcon, leftIcon: LeftIcon, placeholder, error, passwordVisible, toggleVisibility }) => {
	return (
		<div className="relative">
			<input
				{...register(name)}
				type={type === "password" && passwordVisible ? "text" : type}
				name={name}
				placeholder={placeholder}
				autoComplete="off"
				className="w-full pl-10 pr-4 py-2 rounded-md border placeholder-gray-400 border-gray-300 focus:outline-blue-600"
			/>
			<LeftIcon className="w-5 h-5 absolute left-3 top-[10px] text-gray-500 pointer-events-none" />
			{type === "password" && (
				<RightIcon
					onClick={toggleVisibility}
					className="w-5 h-5 absolute right-3 top-[10px] text-gray-500 cursor-pointer"
				/>
			)}
			{error && <p className="text-red-500 mt-1">{error.message}</p>}
		</div>
	);
};
export default Input;
