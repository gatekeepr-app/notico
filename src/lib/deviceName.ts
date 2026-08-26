const adjectives = ["Wobbly", "Squishy", "Bouncy", "Gooey", "Jiggly", "Snoozy", "Zippy", "Mushy"];
const blobs = ["Blobfish", "Pudding", "Dumpling", "Goblin", "Noodle", "Pickle", "Muffin", "Turnip"];

export function getDeviceName() {
  const key = "notico-device-name";
  const existing = localStorage.getItem(key);
  if (existing) return existing;
  const name = `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${blobs[Math.floor(Math.random() * blobs.length)]}`;
  localStorage.setItem(key, name);
  return name;
}
