import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Link from "next/link";
import Footer from "./components/Footer";

export default function Index() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Radial Gradients */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-['Special_Gothic_Expanded_One'] mb-4 md:mb-6 bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
              Tech Overflow
            </h1>
            <p className="text-lg md:text-xl font-montserrat text-gray-300 mb-6 md:mb-8 px-2">
              Where developers help developers. Get answers to your technical
              questions from a thriving community of experts.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto px-2 sm:px-0">
              <div className="relative">
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search questions..."
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-emerald-500/20 rounded-lg focus:ring-2 focus:ring-emerald-500/40 focus:border-transparent transition-all font-montserrat"
                />
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6 md:mt-8 px-4 sm:px-0">
              <Link href="/questions/ask" className="w-full sm:w-auto">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-6 sm:px-8 py-5 sm:py-6 rounded-lg font-montserrat text-base sm:text-lg transition-all transform hover:scale-105">
                  Ask a Question
                </Button>
              </Link>
              <Link href="/questions" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 px-6 sm:px-8 py-5 sm:py-6 rounded-lg font-montserrat text-base sm:text-lg transition-all transform hover:scale-105"
                >
                  Browse Questions
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 max-w-3xl mx-auto mt-12 md:mt-20 px-4 sm:px-0">
            {[
              { number: "1M+", label: "Questions" },
              { number: "5M+", label: "Answers" },
              { number: "10M+", label: "Developers" },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center p-4 sm:p-6 bg-white/5 rounded-lg backdrop-blur-sm border border-emerald-500/20 hover:border-emerald-500/40 transition-all"
              >
                <div className="text-2xl sm:text-3xl font-bold text-emerald-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400 font-montserrat">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
