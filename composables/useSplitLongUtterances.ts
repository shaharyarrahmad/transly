export function useSplitLongUtterances() {
  const splitLongUtterances = (utterances: Utterance[]): Utterance[] => {
    const modifiedUtterances: Utterance[] = [];

    utterances.forEach(utterance => {
      if (utterance.words.length > 100) {
        const splitUtterances: Utterance[] = [];
        let currentUtterance: Word[] = [];
        let currentText = '';

        utterance.words.forEach((word, index) => {
          currentUtterance.push(word);
          currentText += word.text + ' ';
          if (
            (currentUtterance.length > 100 && word.text[word.text.length - 1] == '.') ||
            index === utterance.words.length - 1
          ) {
            splitUtterances.push({
              ...utterance,
              words: currentUtterance,
              text: currentText.trim(),
              start: currentUtterance[0].start,
              end: currentUtterance[currentUtterance.length - 1].end,
            });
            currentUtterance = [];
            currentText = '';
          }
        });

        modifiedUtterances.push(...splitUtterances);
      } else {
        modifiedUtterances.push(utterance);
      }
    });

    return modifiedUtterances;
  };

  return { splitLongUtterances };
}
