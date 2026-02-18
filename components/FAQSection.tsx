"use client";
import Image from "next/image";
import { useState } from "react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

  const faqItems = [
    {
      id: 1,
      question: "What investment services do you offer?",
      answer:
        "We provide a demo platform for portfolio simulation and investment education. Our approach relies on thorough analysis of market trends, economic indicators, and simulated company performance. This is for educational purposes only.",
    },
    {
      id: 2,
      question: "What types of investments do you recommend?",
      answer:
        "We recommend a diversified portfolio tailored to your individual needs. This may include simulated exposure to various asset classes. Remember: This is a demonstration platform only—no real investments are made.",
    },
    {
      id: 3,
      question: "How do I get started with the demo platform?",
      answer:
        "Create an account using the sign up link found on the website. You'll receive a simulated $25,000 demo balance to practice with. You can then explore our demo trading bots and portfolio simulation tools.",
    },
    {
      id: 4,
      question: "What is your approach to risk management?",
      answer:
        "We emphasize risk education through simulation. Our demo platform allows you to practice risk management strategies in a safe environment before considering real investments. We recommend a diversified portfolio tailored to your individual risk tolerance.",
    },
    {
      id: 5,
      question: "Is this platform free to use?",
      answer:
        "Yes, FluxHold is completely free for demo purposes. We provide educational resources and simulated trading experience at no cost. No payment information is required.",
    },
    {
      id: 6,
      question: "Can I lose real money on this platform?",
      answer:
        "No. FluxHold is a demonstration platform only. All funds are simulated, and no real money is involved. This is purely for educational and practice purposes.",
    },
  ];

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="pt-20 bg-gradient-to-b from-[#060B14] to-[#0B1C2D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12">
          {/* Left Column - FAQ Content */}
          <div className="lg:w-1/2 lg:order-last">
            <div className="heading_block mb-8">
              <div className="inline-flex items-center space-x-2 bg-[#0B1C2D] border border-gray-800 rounded-full px-4 py-2 mb-6">
                <QuestionMarkCircleIcon className="w-4 h-4 text-[#0EF2C2]" />
                <span className="text-sm text-[#0EF2C2]">FAQ Section</span>
              </div>
              <h2 className="heading_text text-3xl lg:text-4xl font-bold mb-6">
                Have a question? Look here
              </h2>
              <p className="heading_description text-l text-[#9BA3AF] mb-0">
                For quick answers, visit our FAQ section. Can&apos;t find what
                you need? Contact our support team for demo platform assistance.
              </p>
            </div>

            {/* FAQ Accordion */}
            <div className="accordion space-y-4" id="faq_accordion">
              {faqItems.map((item, index) => (
                <div
                  key={item.id}
                  className="accordion-item bg-[#0B1C2D] border border-gray-800 rounded-xl overflow-hidden transition-all duration-300 hover:border-gray-700"
                >
                  <div className="accordion-header">
                    <button
                      className="accordion-button flex items-center justify-between w-full p-6 text-left hover:bg-gray-900/30 transition-colors"
                      onClick={() => toggleAccordion(index)}
                      aria-expanded={openIndex === index}
                      aria-controls={`collapse_${item.id}`}
                    >
                      <span className="text-lg font-semibold text-white pr-8">
                        {item.question}
                      </span>
                      <span className="flex-shrink-0">
                        {openIndex === index ? (
                          <ChevronUpIcon className="w-5 h-5 text-[#0EF2C2]" />
                        ) : (
                          <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                        )}
                      </span>
                    </button>
                  </div>

                  <div
                    id={`collapse_${item.id}`}
                    className={`accordion-collapse transition-all duration-300 ${
                      openIndex === index
                        ? "max-h-96 opacity-100"
                        : "max-h-0 opacity-0"
                    } overflow-hidden`}
                    aria-labelledby={`heading_${item.id}`}
                  >
                    <div className="accordion-body p-6 pt-0">
                      <p className="text-[#9BA3AF] m-0">{item.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Support CTA */}
            {/* <div className="mt-10 p-6 bg-gradient-to-r from-[#4C6FFF]/10 to-[#0EF2C2]/5 border border-gray-800 rounded-xl">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4C6FFF] to-[#0EF2C2] flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">
                    Still have questions?
                  </h4>
                  <p className="text-[#9BA3AF] mb-4">
                    Can&apos;t find the answer you&apos;re looking for? Our demo
                    support team is here to help.
                  </p>
                  <a
                    href="mailto:support@fluxhold.com"
                    className="inline-flex items-center space-x-2 text-[#0EF2C2] hover:text-white transition-colors font-medium"
                  >
                    <span>Contact Support</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div> */}
          </div>

          {/* Right Column - Visual Elements */}
          <div className="lg:w-1/2 relative">
            {/* Main Image Container - REPLACEMENT */}
            <div className="relative h-full min-h-full overflow-hidden">
              <Image
                src="/assets/images/clients/faq_about_image.webp"
                alt="Investment Dashboard Visual"
                width={800}
                height={400}
                className="w-full h-auto"
                priority
              />
              {/* <Image
                  src="/assets/images/clients/hero_image.png"
                  alt="FluxHold Investment Dashboard Preview"
                  width={800}
                  height={400}
                  className="w-full h-auto"
                  priority
                /> */}

              {/* Optional: Add overlay gradient for better text contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#060B14]/80 via-transparent to-transparent"></div>

              {/* Optional: Add some text/icon on top of image */}
              <div className="absolute bottom-8 left-8 right-8">
                <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4C6FFF] to-[#0EF2C2] flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white">
                      Demo Platform
                    </h3>
                  </div>
                  <p className="text-sm text-gray-300">
                    Interactive investment simulation for educational purposes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
