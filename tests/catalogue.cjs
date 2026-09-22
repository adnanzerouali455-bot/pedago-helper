const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
for (const ext of ['.ts', '.tsx']) require.extensions[ext] = (module, filename) => {
  module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: {
    target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS,
    jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true, resolveJsonModule: true,
  }}).outputText, filename);
};
const { curriculum, curriculumLessons, curriculumCompetency, findCurriculumLesson } = require('../src/components/curriculum.ts');
const { createLocalLesson, isLessonDocument } = require('../src/components/LessonPlanStudio.tsx');
const { createDemoSchedule, isScheduleData } = require('../src/components/TeacherScheduleCalendar.tsx');
assert.equal(curriculum.cycles.length, 2);
assert.equal(curriculum.cycles.flatMap(c => c.levels).length, 6);
assert.equal(curriculumLessons.length, 58);
assert.equal(new Set(curriculumLessons.map(l => l.id)).size, 58);
assert.equal(curriculumLessons.filter(l => l.subject === 'pc').length, 9);
let total = 0;
for (const entry of curriculumLessons) for (const language of ['fr','ar']) {
  assert.equal(findCurriculumLesson(entry.id), entry);
  const input = { language, subject:entry.subject, schoolLevel:entry.schoolLevel, title:entry['title_'+language], competency:curriculumCompetency(entry, language), duration:55, sourceText:'', curriculumLessonId:entry.id };
  const lesson = createLocalLesson(input);
  assert(isLessonDocument(lesson),entry.id);
  assert(isLessonDocument(JSON.parse(JSON.stringify(lesson))));
  assert.equal(lesson.input.curriculumLessonId,entry.id);
  assert.equal(lesson.phases.length,4);
  assert.equal(lesson.phases.reduce((n,p)=>n+p.minutes,0),55);
  assert(lesson.phases[0].situation.includes(entry['title_'+language]));
  for (const level of [1,2,3]) {
    assert.equal(lesson.readings[level].text,'');
    assert.equal(lesson.readings[level].questions.length,3);
  }
  const text='Un texte choisi par le professeur. Une seconde phrase.';
  const withText = createLocalLesson({...input,sourceText:text});
  assert.equal(withText.readings[2].text,text);
  assert.equal(isLessonDocument({...lesson,input:{...input,curriculumLessonId:'missing'}}),false);
  assert.equal(isLessonDocument({...lesson,input:{...input,schoolLevel:'primary'}}),false);
  assert.equal(isLessonDocument({...lesson,input:{...input,subject:'math'}}),false);
  total++;
}
const legacyInput={language:'fr',subject:'svt',schoolLevel:'middle',title:'La photosynthèse',competency:'Expliquer',duration:55,sourceText:''};
assert(isLessonDocument(createLocalLesson(legacyInput)));
assert(createLocalLesson(legacyInput).readings[1].text.includes('photosynthèse'));
const schedule=createDemoSchedule('2026-09-21','fr');
schedule.classes[0].subject='pc';
assert(isScheduleData(schedule));
console.log(`PASS: ${total} fiches bilingues, conservation des titres, persistance, 9 cours de physique-chimie, compatibilité des anciennes fiches.`);
