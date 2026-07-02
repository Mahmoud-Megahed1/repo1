const fs = require('fs');

const files = [
  'AuditoryProcessing.tsx',
  'ReadingSprint.tsx',
  'SpellingStructure.tsx',
  'VisualRecognition.tsx',
  'VocalChallenge.tsx'
];

for (const file of files) {
  const path = 'd:/new project/project3/englishom-placement-test-final/englishom-placement-test/client/src/pages/test/' + file;
  let content = fs.readFileSync(path, 'utf8');

  // Replace simple 'No questions available' with a Continue button
  content = content.replace(
    /return <div className="text-center text-red-500">No questions available<\/div>;/g,
    `return (
      <div className="text-center py-12 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
        <p className="text-slate-500 dark:text-slate-400 mb-6">No questions available for this stage.</p>
        <button 
          onClick={() => {
            if (stageIndex < 4) {
              nextStage();
            } else {
              window.dispatchEvent(new Event('testComplete'));
              if (typeof completeTest === 'function') completeTest();
            }
          }}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium"
        >
          Continue to Next Stage
        </button>
      </div>
    );`
  );

  // In VocalChallenge, also fix completeTest calls inside handleNext
  if (file === 'VocalChallenge.tsx') {
    content = content.replace(
      /completeTest\(\);/g,
      `window.dispatchEvent(new Event('testComplete'));
      if (typeof completeTest === 'function') completeTest();`
    );
  }

  fs.writeFileSync(path, content);
  console.log('Updated', file);
}
