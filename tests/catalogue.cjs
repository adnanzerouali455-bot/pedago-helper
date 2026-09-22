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
const { localizeLesson, initialInput, localizeLessonInput } = require('../src/components/LessonPlanStudio.tsx');
const { localizeSchedule } = require('../src/components/TeacherScheduleCalendar.tsx');
for (const subject of ['svt','pc','math','arabic','french']) for (const schoolLevel of ['primary','middle','high']) {
  const fr = createLocalLesson({...initialInput('fr', subject),schoolLevel});
  const ar = localizeLesson(fr,'ar');
  const expected = createLocalLesson(localizeLessonInput(fr.input,'ar'));
  assert.deepEqual(ar.phases,expected.phases);
  assert.deepEqual(ar.readings,expected.readings);
  assert.deepEqual(ar.obstacles,expected.obstacles);
  assert.equal(ar.id,fr.id);
  assert.deepEqual(JSON.parse(JSON.stringify(localizeLesson(ar,'fr'))),fr);
  const edited=structuredClone(fr);
  edited.phases[0].minutes=21;
  edited.phases[0].situation='Ma consigne personnelle';
  edited.readings[2].text='Texte personnel à conserver.';
  const result=localizeLesson(edited,'ar');
  assert.equal(result.phases[0].minutes,21);
  assert.equal(result.phases[0].situation,edited.phases[0].situation);
  assert.equal(result.readings[2].text,edited.readings[2].text);
  assert.equal(result.phases[1].teacher,expected.phases[1].teacher);
}
for (const entry of curriculumLessons) {
  const fr=createLocalLesson({...initialInput('fr',entry.subject),schoolLevel:entry.schoolLevel,curriculumLessonId:entry.id,title:entry.title_fr,competency:curriculumCompetency(entry,'fr')});
  const ar=localizeLesson(fr,'ar');
  assert.equal(ar.input.title,entry.title_ar);
  assert(ar.phases[0].situation.includes(entry.title_ar));
  assert(isLessonDocument(ar));
}
const demo=createDemoSchedule('2026-09-21','fr');
const arabic=localizeSchedule(demo,'ar');
assert(arabic.classes.every(c=>!/[A-Za-z]/.test(c.name+c.room)));
assert(arabic.sessions.every(s=>!/[A-Za-z]/.test(s.title+s.competency+s.notes)));
assert.deepEqual(localizeSchedule(arabic,'fr'),demo);
assert(isScheduleData(arabic));
console.log('PASS: traduction immédiate des 5 matières, 3 niveaux scolaires, 58 cours, calendrier et conservation des modifications.');
