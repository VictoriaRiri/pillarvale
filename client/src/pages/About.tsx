import React from 'react';
import { ShieldCheck, Zap, Globe, BarChart3 } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: <Zap className="text-stripe-blue" size={24} />,
      title: "Real-time Settlement",
      description: "Move money globally in 15 minutes, not days. We leverage blockchain rails to bypass traditional banking delays."
    },
    {
      icon: <Globe className="text-stripe-blue" size={24} />,
      title: "Borderless Infrastructure",
      description: "Send USD to KES and beyond without the friction of local intermediaries. One platform, global reach."
    },
    {
      icon: <ShieldCheck className="text-stripe-blue" size={24} />,
      title: "Bank-Grade Security",
      description: "Institutional security protocols ensure your funds are protected at every step of the settlement process."
    },
    {
      icon: <BarChart3 className="text-stripe-blue" size={24} />,
      title: "Transparent Pricing",
      description: "Stop losing 5–10% to hidden bank fees. Save up to 80% on every cross-border transaction."
    }
  ];

  return (
    <section className="bg-white py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-stripe-blue mb-4">
              Why PillarVale
            </h2>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tighter text-noir-black mb-8 leading-tight">
              Traditional banking is broken. <br />
              <span className="text-gray-400">We fixed the plumbing.</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-10">
              PillarVale was built for the modern internet economy. We've replaced outdated SWIFT networks with high-speed blockchain settlement to provide liquidity exactly where you need it.
            </p>
            <button className="bg-black text-white px-8 py-4 rounded-full font-bold hover:bg-gray-800 transition shadow-xl">
              Learn more about our rails
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-8 rounded-[2rem] border border-gray-100 bg-[#fbfbfb] hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500">
                <div className="mb-6 p-3 bg-white w-fit rounded-xl shadow-sm border border-gray-50">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-xl mb-3 text-noir-black">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
