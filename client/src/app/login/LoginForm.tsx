
import { FcGoogle } from "react-icons/fc";

export default function LoginForm() {
  return (
    <div className="max-w-md mx-auto">
      <div className="mb-6 flex items-center">
        <img src="/images/logo.png" alt="Learn Vista Logo" className="w-10" />
        <span className="ml-2 text-xl font-bold text-purple-900">Learn Vista</span>
      </div>

      <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
      <p className="mt-2 text-gray-500">Please enter your details</p>

      <form className="mt-6">
        <FormInput label="Email address" type="email" id="email" />
        <FormInput label="Password" type="password" id="password" />
        
        <div className="flex justify-between text-sm text-gray-500 mb-4">
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" /> Remember for 30 days
          </label>
          <a href="#" className="text-purple-600 hover:underline">Forgot password?</a>
        </div>
        
        <button type="submit" className="w-full bg-purple-600 py-2.5 text-sm font-medium text-white rounded-lg shadow-md hover:bg-purple-700 transition">Sign in</button>
      </form>
      
      <div className="relative my-6 flex items-center">
        <div className="w-full border-t border-gray-200"></div>
        <span className="bg-white px-4 text-xs text-gray-500">OR</span>
      </div>
      
      <button type="button" className="flex w-full items-center justify-center rounded-lg border border-gray-200 bg-white py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
        <FcGoogle className="mr-2 h-4 w-4" /> Sign in with Google
      </button>
      
      <p className="mt-6 text-center text-xs text-gray-500">
        Don’t have an account? <a href="/signup" className="text-purple-600 font-medium hover:underline">Sign up</a>
      </p>
    </div>
  );
}

function FormInput({ label, type, id }: any) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
      <input type={type} id={id} className="block w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100 transition" />
    </div>
  );
}
