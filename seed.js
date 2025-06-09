// scripts/seedProfiles.js
import DatingProfile from '../models/DatingProfile.js';
import sequelize from '../config/db.js';

const sampleData = {
  locations: ["Jersey city", "New york", "Newark", "Stamford"],
  languages: ["English", "French", "Spanish", "Mandarin"],
  likes: ["Hiking", "Reading", "Art", "Music", "Traveling"],
  lookingFor: ["Serious Relationship", "Casual Dating", "Any"],
  drinkFreq: ["Never", "Occasionally", "Socially", "Often"],
  smokeFreq: ["Never", "Occasionally", "Regularly"],
  workoutOptions: ["Daily", "Few times a week", "Rarely", "Never"],
  professions: ["Engineer", "Designer", "Doctor", "Teacher", "Artist"],
  imageURLs: [
    "https://imgs.search.brave.com/giIjeApwiN9rPLs0x4e5W7V961Gv5DCiSd9KE-irRKE/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1waG90by9w/b3J0cmFpdC1oYXBw/eS1zbWlsaW5nLXdv/bWFuLXN0YW5kaW5n/LXNxdWFyZS1zdW5u/eS1zdW1tZXItc3By/aW5nLWRheS1vdXRz/aWRlLWN1dGUtc21p/bGluZy13b21hbi1s/b29raW5nLXlvdS1h/dHRyYWN0aXZlLXlv/dW5nLWdpcmwtZW5q/b3lpbmctc3VtbWVy/LWZpbHRlcmVkLWlt/YWdlLWZsYXJlLXN1/bnNoaW5lXzIzMTIw/OC02NzM0LmpwZz9z/ZW10PWFpc19oeWJy/aWQmdz03NDA",
    "https://images.pexels.com/photos/1642228/pexels-photo-1642228.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.unsplash.com/photo-1506765515384-028b60a970df?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmFubmVyfGVufDB8fDB8fHww",
    "https://plus.unsplash.com/premium_photo-1667912925305-629794bdb691?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmFubmVyfGVufDB8fDB8fHww"
  ]
};

const randomPick = (arr, count = 1) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const seedProfiles = async () => {
  try {
    await sequelize.sync();

    const sampleProfiles = Array.from({ length: 10 }).map((_, i) => {
      const gender =  ['Female'];
      const interestedIn = ['Male'];

      return {
        user_id: `user${i + 1}`,
        firstName: `User${i + 1}`,
        gender,
        interestedIn,
        lookingFor: randomPick(sampleData.lookingFor, 1),
        age: 22 + i,
        height: `${5 + Math.floor(Math.random() * 2)}.${Math.floor(Math.random() * 10)}`,
        drinkFreq: randomPick(sampleData.drinkFreq, 1),
        smokeFreq: randomPick(sampleData.smokeFreq, 1),
        workoutOptions: randomPick(sampleData.workoutOptions, 1),
        locations: randomPick(sampleData.locations, 1),
        professions: randomPick(sampleData.professions, 1),
        languages: randomPick(sampleData.languages, Math.floor(Math.random() * 2) + 1),
        describeSelf: `I'm User${i + 1} and I love life!`,
        idealDate: `A cozy dinner with great conversation.`,
        greatPartner: `Someone kind, honest, and fun to be around.`,
        likes: randomPick(sampleData.likes, Math.floor(Math.random() * 3) + 1),
        profile_img_url: [sampleData.imageURLs[0]],
        banner_img_url: [sampleData.imageURLs[2]],
        phone: `123-456-789${i}`,
        website: `https://user${i + 1}.dating.com`
      };
    });

    await DatingProfile.bulkCreate(sampleProfiles);
    console.log('✅ 10 full sample dating profiles inserted.');
    process.exit();
  } catch (error) {
    console.error('❌ Error seeding profiles:', error);
    process.exit(1);
  }
};

seedProfiles();
