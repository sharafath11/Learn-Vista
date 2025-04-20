"use client"
import { MentorContext } from '@/src/context/mentorContext';
import { MentorAPIMenthods } from '@/src/services/APImethods';
import { showSuccessToast } from '@/src/utils/Toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useContext, useState, useCallback, useEffect } from 'react';
import { FaEye, FaEyeSlash, FaArrowRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { generateEncodedKey } from '@/src/utils/GenerateEncodedKey';

interface FormErrors {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    showPassword: false
  });
  const [errors, setErrors] = useState<FormErrors>({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shake, setShake] = useState(false);
  const router = useRouter();
  const mentorContext = useContext(MentorContext);

  const validateForm = useCallback(() => {
    const newErrors: FormErrors = { email: '', password: '' };
    let valid = true;

    if (!formData.email) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  }, [formData.email, formData.password]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? e.target.checked : value
    }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await MentorAPIMenthods.login(formData.email, formData.password);
      if (res.ok) {
        console.log(res)
        showSuccessToast(res.msg);
        mentorContext?.setMentor(res.payload.mentor);
        generateEncodedKey("mentor")
        router.push("/mentor/home");
      }
    } catch (error) {
      console.error('Login error:', error);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData.email, formData.password, validateForm, mentorContext, router]);

  const togglePasswordVisibility = useCallback(() => {
    setFormData(prev => ({ ...prev, showPassword: !prev.showPassword }));
  }, []);

  const [gradientPos, setGradientPos] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setGradientPos({
        x: (e.clientX / window.innerWidth) * 50,
        y: (e.clientY / window.innerHeight) * 50
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden"
      style={{
        background: `radial-gradient(circle at ${gradientPos.x}% ${gradientPos.y}%, rgba(99, 102, 241, 0.8), rgba(168, 85, 247, 0.8))`
      }}
    >
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <motion.div
          animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.5 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white/20"
        >
          {/* Card Header */}
          <div className="px-8 py-6 border-b border-white/10">
            <motion.h2 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold text-center text-white"
            >
              Welcome Back
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-2 text-sm text-center text-white/80"
            >
              Sign in to continue to your dashboard
            </motion.p>
          </div>

          {/* Card Body */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg bg-white/10 border ${
                      errors.email ? 'border-red-400' : 'border-white/20'
                    } text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-200`}
                    placeholder="you@example.com"
                  />
                  <AnimatePresence>
                    {errors.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-1 text-sm text-red-300"
                      >
                        {errors.email}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Password Field */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={formData.showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg bg-white/10 border ${
                      errors.password ? 'border-red-400' : 'border-white/20'
                    } text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-200 pr-10`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/50 hover:text-white transition-colors duration-200"
                    onClick={togglePasswordVisibility}
                  >
                    {formData.showPassword ? (
                      <FaEyeSlash className="h-5 w-5" />
                    ) : (
                      <FaEye className="h-5 w-5" />
                    )}
                  </button>
                  <AnimatePresence>
                    {errors.password && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-1 text-sm text-red-300"
                      >
                        {errors.password}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Forgot Password */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex justify-end"
              >
                <Link
                  href="#"
                  className="text-sm font-medium text-white/70 hover:text-white transition-colors duration-200"
                >
                  Forgot password?
                </Link>
              </motion.div>

              {/* Login Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center items-center py-3 px-4 rounded-lg bg-white text-indigo-600 hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-500 font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      Sign In <FaArrowRight className="ml-2" />
                    </span>
                  )}
                </button>
              </motion.div>
            </form>
          </div>

          {/* Card Footer */}
          <div className="px-8 py-6 border-t border-white/10 text-center">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-sm text-white/70"
            >
              Don't have an account?{' '}
              <Link
                href="/mentor/signup"
                className="font-medium text-white hover:text-white/90 transition-colors duration-200"
              >
                Sign up
              </Link>
            </motion.p>
          </div>
        </motion.div>
      </motion.div>

      {/* Floating particles animation */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          initial={{
            x: Math.random() * 100,
            y: Math.random() * 100,
            opacity: 0
          }}
          animate={{
            x: [null, Math.random() * 100],
            y: [null, Math.random() * 100],
            opacity: [0, 0.3, 0]
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear"
          }}
          className="absolute rounded-full bg-white/10"
          style={{
            width: Math.random() * 5 + 2,
            height: Math.random() * 5 + 2
          }}
        />
      ))}
    </div>
  );
}