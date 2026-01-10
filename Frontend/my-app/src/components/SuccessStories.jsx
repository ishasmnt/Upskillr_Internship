import React from 'react';

const SuccessStories = () => {
  const alumni = [
    {
      name: "Rohan Mane",
      achievement: "Placed as Frontend Developer",
      company: "TCS",
      quote: "UpSkillr mule maze React concepts clear zale. Highly recommended!",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan"
    },
    {
      name: "Snehal Gupta",
      achievement: "Software Engineer",
      company: "Accenture",
      quote: "Practical assignments mule mala interview madhe khup help zali.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Snehal"
    }
  ];

  return (
    <div className="bg-gray-50 py-16 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Our Success Stories 🚀</h2>
        <p className="text-gray-600 mb-10">Shika, Apply kara, ani Success मिळवा!</p>
        
        <div className="grid md:grid-cols-2 gap-8">
          {alumni.map((person, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-start text-left">
              <div className="flex items-center mb-4">
                <img src={person.avatar} alt="user" className="w-14 h-14 rounded-full bg-blue-100 mr-4" />
                <div>
                  <h4 className="font-bold text-lg">{person.name}</h4>
                  <p className="text-blue-600 text-sm font-medium">{person.achievement} @ {person.company}</p>
                </div>
              </div>
              <p className="text-gray-600 italic">"{person.quote}"</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuccessStories;