require('dotenv').config();
const mongoose = require('mongoose');
const Gym      = require('./models/Gym');

const gyms = [
  // ===== BHOPAL =====
  { name:'FitZone Gym',      city:'bhopal',   location:'MP Nagar, Bhopal',         fees:1500, rating:4.5, facilities:['Cardio','Weights','Trainer','Locker Room'], timings:'6AM–10PM', icon:'🏋️', badge:'Top Rated',  description:'Most popular gym in MP Nagar with certified trainers and modern equipment.', reviews:[{userName:'Rahul K.',rating:5,text:'Best gym in Bhopal!'},{userName:'Priya S.',rating:4,text:'Great trainers, very helpful.'}] },
  { name:'Iron Paradise',    city:'bhopal',   location:'Arera Colony, Bhopal',      fees:2000, rating:4.8, facilities:['CrossFit','Yoga','Sauna','Pool'],            timings:'5AM–11PM', icon:'💪', badge:'Premium',    description:'Premium fitness facility with CrossFit, yoga and luxury amenities.', reviews:[{userName:'Amit T.',rating:5,text:'World class experience!'},{userName:'Neha M.',rating:5,text:'Best CrossFit in Bhopal!'}] },
  { name:'PowerHouse Gym',   city:'bhopal',   location:'Kolar Road, Bhopal',        fees:1200, rating:4.2, facilities:['Cardio','Boxing','Weights'],                  timings:'6AM–9PM',  icon:'🔥', badge:null,         description:'Affordable gym with boxing and intense cardio training.', reviews:[{userName:'Vikram R.',rating:4,text:'Great value for money!'}] },
  { name:"Gold's Fitness",   city:'bhopal',   location:'Shahpura, Bhopal',          fees:1800, rating:4.6, facilities:['Weights','Trainer','Pool','Zumba'],           timings:'5AM–10PM', icon:'⚡', badge:'Popular',    description:'Premium gym with pool and expert personal trainers.', reviews:[{userName:'Manish G.',rating:5,text:'Amazing gym and pool!'}] },
  { name:'Anytime Fitness',  city:'bhopal',   location:'Hoshangabad Road, Bhopal',  fees:2500, rating:4.7, facilities:['24/7','Cardio','Weights','AC'],               timings:'Open 24/7',icon:'🕐', badge:'24/7 Open',  description:'Only 24/7 gym in Bhopal. Access anytime with key fob.', reviews:[{userName:'Rohit S.',rating:5,text:'Love the 24/7 access!'}] },
  { name:'StrongLife Gym',   city:'bhopal',   location:'Piplani, Bhopal',           fees:900,  rating:4.0, facilities:['Beginner Friendly','Cardio','Weights'],       timings:'6AM–9PM',  icon:'🌟', badge:null,         description:'Best gym for beginners. Friendly staff and affordable prices.', reviews:[{userName:'Kavita J.',rating:4,text:'Very welcoming for beginners!'}] },

  // ===== INDORE =====
  { name:"Gold's Gym Indore",    city:'indore', location:'Vijay Nagar, Indore',     fees:1800, rating:4.6, facilities:['Weights','Cardio','Trainer','Steam Room'],   timings:'6AM–10PM', icon:'🏆', badge:'Top Rated',  description:'Flagship gym in Vijay Nagar with international standard equipment.', reviews:[{userName:'Arjun P.',rating:5,text:'Best gym in Indore!'},{userName:'Simran K.',rating:4,text:'Great equipment and trainers.'}] },
  { name:'PowerFit Studio',      city:'indore', location:'Palasia, Indore',         fees:1200, rating:4.3, facilities:['HIIT','Zumba','Cardio','Weights'],            timings:'6AM–9PM',  icon:'🔥', badge:null,         description:'Modern fitness studio with HIIT and dance fitness classes.', reviews:[{userName:'Pooja M.',rating:4,text:'Zumba classes are amazing!'}] },
  { name:'Muscle Factory',       city:'indore', location:'Rajwada, Indore',         fees:1000, rating:4.1, facilities:['Weights','Bodybuilding','Trainer'],            timings:'5AM–9PM',  icon:'💪', badge:null,         description:'Hardcore bodybuilding gym with experienced coaches.', reviews:[{userName:'Deepak S.',rating:4,text:'Perfect for serious bodybuilders.'}] },
  { name:'FitHub Indore',        city:'indore', location:'AB Road, Indore',         fees:2200, rating:4.7, facilities:['CrossFit','Yoga','Pool','Trainer'],            timings:'5AM–11PM', icon:'⚡', badge:'Premium',    description:'Premium multi-sport facility with pool and CrossFit boxes.', reviews:[{userName:'Riya T.',rating:5,text:'Worth every rupee!'}] },

  // ===== JABALPUR =====
  { name:'FitLife Gym',          city:'jabalpur', location:'Napier Town, Jabalpur', fees:1000, rating:4.2, facilities:['Weights','Cardio','Trainer'],                  timings:'6AM–9PM',  icon:'🏋️', badge:'Popular',  description:'Best gym in Napier Town with experienced trainers.', reviews:[{userName:'Anand K.',rating:4,text:'Good gym, helpful staff.'}] },
  { name:'Champion Gym',         city:'jabalpur', location:'Civil Lines, Jabalpur', fees:800,  rating:4.0, facilities:['Weights','Cardio','Beginner Friendly'],        timings:'6AM–8PM',  icon:'🌟', badge:null,        description:'Affordable gym ideal for beginners in Civil Lines area.', reviews:[{userName:'Meera S.',rating:4,text:'Very affordable and clean.'}] },
  { name:'PowerZone Jabalpur',   city:'jabalpur', location:'Adhartal, Jabalpur',    fees:1200, rating:4.3, facilities:['CrossFit','Weights','Cardio','Trainer'],       timings:'5AM–10PM', icon:'💪', badge:'Top Rated', description:'Modern CrossFit and strength training facility.', reviews:[{userName:'Rohit D.',rating:5,text:'CrossFit coaches are excellent!'}] },

  // ===== GWALIOR =====
  { name:'Flex Gym Gwalior',     city:'gwalior', location:'Lashkar, Gwalior',       fees:900,  rating:4.1, facilities:['Weights','Cardio','Trainer'],                  timings:'6AM–9PM',  icon:'🏋️', badge:null,       description:'Well-equipped gym in the heart of Lashkar area.', reviews:[{userName:'Ajay V.',rating:4,text:'Good gym at great price.'}] },
  { name:'IronBody Fitness',     city:'gwalior', location:'Morar, Gwalior',          fees:1100, rating:4.3, facilities:['Weights','Boxing','Cardio','Trainer'],          timings:'5AM–9PM',  icon:'🔥', badge:'Popular',  description:'Intense training gym with boxing and strength focus.', reviews:[{userName:'Suresh R.',rating:4,text:'Boxing trainer is very professional.'}] },
  { name:'FitCentre Gwalior',    city:'gwalior', location:'Phool Bagh, Gwalior',     fees:1500, rating:4.4, facilities:['Cardio','Yoga','Zumba','Weights'],              timings:'6AM–10PM', icon:'⚡', badge:'Top Rated', description:'Complete fitness centre with yoga and group fitness classes.', reviews:[{userName:'Priya N.',rating:5,text:'Yoga classes are the best!'}] },

  // ===== UJJAIN =====
  { name:'Mahakal Fitness',      city:'ujjain',  location:'Freeganj, Ujjain',        fees:700,  rating:4.0, facilities:['Weights','Cardio','Trainer'],                  timings:'6AM–9PM',  icon:'🌟', badge:null,       description:'Budget-friendly gym near Mahakaleshwar temple area.', reviews:[{userName:'Karan M.',rating:4,text:'Best budget gym in Ujjain!'}] },
  { name:'PowerPulse Ujjain',    city:'ujjain',  location:'Dewas Road, Ujjain',      fees:1000, rating:4.2, facilities:['Weights','Cardio','CrossFit','Trainer'],       timings:'5AM–9PM',  icon:'💪', badge:'Popular',  description:'Modern gym with CrossFit and strength training programs.', reviews:[{userName:'Sneha T.',rating:4,text:'Good equipment and trainers.'}] },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    await Gym.deleteMany({});
    console.log('🗑️  Cleared old gym data');

    await Gym.insertMany(gyms);
    console.log(`✅ Added ${gyms.length} gyms across 5 cities!`);
    console.log('\nCities seeded:');
    console.log('  📍 Bhopal    — 6 gyms');
    console.log('  📍 Indore    — 4 gyms');
    console.log('  📍 Jabalpur  — 3 gyms');
    console.log('  📍 Gwalior   — 3 gyms');
    console.log('  📍 Ujjain    — 2 gyms');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  }
}

seed();
