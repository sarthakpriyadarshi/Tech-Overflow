import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Link from "next/link";

export default function Index() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Radial Gradients */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-6xl font-['Special_Gothic_Expanded_One'] mb-6 bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
              Tech Overflow
            </h1>
            <p className="text-xl font-montserrat text-gray-300 mb-8">
              Where developers help developers. Get answers to your technical
              questions from a thriving community of experts.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
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
            <div className="flex gap-4 justify-center mt-8">
              <Link href="/questions/ask">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 rounded-lg font-montserrat text-lg transition-all transform hover:scale-105">
                  Ask a Question
                </Button>
              </Link>
              <Link href="/questions">
                <Button
                  variant="outline"
                  className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 px-8 py-6 rounded-lg font-montserrat text-lg transition-all transform hover:scale-105"
                >
                  Browse Questions
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mt-20">
            {[
              { number: "1M+", label: "Questions" },
              { number: "5M+", label: "Answers" },
              { number: "10M+", label: "Developers" },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center p-6 bg-white/5 rounded-lg backdrop-blur-sm border border-emerald-500/20 hover:border-emerald-500/40 transition-all"
              >
                <div className="text-3xl font-bold text-emerald-400 mb-2">
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
    </div>
  );
}
