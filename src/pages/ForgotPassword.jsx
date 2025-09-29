import React, { useState, useRef, useEffect } from "react";
import {
  MdEmail,
  MdArrowBack,
  MdKey,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { CircularProgress } from "@mui/material";

const OtpVerification = ({
  email,
  verificationMethod = "email",
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
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Invalid OTP. Please try again."
      );
      setOtp(["", "", "", "", ""]);
      otpRefs[0].current.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-6">
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
                  ? "border-orange-500 ring-2 ring-orange-200"
                  : "border-gray-300"
              }
              ${digit ? "border-orange-500" : ""}
              focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200`}
            placeholder="0"
          />
        ))}
      </div>

      {/* Resend OTP */}
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-3">Didn't receive the code?</p>
        <button
          onClick={onResend}
          disabled={countdown > 0 || isLoading || isVerifying}
          className={`text-sm font-semibold transition-colors ${
            countdown > 0 || isLoading || isVerifying
              ? "text-gray-400 cursor-not-allowed"
              : "text-orange-600 hover:text-orange-700"
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
            ? "bg-orange-600 hover:bg-orange-700 text-white"
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

const ForgotPassword = ({ onBack }) => {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [verifiedOtp, setVerifiedOtp] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  // Watch the new password field for validation
  const newPassword = watch("newPassword");

  // Password validation regex
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleOtpComplete = (otp) => {
    setVerifiedOtp(otp);
    setStep("newPassword");
  };

  const handleEmailSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/password/forgot`,
        { email: data.email },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.success) {
        setEmail(data.email);
        setStep("otp");
        setCountdown(30);
        toast.success(response.data.message || "OTP sent to your email!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/password/reset`,
        {
          email,
          otp: verifiedOtp,
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.success) {
        toast.success("Password reset successful!");
        reset();
        onBack();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown === 0) {
      setIsLoading(true);
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/password/forgot`,
          { email },
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );

        if (response.data.success) {
          setCountdown(30);
          toast.success("New OTP sent to your email!");
        }
      } catch (error) {
        toast.error("Failed to resend OTP");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleStepBack = () => {
    if (step === "otp") {
      setStep("email");
      setCountdown(0);
    } else if (step === "newPassword") {
      setStep("otp");
    }
  };

  return (
    <div className="space-y-6">
      <button
        onClick={step === "email" ? onBack : handleStepBack}
        className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        disabled={isLoading}
      >
        <MdArrowBack className="w-5 h-5 mr-2" />
        <span className="text-sm font-medium">
          {step === "email" ? "Back to Login" : "Back"}
        </span>
      </button>

      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
          <MdKey className="w-8 h-8 text-orange-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Reset Your Password
        </h3>
        {step === "email" && (
          <p className="text-sm text-gray-600">
            Enter your email address to receive a verification code.
          </p>
        )}
        {step === "otp" && (
          <p className="text-sm text-gray-600">
            Enter the verification code sent to your email.
          </p>
        )}
        {step === "newPassword" && (
          <p className="text-sm text-gray-600">
            Create a new password for your account.
          </p>
        )}
      </div>

      {step === "email" && (
        <form onSubmit={handleSubmit(handleEmailSubmit)} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <MdEmail className="h-5 w-5 text-gray-600" />
            </div>
            <input
              type="email"
              placeholder="Enter your email"
              disabled={isLoading}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              className={`w-full pl-12 pr-4 py-3 bg-gray-50 border rounded-xl focus:outline-none transition-all duration-200 ${
                errors.email ? "border-red-500" : "border-gray-200"
              } ${isLoading ? "opacity-60 cursor-not-allowed" : ""}`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <CircularProgress size={20} color="inherit" className="mr-2" />
                Sending...
              </>
            ) : (
              "Send Verification Code"
            )}
          </button>
        </form>
      )}

      {step === "otp" && (
        <OtpVerification
          email={email}
          verificationMethod="email"
          onComplete={handleOtpComplete}
          countdown={countdown}
          setCountdown={setCountdown}
          onResend={handleResendOTP}
          isForgotPassword={true}
          onBack={handleStepBack}
          isLoading={isLoading}
        />
      )}

      {step === "newPassword" && (
        <form
          onSubmit={handleSubmit(handlePasswordReset)}
          className="space-y-4"
        >
          {/* New Password Field */}
          <div>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="New Password"
                disabled={isLoading}
                {...register("newPassword", {
                  required: "New password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                  pattern: {
                    value: passwordRegex,
                    message:
                      "Password must include uppercase, lowercase, number & special character",
                  },
                })}
                className={`w-full px-4 py-3 pr-12 bg-gray-50 border rounded-xl focus:outline-none transition-all duration-200 ${
                  errors.newPassword ? "border-red-500" : "border-gray-200"
                } ${isLoading ? "opacity-60 cursor-not-allowed" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
                disabled={isLoading}
              >
                {showNewPassword ? (
                  <MdVisibilityOff className="h-5 w-5 text-gray-600" />
                ) : (
                  <MdVisibility className="h-5 w-5 text-gray-600" />
                )}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.newPassword.message}
              </p>
            )}

            {/* Password Requirements */}
            {newPassword && (
              <div className="mt-2 space-y-1">
                <p className="text-xs font-medium text-gray-700">
                  Password must contain:
                </p>
                <ul className="text-xs space-y-1">
                  <li
                    className={`flex items-center ${
                      newPassword.length >= 8
                        ? "text-green-600"
                        : "text-gray-400"
                    }`}
                  >
                    <span className="mr-2">
                      {newPassword.length >= 8 ? "✓" : "○"}
                    </span>
                    At least 8 characters
                  </li>
                  <li
                    className={`flex items-center ${
                      /[A-Z]/.test(newPassword)
                        ? "text-green-600"
                        : "text-gray-400"
                    }`}
                  >
                    <span className="mr-2">
                      {/[A-Z]/.test(newPassword) ? "✓" : "○"}
                    </span>
                    One uppercase letter
                  </li>
                  <li
                    className={`flex items-center ${
                      /[a-z]/.test(newPassword)
                        ? "text-green-600"
                        : "text-gray-400"
                    }`}
                  >
                    <span className="mr-2">
                      {/[a-z]/.test(newPassword) ? "✓" : "○"}
                    </span>
                    One lowercase letter
                  </li>
                  <li
                    className={`flex items-center ${
                      /\d/.test(newPassword)
                        ? "text-green-600"
                        : "text-gray-400"
                    }`}
                  >
                    <span className="mr-2">
                      {/\d/.test(newPassword) ? "✓" : "○"}
                    </span>
                    One number
                  </li>
                  <li
                    className={`flex items-center ${
                      /[@$!%*?&]/.test(newPassword)
                        ? "text-green-600"
                        : "text-gray-400"
                    }`}
                  >
                    <span className="mr-2">
                      {/[@$!%*?&]/.test(newPassword) ? "✓" : "○"}
                    </span>
                    One special character (@$!%*?&)
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm New Password"
              disabled={isLoading}
              {...register("confirmPassword", {
                required: "Please confirm password",
                validate: (value) =>
                  value === newPassword || "Passwords don't match",
              })}
              className={`w-full px-4 py-3 pr-12 bg-gray-50 border rounded-xl focus:outline-none transition-all duration-200 ${
                errors.confirmPassword ? "border-red-500" : "border-gray-200"
              } ${isLoading ? "opacity-60 cursor-not-allowed" : ""}`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center"
              disabled={isLoading}
            >
              {showConfirmPassword ? (
                <MdVisibilityOff className="h-5 w-5 text-gray-600" />
              ) : (
                <MdVisibility className="h-5 w-5 text-gray-600" />
              )}
            </button>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <CircularProgress size={20} color="inherit" className="mr-2" />
                Resetting Password...
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
