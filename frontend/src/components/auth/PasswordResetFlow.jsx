import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword, verifyOTP, resetPassword } from '../../api/userApi';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowLeft, Save, ShieldCheck, Loader2, ArrowRight, KeyRound, CheckCircle2 } from 'lucide-react';

const PasswordResetFlow = ({ defaultEmail = '', portalMode = false }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(defaultEmail);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' });

  const otpRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    if (defaultEmail) setEmail(defaultEmail);
  }, [defaultEmail]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      return toast.error('Please enter your email');
    }
    try {
      setLoading(true);
      const result = await forgotPassword({ email });
      if (result.success) {
        toast.success(result.message);
        setStep(2);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData.length > 0) {
      const newOtp = pastedData.split('');
      // Pad with empty strings if less than 6 digits
      while (newOtp.length < 6) {
        newOtp.push('');
      }
      setOtp(newOtp);
      // Focus the last filled input or the first empty one
      const focusIndex = Math.min(pastedData.length, 5);
      setTimeout(() => otpRefs[focusIndex].current?.focus(), 0);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length < 6) {
      return toast.error('Please enter the full 6-digit OTP');
    }
    try {
      setLoading(true);
      const result = await verifyOTP({ email, otp: otpValue });
      if (result.success) {
        toast.success(result.message);
        setStep(3);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      return toast.error('Passwords do not match!');
    }
    if (passwords.newPassword.length < 6) {
      return toast.error('Password must be at least 6 characters long');
    }
    try {
      setLoading(true);
      const result = await resetPassword({
        email,
        otp: otp.join(''),
        newPassword: passwords.newPassword,
      });
      if (result.success) {
        toast.success(result.message);
        navigate(portalMode ? '/' : '/login');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const headerTitle = portalMode ? 'Reset Password' : 'Forgot Password?';
  const headerSubtitle = portalMode
    ? 'Verify your email and set a new student login password.'
    : 'Enter your email to receive a recovery OTP.';
  const returnLink = portalMode ? '/' : '/login';
  const returnLabel = portalMode ? 'Return to Dashboard' : 'Return to Login';

  return (
    <div className='min-h-screen w-full flex items-center justify-center bg-[#f8fafc] relative overflow-hidden font-sans selection:bg-indigo-100 selection:text-indigo-900'>
      <div className='absolute top-0 left-0 w-full h-full overflow-hidden z-0'>
        <motion.div
          animate={{ scale: [1, 1.1, 1], x: [0, 30, 0], y: [0, -30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className='absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100/40 blur-[120px] rounded-full'
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [0, -20, 0], y: [0, 40, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className='absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100/40 blur-[120px] rounded-full'
        />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='z-10 w-full max-w-md bg-white/70 backdrop-blur-xl border border-white rounded-4xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.05)] mx-4'
      >
        <div className='p-8 md:p-10'>
          <div className='mb-8'>
            <Link to={returnLink} className='inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-all group mb-6'>
              <ArrowLeft className='w-4 h-4 group-hover:-translate-x-1 transition-transform' />
              <span className='text-sm'>{returnLabel}</span>
            </Link>
            <AnimatePresence mode='wait'>
              {step === 1 && (
                <motion.div key='step1-header' initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                  <h2 className='text-3xl font-black text-slate-900 tracking-tight'>{headerTitle}</h2>
                  <p className='text-slate-500 text-sm mt-2 font-medium'>{headerSubtitle}</p>
                </motion.div>
              )}
              {step === 2 && (
                <motion.div key='step2-header' initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                  <h2 className='text-3xl font-black text-slate-900 tracking-tight'>Verify OTP</h2>
                  <p className='text-slate-500 text-sm mt-2 font-medium'>We've sent a 6-digit code to <span className='text-indigo-600 font-bold'>{email}</span></p>
                </motion.div>
              )}
              {step === 3 && (
                <motion.div key='step3-header' initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                  <h2 className='text-3xl font-black text-slate-900 tracking-tight'>New Password</h2>
                  <p className='text-slate-500 text-sm mt-2 font-medium'>Create a strong password for your account.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence mode='wait'>
            {step === 1 && (
              <motion.form
                key='step1-form'
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleEmailSubmit}
                className='space-y-6'
              >
                <div className='space-y-2'>
                  <label className='text-xs font-black text-slate-400 uppercase tracking-widest ml-1'>Email Address</label>
                  <div className='relative group'>
                    <Mail className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors' />
                    <input
                      type='email'
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      readOnly={!!defaultEmail}
                      className='w-full bg-slate-50/50 border border-slate-200 text-slate-900 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder:text-slate-400 font-medium shadow-sm'
                      placeholder='name@university.edu'
                    />
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type='submit'
                  disabled={loading}
                  className='w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 transition-all disabled:opacity-70'
                >
                  {loading ? <Loader2 className='w-5 h-5 animate-spin' /> : (
                    <>
                      Send OTP Code
                      <ArrowRight className='w-4 h-4' />
                    </>
                  )}
                </motion.button>
              </motion.form>
            )}

            {step === 2 && (
              <motion.form
                key='step2-form'
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleVerifyOTP}
                className='space-y-8'
              >
                <div className='flex justify-center gap-2'>
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={otpRefs[index]}
                      type='text'
                      inputMode='numeric'
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      className='w-14 h-14 text-center text-2xl font-black bg-white border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-indigo-600 shadow-sm leading-none'
                    />
                  ))}
                </div>
                <div className='space-y-4'>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type='submit'
                    disabled={loading}
                    className='w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 transition-all disabled:opacity-70'
                  >
                    {loading ? <Loader2 className='w-5 h-5 animate-spin' /> : (
                      <>
                        Verify OTP
                        <ShieldCheck className='w-4 h-4' />
                      </>
                    )}
                  </motion.button>
                  <button
                    type='button'
                    onClick={handleEmailSubmit}
                    className='w-full text-center text-xs font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-colors'
                  >
                    Didn't get code? <span className='text-indigo-600'>Resend Now</span>
                  </button>
                </div>
              </motion.form>
            )}

            {step === 3 && (
              <motion.form
                key='step3-form'
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleResetPassword}
                className='space-y-6'
              >
                <div className='space-y-2'>
                  <label className='text-xs font-black text-slate-400 uppercase tracking-widest ml-1'>New Password</label>
                  <div className='relative group'>
                    <Lock className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors' />
                    <input
                      type='password'
                      required
                      value={passwords.newPassword}
                      onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                      className='w-full bg-slate-50/50 border border-slate-200 text-slate-900 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder:text-slate-400 font-medium shadow-sm'
                      placeholder='New password'
                    />
                  </div>
                </div>
                <div className='space-y-2'>
                  <label className='text-xs font-black text-slate-400 uppercase tracking-widest ml-1'>Confirm Password</label>
                  <div className='relative group'>
                    <Lock className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors' />
                    <input
                      type='password'
                      required
                      value={passwords.confirmPassword}
                      onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                      className='w-full bg-slate-50/50 border border-slate-200 text-slate-900 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder:text-slate-400 font-medium shadow-sm'
                      placeholder='Confirm new password'
                    />
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type='submit'
                  disabled={loading}
                  className='w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 transition-all disabled:opacity-70'
                >
                  {loading ? <Loader2 className='w-5 h-5 animate-spin' /> : (
                    <>
                      Reset Password
                      <Save className='w-4 h-4' />
                    </>
                  )}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default PasswordResetFlow;
