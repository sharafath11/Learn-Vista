import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex flex-col">
      <div className="py-6 px-4">
       
      </div>
      <div className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden bg-white border border-gray-100">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8">
            <div className="p-6 lg:p-12">
              <LoginForm />
            </div>
            <div className="hidden lg:flex items-center justify-center bg-gradient-to-r from-purple-100 to-indigo-100">
              <img
                src="/images/login.png"
                alt="Login Illustration"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}