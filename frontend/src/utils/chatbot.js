const normalize = (value = '') =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const hasAny = (question, keywords) => keywords.some((keyword) => question.includes(keyword));

const listText = (items, limit = 3) => {
  const filtered = items.filter(Boolean);
  if (filtered.length === 0) return '';
  if (filtered.length <= limit) return filtered.join(', ');
  return `${filtered.slice(0, limit).join(', ')} and ${filtered.length - limit} more`;
};

const formatCurrency = (value) => {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return 'N/A';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
};

const formatShortDate = (value) => {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const buildKnowledgeBase = (sources) => ({
  home: sources.home || {},
  about: sources.about || {},
  poojas: Array.isArray(sources.poojas) ? sources.poojas : [],
  map: sources.map || {},
  contact: sources.contact || {}
});

const buildSnippets = (knowledge) => {
  const snippets = [];

  if (knowledge.home?.welcomeMessage) {
    snippets.push({ category: 'welcome', text: `${knowledge.home.templeName || 'The temple'} says: ${knowledge.home.welcomeMessage}` });
  }
  if (knowledge.about?.history) {
    snippets.push({ category: 'history', text: `Temple history: ${knowledge.about.history}` });
  }
  if (knowledge.about?.deityImportance) {
    snippets.push({ category: 'deity', text: `Deity information: ${knowledge.about.deityImportance}` });
  }
  if (knowledge.map?.templeAddress) {
    snippets.push({ category: 'location', text: `Temple address: ${knowledge.map.templeAddress}` });
  }
  if (knowledge.contact?.helpInstructions) {
    snippets.push({ category: 'help', text: `Help instructions: ${knowledge.contact.helpInstructions}` });
  }

  knowledge.poojas.forEach((pooja) => {
    snippets.push({
      category: 'pooja',
      text: `${pooja.name}: ${pooja.description || 'Pooja available'} Timing: ${pooja.timing}. Price: ${formatCurrency(pooja.price)}.`
    });
  });

  (knowledge.home?.announcements || [])
    .filter((announcement) => announcement && announcement.isActive !== false && (announcement.title || announcement.message))
    .forEach((announcement) => {
      snippets.push({ category: 'announcement', text: `${announcement.title || 'Temple announcement'}: ${announcement.message || ''}` });
    });

  return snippets;
};

const searchKnowledge = (question, knowledge) => {
  const tokens = normalize(question).split(' ').filter((token) => token.length > 2);
  if (tokens.length === 0) return null;

  const snippets = buildSnippets(knowledge);
  let bestMatch = null;
  let bestScore = 0;

  snippets.forEach((snippet) => {
    const text = normalize(snippet.text);
    let score = 0;
    tokens.forEach((token) => {
      if (text.includes(token)) score += 1;
    });
    if (score > bestScore) {
      bestScore = score;
      bestMatch = snippet;
    }
  });

  if (!bestMatch || bestScore === 0) return null;
  return bestMatch.text;
};

const replyWithGreeting = (knowledge) => {
  const templeName = knowledge.home?.templeName || 'the temple';
  return `Namaste. I can help with ${templeName} information like darshan timings, poojas, token booking, location, contact details, announcements, and festivals.`;
};

const replyWithTimings = (knowledge) => {
  const timings = knowledge.about?.dailyTimings || {};
  const timingBits = [
    timings.morning ? `Morning: ${timings.morning}` : '',
    timings.afternoon ? `Afternoon: ${timings.afternoon}` : '',
    timings.evening ? `Evening: ${timings.evening}` : ''
  ].filter(Boolean);

  if (timingBits.length > 0) return `Here are the darshan timings. ${timingBits.join('. ')}.`;
  if (knowledge.contact?.officeTimings) return `I could not find darshan timings, but the office timings are ${knowledge.contact.officeTimings}.`;
  return 'I could not find temple timings yet. The admin may still need to add them.';
};

const replyWithPoojas = (question, knowledge) => {
  const normalizedQuestion = normalize(question);
  const matchedPooja = knowledge.poojas.find((pooja) =>
    normalize(`${pooja.name} ${pooja.description || ''}`).includes(normalizedQuestion)
  );

  if (matchedPooja) {
    return `${matchedPooja.name} is available at ${matchedPooja.timing} for ${formatCurrency(matchedPooja.price)}.${matchedPooja.description ? ` ${matchedPooja.description}` : ''}`;
  }
  if (knowledge.poojas.length === 0) {
    return 'There are no active poojas listed right now. The admin can add them from the dashboard.';
  }

  const poojaSummary = knowledge.poojas
    .slice(0, 4)
    .map((pooja) => `${pooja.name} (${formatCurrency(pooja.price)})`)
    .join(', ');
  return `Current poojas include ${poojaSummary}. You can open the Poojas page to see timings and book the ones you want.`;
};

const replyWithLocation = (knowledge) => {
  if (knowledge.map?.templeAddress && knowledge.map?.directions) {
    return `The temple address is ${knowledge.map.templeAddress}. Directions: ${knowledge.map.directions}`;
  }
  if (knowledge.map?.templeAddress) {
    return `The temple address is ${knowledge.map.templeAddress}. You can also open the Map page for navigation help.`;
  }
  return 'I could not find the temple address yet. The admin may still need to add the map details.';
};

const replyWithContact = (knowledge) => {
  const lines = [
    knowledge.contact?.templePhone ? `Phone: ${knowledge.contact.templePhone}` : '',
    knowledge.contact?.email ? `Email: ${knowledge.contact.email}` : '',
    knowledge.contact?.officeTimings ? `Office timings: ${knowledge.contact.officeTimings}` : '',
    knowledge.contact?.emergencyContact ? `Emergency contact: ${knowledge.contact.emergencyContact}` : ''
  ].filter(Boolean);
  if (lines.length === 0) return 'I could not find contact details yet. The admin may still need to update them.';
  return `${lines.join('. ')}.`;
};

const replyWithAnnouncements = (knowledge) => {
  const announcements = (knowledge.home?.announcements || []).filter(
    (announcement) => announcement && announcement.isActive !== false && (announcement.title || announcement.message)
  );

  if (announcements.length === 0) return 'There are no active announcements right now.';

  return announcements
    .slice(0, 3)
    .map((announcement) => {
      const date = announcement.date ? ` (${formatShortDate(announcement.date)})` : '';
      return `${announcement.title || 'Temple notice'}${date}: ${announcement.message || ''}`;
    })
    .join(' ');
};

const replyWithFestivals = (knowledge) => {
  const festivals = knowledge.about?.festivals || [];
  if (festivals.length === 0) return 'There are no festivals listed right now.';

  return festivals
    .slice(0, 3)
    .map((festival) => {
      const date = festival.date ? ` on ${formatShortDate(festival.date)}` : '';
      return `${festival.name}${date}${festival.description ? `: ${festival.description}` : ''}`;
    })
    .join(' ');
};

const replyWithBooking = (knowledge) => {
  const templeName = knowledge.home?.templeName || 'the temple';
  return `To book at ${templeName}, open the Poojas page, select one or more poojas, then generate a token. Payment is handled offline at the temple counter.`;
};

const replyWithAbout = (knowledge) => {
  const details = [
    knowledge.about?.history,
    knowledge.about?.deityImportance,
    knowledge.about?.spiritualInfo,
    knowledge.about?.trustInfo
  ].filter(Boolean);
  if (details.length === 0) return 'I could not find detailed temple background information yet.';
  return details[0];
};

export const getChatbotReply = (question, knowledge) => {
  const normalizedQuestion = normalize(question);
  if (!normalizedQuestion) return 'Please type a question and I will try to help with temple information.';

  if (hasAny(normalizedQuestion, ['hello', 'hi', 'hey', 'namaste'])) return replyWithGreeting(knowledge);
  if (hasAny(normalizedQuestion, ['thanks', 'thank you'])) return 'You are welcome. Ask me anything about the temple website.';
  if (hasAny(normalizedQuestion, ['who are you', 'what can you do', 'help'])) return replyWithGreeting(knowledge);
  if (hasAny(normalizedQuestion, ['timing', 'timings', 'darshan', 'open', 'close', 'hours'])) return replyWithTimings(knowledge);
  if (hasAny(normalizedQuestion, ['pooja', 'poojas', 'ritual', 'price', 'cost', 'archana', 'abhishekam'])) return replyWithPoojas(question, knowledge);
  if (hasAny(normalizedQuestion, ['token', 'book', 'booking', 'payment', 'pay', 'qr'])) return replyWithBooking(knowledge);
  if (hasAny(normalizedQuestion, ['location', 'address', 'map', 'direction', 'reach'])) return replyWithLocation(knowledge);
  if (hasAny(normalizedQuestion, ['contact', 'phone', 'email', 'office', 'emergency', 'call'])) return replyWithContact(knowledge);
  if (hasAny(normalizedQuestion, ['announcement', 'notice', 'update', 'news'])) return replyWithAnnouncements(knowledge);
  if (hasAny(normalizedQuestion, ['festival', 'festivals', 'event'])) return replyWithFestivals(knowledge);
  if (hasAny(normalizedQuestion, ['history', 'about', 'deity', 'trust', 'spiritual'])) return replyWithAbout(knowledge);

  const knowledgeMatch = searchKnowledge(question, knowledge);
  if (knowledgeMatch) return knowledgeMatch;

  const availableTopics = listText([
    'darshan timings',
    'poojas',
    'token booking',
    'location',
    'contact details',
    'announcements'
  ]);

  return `I could not find a confident answer for that yet. You can ask me about ${availableTopics}.`;
};
