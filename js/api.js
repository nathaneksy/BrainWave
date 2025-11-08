// js/api.js
export async function fetchQuestions(category, difficulty, amount = 10) {
  try {
    // Category is numeric now, no conversion needed
    const url = `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=multiple`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      throw new Error('No questions found, using local data');
    }

    return data.results;
  } catch (error) {
    console.warn(error);
    // Fallback to local JSON file
    const localData = await fetch('questions.json');
    const questions = await localData.json();
    return questions;
  }
}
