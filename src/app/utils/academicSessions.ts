// Generate academic sessions automatically based on current year
// This function generates sessions smartly:
// - Shows past sessions for historical data
// - Shows the current active session
// - Only shows the next session when in Third Term AND 3+ months have passed since update
export const generateAcademicSessions = () => {
  const currentYear = new Date().getFullYear();
  const sessions = [];
  
  // Get current session and term from localStorage
  const savedSession = localStorage.getItem("currentSession") || `${currentYear}/${currentYear + 1}`;
  const savedTerm = localStorage.getItem("currentTerm") || "First Term";
  const lastUpdateDate = localStorage.getItem("sessionTermLastUpdate");
  
  // Parse the saved session to get the start year
  const [currentSessionStartYear] = savedSession.split("/").map(Number);
  
  // Generate past sessions (3 years back from current session)
  for (let i = 3; i > 0; i--) {
    const startYear = currentSessionStartYear - i;
    const endYear = startYear + 1;
    sessions.push(`${startYear}/${endYear}`);
  }
  
  // Always add the current session
  sessions.push(savedSession);
  
  // Only add the next session if:
  // 1. We're in Third Term
  // 2. AND 3 months (90 days) have passed since last update
  if (savedTerm === "Third Term" && lastUpdateDate) {
    const lastUpdate = new Date(lastUpdateDate);
    const now = new Date();
    const daysPassed = Math.floor((now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysPassed >= 90) {
      // Add the next session
      const nextStartYear = currentSessionStartYear + 1;
      const nextEndYear = nextStartYear + 1;
      sessions.push(`${nextStartYear}/${nextEndYear}`);
    }
  }
  
  return sessions;
};

export const academicSessions = generateAcademicSessions();
export const terms = ["First Term", "Second Term", "Third Term"];