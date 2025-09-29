import React, { useState, useRef, useEffect } from "react";
import {
  MdEmail,
  MdArrowBack,
  MdSms,
} from "react-icons/md";
import axios from "axios";
import toast from "react-hot-toast";
import { CircularProgress } from "@mui/material";

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
  const [isVerifying, setIsVerifying] = useState(false);
  const otpRefs = [useRef(), useRef(), useRef(), useRef(), useRef()];

  // Auto-focus first input when component mounts
  useEffect(() => {
    if (otpRefs[0].current) {
      otpRefs[0].current.focus();
    }
  }, []);

  // Countdown effect
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown, setCountdown]);

  const handleOTPChange = (index, value) => {
    if (value.length > 1) {
      // Handle paste
      handlePaste(index, value);
      return;
    }

    if (!/^\d*$/.test(value)) return; // Allow only digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value !== "" && index < 4) {
      otpRefs[index + 1].current.focus();
    }
  };

  const handlePaste = (startIndex, pastedValue) => {
    const pastedDigits = pastedValue.replace(/\D/g, "").slice(0, 5);
    const newOtp = [...otp];

    for (let i = 0; i < pastedDigits.length && startIndex + i < 5; i++) {
      newOtp[startIndex + i] = pastedDigits[i];
    }

    setOtp(newOtp);

    // Focus the next empty box or the last box
    const nextEmptyIndex = newOtp.findIndex(
      (digit, idx) => digit === "" && idx >= startIndex
    );
    if (nextEmptyIndex !== -1) {
      otpRefs[nextEmptyIndex].current.focus();
    } else {
      otpRefs[4].current.focus();
    }
  };

  const handleOTPKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        otpRefs[index - 1].current.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const handleOTPVerify = async () => {
    const otpCode = otp.join("");

    if (!otpCode || otpCode.length !== 5) {
      toast.error("Please enter a valid 5-digit OTP");
      return;
    }

    setIsVerifying(true);
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
          if (onComplete) onComplete(otpCode);
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
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown === 0) {
      try {
        // If onResend prop is provided (for forgot password flow), use it
        if (onResend) {
          await onResend();
        } else {
          // Otherwise, handle the regular OTP resend
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

          if (response.data.success) {
            toast.success("New OTP sent!");
            setOtp(["", "", "", "", ""]);
            setCountdown(30);
            if (otpRefs[0].current) {
              otpRefs[0].current.focus();
            }
          }
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to resend OTP");
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
        disabled={isVerifying}
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
          We've sent a 5-digit code to
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
            ref={otpRefs[index]}
            type="text"
            maxLength="5"
            value={digit}
            onChange={(e) => handleOTPChange(index, e.target.value)}
            onKeyDown={(e) => handleOTPKeyDown(index, e)}
            onPaste={(e) => {
              e.preventDefault();
              const pastedData = e.clipboardData.getData("text");
              handlePaste(index, pastedData);
            }}
            disabled={isVerifying}
            className={`w-14 h-14 text-center text-xl font-bold border-2 rounded-xl transition-all duration-200 bg-gray-50 
              ${isVerifying ? "opacity-60 cursor-not-allowed" : ""}
              ${
                index === 0 && otp.every((d) => d === "")
                  ? "border-blue-500 ring-2 ring-blue-200"
                  : "border-gray-300"
              }
              ${digit ? "border-blue-500" : ""}
              focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200`}
            placeholder="0"
          />
        ))}
      </div>

      {/* Resend OTP */}
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-3">Didn't receive the code?</p>
        <button
          onClick={handleResendOTP}
          disabled={countdown > 0 || isLoading || isVerifying}
          className={`text-sm font-semibold transition-colors ${
            countdown > 0 || isLoading || isVerifying
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
        disabled={!otp.every((digit) => digit !== "") || isVerifying}
        className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center ${
          otp.every((digit) => digit !== "") && !isVerifying
            ? "bg-blue-600 hover:bg-blue-700 text-white"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        {isVerifying ? (
          <>
            <CircularProgress size={20} color="inherit" className="mr-2" />
            Verifying...
          </>
        ) : (
          "Verify & Continue"
        )}
      </button>
    </div>
  );
};

export default OtpVerification;