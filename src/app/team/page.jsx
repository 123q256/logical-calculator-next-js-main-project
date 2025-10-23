import React from "react";

const teamMembers = [
  {
    name: "Rana Bilal Munawar",
    role: "Team Leader",
    description:
      "Experienced Full Stack Developer and Team Leader specializing in React.js, Next.js, Node.js, and MongoDB. Skilled in building scalable web applications, developing efficient APIs, and leading development teams to deliver high-quality solutions.",
    image: "teams/bilal.jpg", // you can replace with your own image URL
    color: "blue",
    socials: {
      linkedin: "https://www.linkedin.com/in/rana-bilal-munawar-b825b0260/",
    },
  },
  {
    name: "Muhammad Faizan",
    role: "Full Stack Developer",
    description:
      "Experienced Full Stack Developer specializing in React.js, Vue.js,  Nuxt.js ,Laravel, and RESTful API development. Passionate about building scalable web applications and creating seamless user experiences.",

    image: "teams/faizan.jpeg",
    color: "purple",
    socials: {
      linkedin:
        "https://www.linkedin.com/in/faizan-asif/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
    },
  },
  {
    name: "Zarbakhat Muneer",
    role: "UX Designer",
    description:
      "Product Designer | UI/UX Designer (Mobile and Web) | UX Researcher | Micro UI Animation Specialist | Design Systems, Design Thinking, Prototyping | Figma, Framer, Adobe Creative Suite",
    image: "teams/Zarbakhat.jpeg",
    color: "green",
    socials: {
      linkedin: "https://www.linkedin.com/in/zarbakhat-muneer-graphic-working/",
    },
  },
];

const colorGradients = {
  blue: "from-blue-400 to-blue-600",
  green: "from-green-400 to-green-600",
  purple: "from-purple-400 to-purple-600",
  red: "from-red-400 to-red-600",
  yellow: "from-yellow-400 to-yellow-500",
};

const Team = () => {
  return (
    <div>
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Meet Our Team</h1>
          <p className="text-xl max-w-2xl mx-auto">
            The talented professionals who make our success possible
          </p>
        </div>
      </header>

      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto flex flex-col space-y-8 items-center">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className={`flex flex-col md:flex-row items-center p-6 max-w-5xl w-full rounded-xl shadow-lg transform transition-transform hover:scale-105 bg-gradient-to-r ${
                colorGradients[member.color]
              }`}
            >
              <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                <img
                  src={member.image}
                  alt={member.name}
                  className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
              </div>
              <div className="text-center md:text-left text-white">
                <h3 className="text-2xl font-bold">{member.name}</h3>
                <p className="mb-2 text-white/90">{member.role}</p>
                <p className="mb-4 text-white/80">{member.description}</p>
                <div className="flex justify-center md:justify-start space-x-4">
                  {member.socials.linkedin && (
                    <a
                      href={member.socials.linkedin}
                      className="text-white hover:text-gray-200"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                        className="w-5 h-5"
                        fill="currentColor"
                      >
                        <path d="M100.28 448H7.4V148.9h92.88zm-46.44-340C24.12 108 0 83.87 0 54.19S24.12 0 53.84 0s53.84 24.12 53.84 54.19-24.12 53.81-53.84 53.81zM447.9 448h-92.68V302.4c0-34.7-.7-79.3-48.3-79.3-48.3 0-55.7 37.7-55.7 76.7V448h-92.7V148.9h89V184h1.3c12.4-23.4 42.6-48.3 87.6-48.3 93.7 0 111 61.7 111 141.9V448z" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Team;
