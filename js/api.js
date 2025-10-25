// js/api.js
export async function fetchQuestions(category, difficulty, amount = 10) {
  try {
    // Use Open Trivia DB API
    const url = `https://opentdb.com/api.php?amount=${amount}&category=${getCategoryID(category)}&difficulty=${difficulty}&type=multiple`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.response_code !== 0) {
      throw new Error('No questions found, using local data');
    }

    return data.results;
  } catch (error) {
    console.warn(error);
    // Fallback to local JSON file
    const localData = await fetch('data/questions.json');
    const questions = await localData.json();
    return questions;
  }
}

// Helper: convert category string to Open Trivia DB category ID
function getCategoryID(category) {
  switch (category) {
    case 'general': return 9;
    case 'science': return 17;
    case 'history': return 23;
    case 'sports': return 21;
    default: return 9;
  }
}
