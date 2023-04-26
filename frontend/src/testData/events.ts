const titles = `1. Swipe Right Speed Dating: A Night of Love
2. Fast-Track to Romance: Speed Dating with a Twist
3. Speed Dating for Busy Professionals: Get Matched on the Spot
4. Speed Date for a Cause: Connect with like-minded people
5. Chemistry Connection: An Intense Night of Speed Dating 
6. Find Your Match at Our Speed Dating Mixer 
7. Fall in Love at First Sight: Speed Dating Event 
8. Quick Sparks Speed Dating: Get Set, Go 
9. Connect & Mingle: Speed Dating and Social Event 
10. Fast Flirting: Speed Dating with a Playful Twist`.split('\n').map(l => l.replace(/^\d+\.\s/, ''))

const locations = `1. Pixel Playground 
2. Arcade Oasis 
3. Game Room Haven 
4. Virtual Vortex 
5. Digital Den 
6. E-Sports Emporium 
7. LAN Lounge Live 
8. Cyber Cafe Central 
9. Joystick Junction 
10. Gamer's Garden Café `.split('\n').map(l => l.replace(/^\d+\.\s/, ''))

const descriptions = `1. Get ready for a night of fast-paced romance at our speed dating event, where you'll meet a variety of singles in just two hours.
2. Looking for love in all the right places? Join us for a fun-filled evening of speed dating, where you'll have the chance to connect with like-minded individuals in your age range.
3. Put your dating skills to the test at our speed dating event, where you'll have several minutes to make a lasting impression on each potential partner.
4. Ready to find your match? Our speed dating event is the perfect opportunity to meet new people, make connections, and maybe even find that special someone.
5. Explore the possibilities of love at our fast-paced and exciting speed dating event, where you'll have the chance to go on multiple dates in one night.
6. Don't waste any time in your search for love. Join us for our upcoming speed dating event and meet a variety of single professionals in your age range.
7. Take a chance on love and join us for our next speed dating event, where you'll have the chance to meet interesting and attractive people in a relaxed and friendly atmosphere.
8. Looking for something different than your typical bar scene? Come to our speed dating event, where you'll have the chance to meet genuine, eligible singles.
9. Put yourself out there and join us for a fun and exciting evening of speed dating. You never know who you might meet!
10. Our speed dating event is a great way to break the ice and make new connections with other singles in your area. Don't miss out on this opportunity to find love!`.split('\n').map(l => l.replace(/^\d+\.\s/, ''))

const testEvents = titles.map((title, i) => ({
    id: i + 1,
    title,
    description: descriptions[i],
    dateTime: new Date(),
    price: Math.round(Math.random() * 100) * 100,
    location: locations[i],
    participantLimit: Math.round(Math.random() * 30 + 4),
    participantCount: Math.round(Math.random() * 30),
    isDraft: Math.random() > 0.5
}))

export default testEvents;

export const testNewEvents = testEvents.map(event => ({
    ...event,
    isDraft: null,
    isParticipating: false,
    isPast: false,
})).sort(() => Math.random() - 0.5).slice(0, 5)

export const testUpcomingEvents = testEvents.map(event => ({
    ...event,
    isDraft: null,
    isParticipating: true,
    isPast: false,
})).sort(() => Math.random() - 0.5).slice(0, 3)

export const testPastEvents = testEvents.map(event => ({
    ...event,
    isDraft: null,
    isParticipating: true,
    isPast: true,
})).sort(() => Math.random() - 0.5).slice(0, 2)
