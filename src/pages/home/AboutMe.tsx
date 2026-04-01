import { HeroHighlight, Highlight } from "@/components/ui/aceternity/hero-highlight";
import { settings } from "@/config/settings";
import { FiMapPin, FiAward, FiClock } from "react-icons/fi";
import { RealTimeAge } from "../../components/ui/common/real-time-age";

export default function AboutMe() {
  const birthDate = new Date("2005-10-20T00:00:00");

  // Quick stats for visual appeal
  const quickStats = [
    {
      icon: <FiMapPin size={16} />,
      label: "Location",
      value: "Delhi, India",
    },
    {
      icon: <FiAward size={16} />,
      label: "Education",
      value: "B.Tech Computer Science"
    },
  ];

  const ageData = {
    icon: <FiClock size={16} />,
    label: "Age",
    value: <RealTimeAge birthDate={birthDate} />,
  };

  return (
    <>
      <div className="pt-8 mb-0" id="about">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">ABOUT ME</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Get to know me better - my journey, achievements, and passion for
            technology
          </p>

          {/* Quick Stats */}
          {settings.about.showStats && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {quickStats.map((stat, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-700 hover:border-emerald-200 dark:hover:border-emerald-700"
                  >
                    <div className="text-emerald-600 dark:text-emerald-400">
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {stat.label}
                      </p>
                      <p className="font-semibold accent-text">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Age Stat - Full Width (hidden on screens < 640px) */}
              <div className="hidden sm:flex items-center gap-3 p-4 bg-gray-50 dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-700 hover:border-emerald-200 dark:hover:border-emerald-700 mb-4 min-h-[76px]">
                <div className="text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                  {ageData.icon}
                </div>
                <div className="flex-1 min-w-0 overflow-hidden">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {ageData.label}
                  </p>
                  <div className="font-semibold accent-text overflow-x-auto">
                    {ageData.value}
                  </div>
                </div>
              </div>
            </>
          )}

          <HeroHighlight className="max-w-3xl mx-auto p-6 text-justify accent-text leading-loose break-words">
            <p className="mb-4">
              My journey began with a deep curiosity for how intelligent systems are built. Currently in my <Highlight>6th semester</Highlight> pursuing a <Highlight>B.Tech in Computer Science</Highlight>, I have maintained an <Highlight>8.03 CGPA</Highlight>. I enjoy solving complex problems, optimizing algorithms, and building data-driven systems from the ground up. My academic background gave me a strong foundation in core concepts like <Highlight>Data Structures</Highlight> and <Highlight>DBMS</Highlight>, which I've sharpened by solving over <Highlight>500+ problems</Highlight> across <a href="https://leetcode.com/u/vardaansharma100/" target="_blank" rel="noopener noreferrer" className="cursor-pointer"><Highlight>LeetCode</Highlight></a> and <a href="https://www.geeksforgeeks.org/profile/vardaan100/" target="_blank" rel="noopener noreferrer" className="cursor-pointer"><Highlight>GeeksforGeeks</Highlight></a>. I actively apply these skills to my <Highlight>Machine Learning</Highlight> and <Highlight>Deep Learning</Highlight> research and collaborative projects.
            </p>
          </HeroHighlight>
        </div>
      </div>
    </>
  );
}
