import PillNavbar from '../components/PillNavbar';
import CurrencyCalculator from '../components/CurrencyCalculator';
import About from '../components/About';
import Loader from '../components/Loader';

export default function Home() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <Loader onFinished={() => setLoading(false)} />}export default function Home() {
  return (
    <div className="bg-white min-h-screen font-sans selection:bg-black selection:text-white">
      <PillNavbar />
      
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <h1 className="text-7xl font-bold tracking-tight text-noir-black mb-6">
            Global money <br />
            <span className="text-gray-400">at the speed of light.</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-md mb-8 leading-relaxed">
            Stop losing 5–10% on cross-border payments. PillarVale uses blockchain settlement rails to help businesses move money globally in 15 minutes.
          </p>
          <div className="flex gap-4">
            <button className="bg-black text-white px-8 py-4 rounded-full font-bold">Get Started</button>
            <button className="text-black px-8 py-4 rounded-full font-bold border border-gray-200">Contact Sales</button>
          </div>
        </div>

        <div className="relative">
           <CurrencyCalculator />
           {/* Subtle 3D background element */}
           <div className="absolute -z-10 top-10 -right-10 w-full h-full bg-stripe-blue/5 rounded-3xl blur-3xl"></div>
        </div>
      </main>
      <About />

      {/* Typewriter Banner at Bottom */}
      <div className="w-full bg-black py-10 overflow-hidden">
        <div className="whitespace-nowrap flex animate-[marquee_20s_linear_infinite]">
          {[1,2,3,4,5].map((i) => (
            <span key={i} className="text-[12vw] font-black text-white/10 mx-10 uppercase">
              PillarVale • Global Settlement • Blockchain Rails •
            </span>
          ))}
        </div>
      </div>
    </div>
  );
  export default LandingPage.tsx;
}
