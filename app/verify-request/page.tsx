import Link from "next/link";
import { Mail } from "lucide-react";

export default function VerifyRequestPage() {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#111] border border-cyan-500/30 p-8 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.15)] text-center relative overflow-hidden group">
        
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-cyan-500 shadow-[0_0_15px_#06b6d4]"></div>
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl opacity-0 group-hover:opacity-20 transition duration-1000"></div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/50 rounded-full flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Mail className="w-8 h-8 text-cyan-400" />
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-2 tracking-wide">
            Check Your Email
          </h1>
          
          <p className="text-gray-400 mb-8 leading-relaxed text-sm">
            We've sent a verification link to your email address. 
            Please check your inbox (and spam folder) to activate your account.
          </p>
          
          <Link 
            href="/login" 
            className="w-full inline-flex justify-center items-center px-4 py-3 border border-cyan-500/50 rounded-lg text-sm font-medium text-cyan-400 hover:bg-cyan-500/10 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all duration-300"
          >
            Return to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
