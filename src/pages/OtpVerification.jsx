import React, { useState, useRef, useEffect } from "react";
import {
  MdEmail,
  MdArrowBack,
  MdSms,
} from "react-icons/md";
import axios from "axios";
import toast from "react-hot-toast";

const OtpVerification = ({
  email,
  phone,
  verificationMethod = "email",
  setCurrentView,
  setIsLogin,
  clearAllStates,
  onComplete,
  countdown,
  setCountdown,
  onResend,
  isForgotPassword = false,
  onBack,
  isLoading,
}) => {
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const otpRefs = [useRef(), useRef(), useRef(), useRef(), useRef()];

  // countdown effect
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // auto verify OTP if all digits filled
  useEffect(() => {
    if (otp.every((digit) => digit !== "")) {
      handleOTPVerify();
    }
  }, [otp]);

  const handleOTPChange = (index, value) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return; // Allow only digits
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value !== "" && index < 4) {
      otpRefs[index + 1].current.focus();
    }
  };

  const handleOTPKeyDown = (index, e) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      otpRefs[index - 1].current.focus();
    }
  };

  const handleOTPVerify = async () => {
    const otpCode = otp.join("");

    if (!otpCode || otpCode.length !== 5) {
      toast.error("Please enter a valid 5-digit OTP");
      return;
    }

    try {
      if (isForgotPassword) {
        // For forgot password flow - verify OTP
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/password/verify-otp`,
          {
            email,
            otp: otpCode,
          },
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );

        if (response.data.success) {
          toast.success("OTP verified successfully!");
          if (onComplete) onComplete(otpCode); // Pass the OTP to parent
        }
      } else {
        // For registration flow
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/otp-verification`,
          {
            email,
            phone,
            otp: otpCode,
          },
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );

        toast.success(response.data.message);
        setCurrentView("login");
        setIsLogin(true);
        if (clearAllStates) clearAllStates();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Invalid OTP. Please try again."
      );
      // Clear OTP fields on error
      setOtp(["", "", "", "", ""]);
      otpRefs[0].current.focus();
    }
  };

  const handleResendOTP = async () => {
    if (countdown === 0) {
      // If onResend prop is provided (for forgot password flow), use it
      if (onResend) {
        onResend();
      } else {
        // Otherwise, handle the regular OTP resend
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/resend-otp`,
            {
              email,
              phone,
              verificationMethod,
            },
            {
              withCredentials: true,
              headers: { "Content-Type": "application/json" },
            }
          );

          toast.success("New OTP sent!");
          setOtp(["", "", "", "", ""]);
          setCountdown(30);
          otpRefs[0].current.focus();
        } catch (error) {
          toast.error(error.response?.data?.message || "Failed to resend OTP");
        }
      }
    }
  };

  const handleBackNavigation = () => {
    if (isForgotPassword && onBack) {
      onBack();
    } else if (!isForgotPassword) {
      setCurrentView("register");
      setIsLogin(false);
    }
    setOtp(["", "", "", "", ""]);
    setCountdown(0);
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={handleBackNavigation}
        className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
      >
        <MdArrowBack className="w-5 h-5 mr-2" />
        <span className="text-sm font-medium">
          {isForgotPassword ? "Back to Email" : "Back to Registration"}
        </span>
      </button>

      {/* Heading */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          {verificationMethod === "phone" ? (
            <MdSms className="w-8 h-8 text-blue-600" />
          ) : (
            <MdEmail className="w-8 h-8 text-blue-600" />
          )}
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Verify Your {verificationMethod === "phone" ? "Phone" : "Email"}
        </h3>
        <p className="text-sm text-gray-600 mb-1">
          We've sent a {otp.length}-digit code to
        </p>
        <p className="text-sm font-semibold text-gray-800">
          {verificationMethod === "phone" ? phone : email}
        </p>
      </div>

      {/* OTP Input */}
      <div className="flex justify-center space-x-3">
        {otp.map((digit, index) => (
          <input
            key={index}
            id={`otp-input-${index}`}
            ref={otpRefs[index]}
            type="text"
            maxLength="1"
            value={digit}
            autoComplete="one-time-code"
            inputMode="numeric"
            pattern="\d{5}"
            onChange={(e) => handleOTPChange(index, e.target.value)}
            onKeyDown={(e) => handleOTPKeyDown(index, e)}
            className="w-14 h-14 text-center text-xl font-bold border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors bg-gray-50"
            placeholder="0"
          />
        ))}
      </div>

      {/* Resend OTP */}
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-3">Didn't receive the code?</p>
        <button
          onClick={handleResendOTP}
          disabled={countdown > 0}
          className={`text-sm font-semibold transition-colors ${
            countdown > 0
              ? "text-gray-400 cursor-not-allowed"
              : "text-blue-600 hover:text-blue-700"
          }`}
        >
          {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
        </button>
      </div>

      {/* Verify Button */}
      <button
        onClick={handleOTPVerify}
        disabled={!otp.every((digit) => digit !== "")}
        className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] ${
          otp.every((digit) => digit !== "")
            ? "bg-blue-600 hover:bg-blue-700 text-white"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        Verify & Continue
      </button>
    </div>
  );
};

export default OtpVerification;
